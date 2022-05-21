---
title: SLACK WEBHOOK
date: 2019-07-28 00:00:00 +0630
categories: [chatops]
tags: [slack]
---

ဒီတပတ် slack webhook သုံပြီး သက်ဆိုင်ရာ message channel ထဲကို message push လုပ်ကြမှာဖြစ်ပါတယ်။

Step1) I created slack app by merging one of my created slack workspace at this URL: <https://api.slack.com/apps>

![Window shadow](/posts/20190728/step1.png){: .shadow width="500" height="500" style="max-width: 90%" }

Step2) go to “Incoming Webhooks” to create webhook.

![Window shadow](/posts/20190728/step2.png){: .shadow width="500" height="500" style="max-width: 90%" }

Step3) active incoming webhooks

![Window shadow](/posts/20190728/step3.png){: .shadow width="500" height="500" style="max-width: 90%" }

Step4) create new webbook to workspace or merge webhook to channel

![Window shadow](/posts/20190728/step4.png){: .shadow width="500" height="500" style="max-width: 90%" }

Step5) Then select a channel from your workspace.

![Window shadow](/posts/20190728/step5.png){: .shadow width="500" height="500" style="max-width: 90%" }

Step6)finally got webhook url to work with slack api.

![Window shadow](/posts/20190728/step6.png){: .shadow width="500" height="500" style="max-width: 90%" }

Step7) can sent test message to your channel by using curl.

$curl -X POST -H 'Content-type: application/json' --data '{"text":"Hello, World!"}' https://hooks.slack.com/services/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

