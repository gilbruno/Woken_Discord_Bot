import * as dotenv from "dotenv"
import { WokenBot } from "./discord/bot/woken.bot";
import { alchemy_notify } from "./discord/hook/alchemy_notify";
import { Inquirer } from "./inquirer/inquirer";
import { alchemy_websocket } from "./discord/hook/websocket";


dotenv.config()

const argv = require('minimist')(process.argv.slice(2));

if (argv.app == 'bot') {
    const wokenBot = new WokenBot()
    wokenBot.login()
}
else if (argv.app == 'hook') {
    alchemy_notify()
}

else if (argv.app == 'event') {
    const inquirer = new Inquirer()
    inquirer.run()
}
else if (argv.app == 'websocket') {
    alchemy_websocket()
}
