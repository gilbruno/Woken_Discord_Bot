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
import { EthersJsWebsocket } from "./discord/hook/websocket/ethers.js/etherjs.websocket";
import { EthersJsEventListener } from "./discord/hook/websocket/ethers.js/ethersjs.event.handler";
import { EthersJsNotificationSender } from "./discord/hook/websocket/ethers.js/etherjs.notification.sender";
import { JsonRpcProvider } from "@ethersproject/providers";
import EtherJsSmartContractUtils from "./utils/smart.contract.ethersjs.utils";


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
    else if (argv.app == 'websocket_etherjs') {
        await webSocketEtherJs()
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
    const alchemyWebsocket  = new AlchemyWebsocket(eventHandler, notificationSender, log)
    alchemyWebsocket.startWebsocket()
}

async function webSocketEtherJs() {
    const apiKey: string          = process.env.ALCHEMY_API_KEY
    const rpcUrl: string          = process.env.RPC_URL
    const chainId: string         = process.env.CHAIN_ID
    const factoryAddress: string  = process.env.FACTORY_ADDRESS
    const log       = new Log()
    
    // Usage
    const chains = EtherJsSmartContractUtils.getAllChains()
    const chain = chains.filter(
        (elt) => elt.chainId == Number(chainId)
    )
    let chainName = chain[0].chainName
    chainName = (chainName === 'homestead')?'ethereum mainnet':chainName
    chainName = (chainName === 'goerli')?'ethereum goerli':chainName
    
    const provider = new JsonRpcProvider(rpcUrl, {
          name: chainName,
          chainId: chain[0].chainId
        })
    const wokenHook = new WokenHook()
    const eventHandler       = new EthersJsEventListener(provider, factoryAddress, log)
    const notificationSender = new EthersJsNotificationSender(factoryAddress, provider, wokenHook, log)
    const eventListener = new EthersJsWebsocket(eventHandler, notificationSender, log);
    eventListener.startWebsocket();
    

}

/**
 * @todo
 * @param app 
 */
async function checkOnStartup(app: string) {
    //Check if the ABI files are present in the .abi folder
}

// Main function
main(argv)