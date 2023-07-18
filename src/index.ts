import * as dotenv from "dotenv"
import { WokenBot } from "./discord/bot/woken.bot";
import { alchemy_notify } from "./discord/hook/alchemy_notify";
import { Inquirer } from "./inquirer/inquirer";
import { AlchemyWebsocket } from "./discord/hook/websocket/alchemy.websocket";
import { test } from "./discord/hook/test";
import { networkType } from "./discord/hook/websocket/types";
import { Alchemy } from "alchemy-sdk";
import { WokenHook } from "./discord/hook/woken.hook";
import { Log } from "./logger/log";
import { isNetworkValid } from "./utils/utils";
import { EventHandler } from "./discord/hook/websocket/event.handler";
import { NotificationSender } from "./discord/hook/websocket/notification.sender";

dotenv.config()

const argv = require('minimist')(process.argv.slice(2));


async function main(argv: any) {
    if (argv.app == 'bot') {
        const wokenBot = new WokenBot()
        wokenBot.login()
    }
    else if (argv.app == 'hook') {
        alchemy_notify()
    }
    else if (argv.app == 'test_hook') {
        test()
    }
    else if (argv.app == 'event') {
        const inquirer = new Inquirer()
        inquirer.run()
    }
    else if (argv.app == 'websocket') {
        await webSocket()
    }
}

async function webSocket() {
    const apiKey: string          = process.env.ALCHEMY_API_KEY
    const factoryAddress: string  = process.env.FACTORY_ADDRESS
    const networkSet: networkType = process.env.NETWORK 
    const settings = {
        apiKey: apiKey, 
        network: networkSet
      }
    const alchemy   = new Alchemy(settings)
    const wokenHook = new WokenHook()
    const log       = new Log()
    const provider  = await alchemy.config.getProvider();
     // Validate network before instantiating AlchemyWebsocket
     const network  = {
        type: networkSet
      }
     const errorNetwork = await isNetworkValid(network)

     if (errorNetwork) {
       throw new Error(errorNetwork)
     }
     
    const eventHandler       = new EventHandler(alchemy, factoryAddress)
    const notificationSender = new NotificationSender(alchemy, factoryAddress, provider, wokenHook, log)
    const alchemy_websocket  = new AlchemyWebsocket(eventHandler, notificationSender, log)
    alchemy_websocket.startWebsocket()
}

// Main function
main(argv)