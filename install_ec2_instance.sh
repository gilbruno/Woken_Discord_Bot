#!/bin/bash

# Step1 : Use user 'root'
sudo su

# Step1 : Install CURL
apt install curl


# Step2 : Install NVM
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
source ~/.bashrc

# Step3 : Install Node
nvm install node

# Step4 : Install Specifiv Node Version
nvm install 18.16.0 

# Step5 : Install Git
apt update
apt install git-all

# Step6 : Install PM2
npm install pm2 -g

# Step7 : Clone GIT repository
git clone https://github.com/gilbruno/Woken_Discord_Bot.git

# Step8 : Install NPM packages
npm install

# Step9 : Compile the app
npm run build













