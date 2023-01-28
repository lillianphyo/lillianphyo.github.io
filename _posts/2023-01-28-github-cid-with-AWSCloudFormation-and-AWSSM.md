---
title: CI-CD for sample nodejs application
date: 2022-08-17 00:00:00 +0630
categories: [aws,github action, dockerhub, cicd]
tags: [operaiton, development]

---
## Solution Overview   

This project tryting to setup CI-CD with AWS Cloud Formation, AWS System Manager, Docker Hub, Docker and GitHub Actions. AWS Cloud Formation will help to provision AWS EC2 infra which contain two EC2 instances, EC2 auto scaling group, 3 IAM policies, 2 security groups and one VPC. Github CI-CD will build and generate docker file for example nodejs application and deploy image on EC2 instances via AWS System Manager.  
   
> This lab only cost 2$ for me.
{: .prompt-warning }
   
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
   + [x] An AWS account with permissions to create the necessary resources.  
   + [x] An GitHub account with permission to Configure GitHub repositories, Create workflows, and configure GitHub secrets
   + [x] A Git client to clone the provide source code. 

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
   + [x] Clone Github Repo
   + [x] Prepare DockerHub
   + [x] Provision AWS infra with Cloud Formation
   + [x] Create user and grant SSM access
     + [x] Create github secret for AWS IAM key and secret
   + [x] Bulild and Deploy
     + [x] Github Action
     + [x] Dockerfile
   + [x] Access the application   
   + [x] Cleaning
   
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
2. create repo via Create repository.   
![Desktop View](/posts/20230128/dkhubrepo.png){: width="972" height="589" }   
Then you will get like this.   
![Desktop View](/posts/20230128/dkhubrepo1.png){: width="972" height="589" }      
3. create docker secret to push image via github action. 
![Desktop View](/posts/20230128/dkhubsc.png){: width="972" height="589" }      
![Desktop View](/posts/20230128/dkhubsc1.png){: width="972" height="589" }     
![Desktop View](/posts/20230128/dkhubsc2.png){: width="972" height="589" }  
Save this credential to use later.   
![Desktop View](/posts/20230128/dkhubsc3.png){: width="972" height="589" }     

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
{: file='ghcicd/.github/workflows/deploy.yaml'}   
   
Later, enter the repo directory from command line and finish the tasks.   
```bash
cd ghcicd
git add .
git commit "first build"
git push -u origin main
```
      
Process will flow like this.
![Desktop View](/posts/20230128/bnd1.png){: width="972" height="589" }   
   
OR you can run manually.   
![Desktop View](/posts/20230128/bnd2.png){: width="972" height="589" }   
   
### Detail Stuffs   
May skip and check later if you want to go through details.
### Github Action   
There is three parts in github action. First build the application, second create docker image and push it to docker hub repository, Finally, deploy docker image on EC2 instances.
We can Declare aws secrets variables in environment variables as option.   

```yaml
# This is a basic workflow to help you get started with Actions
name: CI-CD

# Controls when the action will run. 
on:
  # Triggers the workflow on push or pull request events but only for the main branch
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:
env:
        REPO: nodejs-demo
        AWS_REGION: ap-southeast-1  
        instance_ids: |
           i-0b74b27c04b52197b
           i-011d84c1e4eff7d8d
```
{: file='.github/workflows/deploy.yaml'}
   
As first step, github action workflow will do task named build-test.   
```yaml
# A workflow run is made up of one or more jobs that can run sequentially or in parallel
jobs:
  # This workflow contains multiple jobs
  build_test:
    # The type of runner that the job will run on
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [14.x,16.x]
        
    # Steps represent a sequence of tasks that will be executed as part of the job
    steps:
      # Checks-out your repository under $GITHUB_WORKSPACE, so your job can access it
      - uses: actions/checkout@v2

      - name: setup node
        uses: actions/setup-node@master
        with:
          node-version: ${{ matrix.node-version }}

      # install applicaion dependencies
      - name: Install dependencies
        run: |
          npm install
          npm ci
```
{: file='.github/workflows/deploy.yaml'}
   
As second, github action workflow will do task named push_to_Docker_Hub. This task will build Dockerfile and create container image. Later, it will access to dockerhub and push/submit the image to dockerhub.   
> 'push_to_Docker_Hub' task depend on 'build_test'. means, if build_test failed, push_to_Docker_Hub task may not work.
{: .prompt-info }   
   
```
  push_to_Docker_Hub:
      # The type of runner that the job will run on
      runs-on: ubuntu-latest
      # build docker image and push to docker hub
      # only if the app build and test successfully
      needs: [build_test]

      steps:
        - name: checkout repo
          uses: actions/checkout@v2
      
        - name: Set up QEMU
          uses: docker/setup-qemu-action@v1
      
        - name: Set up Docker Buildx
          uses: docker/setup-buildx-action@v1

        - name: Login to DockerHub
          uses: docker/login-action@v1
          with:
            username: ${{ secrets.DOCKERHUB_USERNAME }}
            password: ${{ secrets.DOCKERHUB_TOKEN }}
      
        - name: Build and push
          uses: docker/build-push-action@v2
          with:
            context: ./
            file: ./Dockerfile
            push: true
            tags: ${{ secrets.DOCKERHUB_USERNAME }}/nodejs-demo:latest
          
        - name: Run the image in a container
          uses: addnab/docker-run-action@v3
          with:
            image: ${{ secrets.DOCKERHUB_USERNAME }}/nodejs-demo:latest
            run: |
              echo "runing the docker image"
              echo "Testing the nodejs  app endpoints"
              echo ${{ steps.docker_build.outputs.digest }}
```
{: file='.github/workflows/deploy.yaml'}
   
As third, github action workflow will do task named deploy. This task will access EC2 instances via AWS System Manager and run the docker command to deploy created container image from docker hub.   
> 'deploy' task depend on 'push_to_Docker_Hub'. means, if push_to_Docker_Hub failed, deploy task may not work.
{: .prompt-info }   
   
```
  deploy:
      needs: [push_to_Docker_Hub]
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v2
         
        - name: AWS SSM Send-Command
          uses: peterkimzz/aws-ssm-send-command@master
          id: ssm
          with:
            aws-region: ${{ env.AWS_REGION }}
            aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
            aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
            instance-ids: ${{ env.instance_ids }}

            working-directory: /tmp
            command: docker pull 270596/nodejs-demo && docker run -d -p 8080:8080 --name nodejs-demo 270596/nodejs-demo
            comment: run application
        
        # Catch SSM outputs
        - name: Get the outputs
          run: echo "The Command id is ${{ steps.ssm.outputs.command-id }}"
```
{: file='.github/workflows/deploy.yaml'}
   
### Dockerfile   

Github action task2 'push_to_Docker_Hub' will use this file to generate container image. In this dockerfile, specify application working direcotry within container, copy application file, running the application and expose application to specific port. This is all heart exit. If this not work, other setup are non-sense.
   
```Dockerfile
FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "index.js" ]
```
{: file='Dockerfile'}
      
## Access the application

Your AWS EC2 Load Balancer address
: nodej-appli-10bj2utmxi5z3-294453507.ap-southeast-1.elb.amazonaws.com   
   
![Desktop View](/posts/20230128/lb.png){: width="972" height="589" }   
   
Port
: 8080   

Link
: <http://nodej-appli-10bj2utmxi5z3-294453507.ap-southeast-1.elb.amazonaws.com:8080/>   
   
## Proof Check   
      
![Desktop View](/posts/20230128/tresult.png){: width="972" height="589" }   
   
![Desktop View](/posts/20230128/wresult.png){: width="972" height="589" }   
   
## Cleaning   
Clean the lab by deleting nodejs-demo stack in Cloud Formation and delete IAM user gh-action.   

> If this step missed, aws will charge you for this lab.
{: .prompt-danger }   
   
## REF:
<https://aws.amazon.com/blogs/devops/integrating-with-github-actions-ci-cd-pipeline-to-deploy-a-web-app-to-amazon-ec2/>   
<https://github.com/marketplace/actions/aws-ssm-send-command>   

Thank You!


