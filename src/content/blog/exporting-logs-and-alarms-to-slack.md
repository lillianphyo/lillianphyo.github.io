---
title: "Exporting Application Logs and Alarms to Slack with AWS CloudWatch"
date: "2026-04-19"
excerpt: "A practical walkthrough on shipping production logs to CloudWatch, turning them into actionable alarms, and routing them to Slack — all within the AWS Always-Free tier."
author: "Lillian Phyo"
tags: ["aws", "cloudwatch", "slack", "observability", "devops"]
---

# Exporting Application Logs and Alarms to Slack with AWS CloudWatch

Production systems fail in quiet ways. A background worker stops emitting without crashing. A Redis instance starts refusing writes under memory pressure. A database connection pool saturates for ninety seconds and recovers before anyone notices. The shared property of these failures is that nothing in your ticketing queue reflects them — they happen, they pass, and they come back.

The cheapest way I've found to surface this class of failure is to turn existing log lines into CloudWatch metrics, attach alarms, and bridge those alarms to Slack. No agents on the hot path. No paid observability stack. Everything inside the AWS Always-Free tier.

This post walks through the end-to-end setup.

## The shape of the pipeline

```
Application logs ─► CloudWatch Logs
                         │
                         │ metric filter (pattern → count)
                         ▼
                    Custom metric
                         │
                         │ alarm (threshold breach)
                         ▼
                    SNS topic
                         │
                         │ Lambda subscription
                         ▼
                  Slack webhook
```

Every hop is native AWS except the last, which is a short Lambda function that translates the SNS notification into a Slack message.

## Step 1. Ship logs into CloudWatch

There are three paths depending on where the logs live.

**For EC2 applications**, install the CloudWatch Agent and point it at your log files. The agent is configured by a single JSON file, and the relevant section looks like this:

```json
{
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/var/log/myapp/error-*.log",
            "log_group_name": "/myapp/api",
            "log_stream_name": "{hostname}",
            "timezone": "Local"
          }
        ]
      }
    }
  }
}
```

Attach an IAM role to the instance with the `CloudWatchAgentServerPolicy` managed policy, restart the agent, and your logs start flowing within a minute.

**For RDS PostgreSQL**, enable log export on the instance (`cloudwatch-logs-export-configuration` covers `postgresql` and `upgrade` log types). Logs land in `/aws/rds/instance/<db>/postgresql` with no extra software.

**For ElastiCache Redis**, enable the engine log destination in the replication group configuration. No agent needed.

A note on retention: CloudWatch defaults to "never expire". Set every log group to 3 days unless you have a specific reason to keep more. Cheap storage on AWS is still not free, and the default is the single biggest cause of surprise CloudWatch bills I've seen.

```bash
aws logs put-retention-policy \
  --log-group-name /myapp/api \
  --retention-in-days 3
```

## Step 2. Turn log lines into metrics

This is the piece that makes the whole setup possible. A *metric filter* watches a log group for a pattern and emits a numeric metric every time it matches. No code change required in the application.

```bash
aws logs put-metric-filter \
  --log-group-name /myapp/api \
  --filter-name app-api-errors \
  --filter-pattern '?ERROR ?FATAL ?UnhandledRejection ?"Job failed"' \
  --metric-transformations \
      metricName=AppApiErrors,metricNamespace=MyApp,metricValue=1,defaultValue=0
```

The `?TERM` syntax is an OR match — any of those tokens on a line causes a hit. Quoted strings are matched as exact substrings.

The key field is `defaultValue=0`. Without it, the metric is *missing* (not zero) during quiet periods. That distinction matters for the next step.

## Step 3. Alarm on what matters

There are two alarm patterns worth knowing, and they cover roughly 90% of real cases.

### Error-count pattern

"Alert me when something bad shows up in the logs."

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name myapp-api-errors \
  --metric-name AppApiErrors --namespace MyApp \
  --statistic Sum --period 300 --evaluation-periods 1 \
  --threshold 3 --comparison-operator GreaterThanOrEqualToThreshold \
  --treat-missing-data notBreaching \
  --alarm-actions arn:aws:sns:<region>:<account>:myapp-alerts \
  --ok-actions    arn:aws:sns:<region>:<account>:myapp-alerts
```

`treat-missing-data=notBreaching` is correct here: if the metric is absent, the application isn't logging errors, so the alarm stays in OK.

### Heartbeat pattern

"Alert me when something good **stops** showing up."

This is the pattern that catches silent freezes — the class of bug where a worker stops emitting without crashing, so no error is ever logged. You pick a log line that *should* appear on every successful cycle and invert the logic:

```bash
aws logs put-metric-filter \
  --log-group-name /myapp/workers \
  --filter-name worker-heartbeat \
  --filter-pattern '"tick completed"' \
  --metric-transformations \
      metricName=WorkerTickSuccess,metricNamespace=MyApp,metricValue=1

aws cloudwatch put-metric-alarm \
  --alarm-name myapp-worker-heartbeat \
  --metric-name WorkerTickSuccess --namespace MyApp \
  --statistic Sum --period 300 --evaluation-periods 8 \
  --threshold 1 --comparison-operator LessThanThreshold \
  --treat-missing-data breaching \
  --alarm-actions arn:aws:sns:<region>:<account>:myapp-alerts \
  --ok-actions    arn:aws:sns:<region>:<account>:myapp-alerts
```

Two things are different from the error pattern:

1. **No `defaultValue` on the filter.** The metric must go missing when the worker is silent.
2. **`treat-missing-data=breaching`.** Silence now triggers the alarm.

`evaluation-periods 8` with a 5-minute period means forty minutes of silence. Size this to your worker's natural cadence plus a margin — if it ticks once per minute, forty minutes is generous; if it ticks hourly, you need a longer window.

I've caught three separate silent-freeze bugs in production with this exact pattern. Each one would have been invisible otherwise.

## Step 4. The Slack bridge

SNS cannot call an arbitrary HTTPS endpoint with a custom payload shape. Slack's incoming webhooks expect a specific JSON body. The cleanest glue is a small Lambda.

```javascript
const https = require("https");
const { URL } = require("url");

exports.handler = async (event) => {
  const webhook = process.env.SLACK_WEBHOOK;
  if (!webhook) throw new Error("SLACK_WEBHOOK env var missing");
  const u = new URL(webhook);

  for (const r of event.Records || []) {
    let msg;
    try { msg = JSON.parse(r.Sns.Message); }
    catch { msg = { AlarmName: "raw", NewStateReason: r.Sns.Message }; }

    const isAlarm = msg.NewStateValue === "ALARM";
    const emoji = isAlarm
      ? ":rotating_light:"
      : (msg.NewStateValue === "OK" ? ":white_check_mark:" : ":warning:");
    const text = `${emoji} *${msg.AlarmName || "alert"}* — ${msg.NewStateValue || "?"}\n${msg.NewStateReason || ""}`;

    await new Promise((resolve, reject) => {
      const req = https.request(
        {
          hostname: u.hostname,
          path: u.pathname + u.search,
          method: "POST",
          headers: { "Content-Type": "application/json" }
        },
        (res) => { res.on("data", () => {}); res.on("end", resolve); }
      );
      req.on("error", reject);
      req.write(JSON.stringify({ text }));
      req.end();
    });
  }

  return { statusCode: 200 };
};
```

Deploy it as a `nodejs20.x` function with 128 MB memory and a 10 second timeout. Store the webhook URL as an environment variable, not in code. Grant the SNS topic permission to invoke the function:

```bash
aws lambda add-permission \
  --function-name myapp-slack-relay \
  --statement-id sns-invoke \
  --action lambda:InvokeFunction \
  --principal sns.amazonaws.com \
  --source-arn arn:aws:sns:<region>:<account>:myapp-alerts
```

Then subscribe the Lambda to the topic, and you're done. An alarm crossing into ALARM now produces a red-siren line in Slack within a few seconds, and the paired OK transition clears it with a green check.

## Why Lambda instead of AWS Chatbot?

AWS Chatbot has a Slack integration that requires no code. I chose Lambda anyway for one reason: Chatbot needs a Slack workspace admin to approve the AWS Slack app. On a free or shared workspace, that's friction you may not be able to resolve quickly. A thirty-line Lambda calling an incoming webhook has none of those dependencies.

If you have admin control of your workspace and prefer the managed path, Chatbot is fine.

## Cost

The whole stack is designed to fit inside the AWS Always-Free tier, which does not expire after twelve months:

- 10 custom CloudWatch metrics
- 10 CloudWatch alarms (standard resolution)
- 5 GB log ingestion per month
- 5 GB log storage (with 3-day retention, you'll sit well under this)
- 1 million Lambda invocations per month
- 1 million SNS publishes per month

A ten-metric, ten-alarm setup with a few megabytes per day of log volume runs at zero dollars indefinitely. The first paid dollar happens when you add an eleventh metric or alarm, and even then the overage is measured in cents per month per item.

If you want more alarms than ten, the first thing to try is *combining filter patterns*. One metric filter can OR-match many tokens, so a single metric can cover `ERROR`, `FATAL`, `UnhandledRejection`, and any number of exact phrases. You often get three or four logical alerts out of a single metric slot.

## What this doesn't replace

This setup is the floor, not the ceiling. It will not:

- Trace a request through a distributed system
- Profile a slow query
- Tell you *which* user hit the error

If you need those, you need structured logging, tracing, and an APM. But for the question of "did something break in the last five minutes, and if so what", CloudWatch plus a Slack webhook is hard to beat on price or complexity.

## A short checklist

If you're starting from nothing, in order:

1. Ship your application logs to CloudWatch (agent, or built-in export for managed services).
2. Set log group retention to 3 days unless you have a reason not to.
3. Create one metric filter per class of error you care about.
4. Create one alarm per metric, with `notBreaching` for error counts.
5. Identify one "I'm alive" log line per critical worker. Add a heartbeat metric and alarm with `breaching`.
6. Create an SNS topic, a Lambda bridge, and a Slack webhook. Subscribe Lambda to the topic.
7. Point all alarm actions (`ALARM` and `OK`) at the SNS topic.

On a greenfield account this takes an afternoon. On an existing one, most of the time goes into picking good filter patterns and tuning heartbeat windows.

The moment the first red-siren line appears in Slack from a real production incident, the investment has already paid for itself.

---

*If you'd like to discuss observability setups or share the patterns that have worked on your own systems, feel free to reach out.*
