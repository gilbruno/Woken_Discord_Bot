# Deployment on AWS EC2

## Step 1
Open a terminal where your AWS private key was put on your local machine


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

or the name of your discord project

## Step 5

Get the last version of the application

```
git pull
```

Then if your smart contracts do not have changed go directly to step #9, 
otherwise follow these steps.

## Step 6
Generate the ABI of your new smart contract in Remix (There's a button to do this under 'Compile' tab)

## Step 7

In your project, go into the _.abi_ directory.<br>

```
cd .abi
```

Empty the content of the ABI smart contract you want to update.<br>
For instance, if it's _UniswapV2Factory.json_, you can empty the content of the file with the following command

```
> WokenFactory.json
```

## Step 8

Copy the new ABI content into the file.
Edit the file with the command 

```
nano WokenFactory.json
```

Then Paste the content.
Save the newly updated file.

CTRL + O <br>

then <br>

ENTER <br>

then <br>

CTRL + X to go out the file<br>



## Step 9

Compile the app with this last version.<br>
You must be at the root directory of your project.<br>
So if your project is _Woken-Bot-Goerli_, you must be in the root directory of _Woken-Bot-Goerli_.
If you are lost and do not know where you are, just type : 

```
pwd
```

this will indicate you which directory you are in

So, go to the root directory of your app, then type : 

```
npm run build
```


## Step 10

Restart the app with PM2 thanks to the id or name of the app.
<br>

For these _pm2_ command, you do not have to be at the root directory of your app.
<br>
You can type these commands anywhere as _pm2_ is installed globally

```
pm2 restart <id_or_name_app>
```

To know the name of the app, just launch : 

```
pm2 status
```

## Step 11

Check that everything is OK with logs : 

```
pm2 log <id_or_name_app>
```

## Step 12

Enjoy & Chill out : your app is running !










