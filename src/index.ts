import { Client, GatewayIntentBits, WebhookClient } from "discord.js"
import * as dotenv from "dotenv"
import { readdirSync } from "fs"
import { WokenBot } from "./discord/bot/woken.bot";
import { WokenHook } from "./discord/hook/woken.hook";

dotenv.config()

const argv = require('minimist')(process.argv.slice(2));

if (argv.app == 'bot') {
    const wokenBot = new WokenBot()
    wokenBot.login()
}
else if (argv.app == 'hook') {
    const wokenHook = new WokenHook()
    wokenHook.setMsgNotification('2nd Notif from the Discord Hook')
    wokenHook.sendNotification()
}
