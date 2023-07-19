# Deployment on AWS EC2

## Step 1
Open a terminal where your AWS private key was put


## Step 2
Connect to the server with the SSH Command 

```sh
ssh -i <private_key_file.pem> <username>@<aws_ec2_ip-address>
```


## Step 3

Once connected, change user to _root_ user

```sh
sudo su
```


## Step 4

Go to the directory root of the application

Ex : 

```
cd Woken_Discord_Bot
```

## Step 5

Get the last version of the application

```
git pull
```

## Step 6

Compile the app with this last version

```
npm run build
```


## Step 7

Restart the app with PM2 thanks to the id or name of the app.

```
pm2 restart <id_or_name_app>
```

To know the name of the app, just launch : 

```
pm2 status
```

## Step 8

Check that everything is OK with logs : 

```
pm2 log <id_or_name_app>
```

## Step 9

Enjoy & Chill out : your app is running !










