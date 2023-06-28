
# Prerequisite


You must have : 
 - node
 - npm

installed on your host

# Settings

## Node dependencies

To install dependencies, just run the following command :

```sh
npm install
```

## Discord

Connect to the _Discord Developer Portal_ on the URL : _https://discord.com/developers_.<br>
If you have a Discord account, you will be connected with this account automatically.

### Create an App

Use the left menu for that

<img src="./src/images/Discord_create_app.png" alt="Create =Discord App" title="Optional title">

### Create a Bot

Use the left menu for that.
The token will be used to login your bot to a server.

<img src="./src/images/Discord_create_bot.png" alt="Create =Discord App" title="Optional title">

You must Grant  all _Privileged Gateway Intents_ : 

 - PRESENCE INTENT
 - SERVER MEMBERS INTENT
 - MESSAGE CONTENT INTENT


### Add a bot to a server

In order to do that, you will run a endpoint (HTTP Request) to add your bot to the server you want.
Even if you are not the administrator of the server.<br>
So, you must generate the URL endpoint.<br>
To do that, go to _OAuth2 > URL Generator_.<br>
Then, in _SCOPES_ block, select _bot_ and in _BOT PERMISSIONS BOT_ select _Administrator_.<br>
After selecting these 2 values, the _GENERATED URL_ appears in the bottom of the page.<br>
Like below :

<img src="./src/images/Bot_Url_Generator.png" alt="Create =Discord App" title="Optional title">

Ex : https://discord.com/api/oauth2/authorize?client_id=<My_Client_Id>&permissions=8&scope=bot

When execute this URL in a browser, the UI will suggest you all the server where you have _admin_ role : 
 - on a server
 - on at least one channel where you have _admin_ roles or enough big roles.

If you choose a Discord server where you are an admin, you will get a notification to add/grant the new Bot on your server.
If you choose a Discord server where you are an admin, the Discord server admn will be notified that someone wants to add a bot on his/her server.
Once the bot added/granted in the server, you will be able to login your bot to this server.






