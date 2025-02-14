---
title: CI-CD for sample nodejs application
date: 2022-08-17 00:00:00 +0630
categories: [aws,github action, dockerhub, cicd]
tags: [operaiton, development]
---
## Solution Overview

This project tryting to setup CI-CD with AWS Cloud Formation, AWS System Manager, Docker Hub, Docker and GitHub Actions. AWS Cloud Formation will help to provision AWS EC2 infra which contain two EC2 instances, EC2 auto scaling group, 3 IAM policies, 2 security groups and one VPC. Github CI-CD will build and generate docker file for example nodejs application and deploy image on EC2 instances via AWS System Manager.

> This lab only cost 2$ for me.
> {: .prompt-warning }

The solution utilizes the following services:

1. GitHub Actions – Workflow Orchestration tool that will host the Pipeline.
2. AWS Auto Scaling – AWS Service to help maintain application availability and elasticity by automatically adding or removing Amazon EC2 instances.
3. Amazon EC2 – Destination Compute server for the application deployment.
4. AWS CloudFormation – AWS infrastructure as code (IaC) service used to spin up the initial infrastructure on AWS side.
5. IAM OIDC identity provider – Federated authentication service to establish trust between GitHub and AWS to allow GitHub Actions to deploy on AWS without maintaining AWS Secrets and credentials.
6. Amazon System Manager – to run Ad-Hoc command inside EC2 instances.

## Architecuture Overview

![Desktop View](/posts//20230128/ArchitectureDiagram.png){: width="972" height="589" }

1. Developer commits code changes from their local repo to the GitHub repository.The GitHub action is triggered automatically.
2. GitHub action triggers the build stage.
3. GitHub uses the AWS Access Key to authenticate to AWS and access resources.
4. GitHub action uploads build the simple nodejs application docker image.
5. GitHub action upload continaer image to docker hub.
6. GitHub action execute linux docker run command to EC2 instances via AWS System Manager.

- Prerequisties
+ [X] An AWS account with permissions to create the necessary resources.
+ [X] An GitHub account with permission to Configure GitHub repositories, Create workflows, and configure GitHub secrets
+ [X] A Git client to clone the provide source code.

Install on Ubuntu

```bash
type -p curl >/dev/null || sudo apt install curl -y
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg \
&& sudo chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg \
&& echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
&& sudo apt update \
&& sudo apt install gh git wget -y
```

Install on Centos

```bash
sudo dnf install 'dnf-command(config-manager)'
sudo dnf config-manager --add-repo https://cli.github.com/packages/rpm/gh-cli.repo
sudo dnf install gh git wget -y
```

- Task List
+ [X] Clone Github Repo
+ [X] Prepare DockerHub
+ [X] Provision AWS infra with Cloud Formation
+ [X] Create user and grant SSM access
  + [X] Create github secret for AWS IAM key and secret
+ [X] Bulild and Deploy
  + [X] Github Action
  + [X] Dockerfile
+ [X] Access the application
+ [X] Cleaning

## Clone Github Repo

1. Clone the githubrepository [**lillianphyo/nodejs-demo**](https://github.com/lillianphyo/nodejs-demo.git)

```bash
git clone https://github.com/lillianphyo/nodejs-demo.git
```

2. Create empty repository in your github personal account.

```bash
mkdir ghcicd
cp -r nodejs-demo/. ghcicd
cd ghcicd
git remote remove origin
rm -rf .git
gh repo create ghcicd --public --source=. -y
git remote add origin https://github.com/<github-username>/ghcicd.git
git branch -M main
git add .
git commit -m "fist commit"
git push -u origin main
```

### GitHub Action

## Prepare Docker Hub

1. if you have docker hub account? SignIN [**Here**](https://hub.docker.com/): SignUP [**Here**](https://hub.docker.com/);
2. create repo via Create repository.![Desktop View](/posts/20230128/dkhubrepo.png){: width="972" height="589" }Then you will get like this.![Desktop View](/posts/20230128/dkhubrepo1.png){: width="972" height="589" }
3. create docker secret to push image via github action.
  ![Desktop View](/posts/20230128/dkhubsc.png){: width="972" height="589" }![Desktop View](/posts/20230128/dkhubsc1.png){: width="972" height="589" }![Desktop View](/posts/20230128/dkhubsc2.png){: width="972" height="589" }Save this credential to use later.![Desktop View](/posts/20230128/dkhubsc3.png){: width="972" height="589" }
4. Update Docker Hub credentilas to repo.
  ![Desktop View](/posts/20230128/ghsc.png){: width="972" height="589" }
  ![Desktop View](/posts/20230128/ghsc1.png){: width="972" height="589" }
  ![Desktop View](/posts/20230128/ghsc2.png){: width="972" height="589" }
  ![Desktop View](/posts/20230128/ghsc3.png){: width="972" height="589" }

## Provision AWS infra with Cloud Formation

To provision EC2 instance with atuo scaling grop and configure ALB from AWS Cloud Formation Template. Application steps are as follow.

1. Open [**AWS CloudFormation**](https://console.aws.amazon.com/cloudformation/home) console, Enter your account ID, username and passowrd.
2. Check your region is ap-southease-1 (singapore).
3. Create New Stack
4. Select Template is Ready
5. Select Upload a template file
6. Choose File under "ghcicd/cloudformation/deployment.yml"
7. Select deployment.yml file and select next.

![Desktop View](/posts/20230128/cf1.png){: width="972" height="589" }

8. In stack detail,

- stack name: nodejs-demo
- VPC and Subnets: (these are pre-populated for you) you can change these values if you prefer to use your own Subnets)
- GitHubRepoName: Name of your GitHub personal repository which you created.

![Desktop View](/posts/20230128/cf2.png){: width="972" height="589" }

![Desktop View](/posts/20230128/cf3.png){: width="972" height="589" }

## Create user and grant SSM access

In this session, IAM user create and grant for AWS System Manager permission for github action.

![Desktop View](/posts/20230128/iam.png){: width="972" height="589" }

![Desktop View](/posts/20230128/iam1.png){: width="972" height="589" }

![Desktop View](/posts/20230128/iam2.png){: width="972" height="589" }

![Desktop View](/posts/20230128/iam3.png){: width="972" height="589" }

![Desktop View](/posts/20230128/iam4.png){: width="972" height="589" }

![Desktop View](/posts/20230128/iam5.png){: width="972" height="589" }

![Desktop View](/posts/20230128/iam6.png){: width="972" height="589" }

![Desktop View](/posts/20230128/iam7.png){: width="972" height="589" }

![Desktop View](/posts/20230128/iam8.png){: width="972" height="589" }

![Desktop View](/posts/20230128/iam9.png){: width="972" height="589" }

### Create github secret for AWS IAM key and secret

![Desktop View](/posts/20230128/iam-ghsc4.png){: width="972" height="589" }

![Desktop View](/posts/20230128/iam-ghsc5.png){: width="972" height="589" }

## Bulild and Deploy

Check EC2 instance id from [**AWS console**](https://console.aws.amazon.com/ec2/v2/home) and update the instance ids at githubcicd/.github/workflows/deploy.yaml. If you build this in different region,you can change your region at AWS_REGION envioronment variable. My region is ap-southeast-1.
![Desktop View](/posts/20230128/ec2.png){: width="972" height="589" }

```yaml
env:
      REPO: nodejs-demo
      AWS_REGION: ap-southeast-1  
      instance_ids: |
          i-0b74b27c04b52197b
          i-011d84c1e4eff7d8d
```
