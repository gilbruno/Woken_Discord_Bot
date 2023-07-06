#!/bin/bash

# Step1 : Use user 'root'
sudo su

# Step2 : Install CURL
apt install curl


# Step3 : Install NVM
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
source ~/.bashrc

# Step4 : Install Node
nvm install node

# Step5 : Install Specifiv Node Version
nvm install 18.16.0 

# Step6 : Install Git
apt update
apt install git-all

# Step7 : Install PM2
npm install pm2 -g

# Step8 : Clone GIT repository
git clone https://github.com/gilbruno/Woken_Discord_Bot.git

# Step9 : Install NPM packages
npm install

# Step10 : Compile the app
npm run build













