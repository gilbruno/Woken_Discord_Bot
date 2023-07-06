import { Network, Alchemy, AlchemySubscription } from 'alchemy-sdk';
import { getKeccacByEventName } from '../../../utils/ethers.utils';
import { Log } from '../../../logger/log';
import { WokenHook } from '../woken.hook';
import { AlchemyLogTransaction, network, networkSchema, networkType } from './types';
import { joinString } from '../../../utils/utils';

export async function alchemy_websocket(): Promise<void> {

  const log = new Log()
  const apiKey         = process.env.ALCHEMY_API_KEY
  const factoryAddress = process.env.FACTORY_ADDRESS
  let networkSet: networkType = process.env.NETWORK 
  
  const network = {
    type: networkSet
  }

  const errorNetwork = await isNetworkValid(network)

  if (errorNetwork) {
    log.logger.error(errorNetwork)
    process.exit(1)
  }

  const settings = {
    apiKey: apiKey, // Replace with your Alchemy API Key.
    network: Network.ETH_GOERLI, // Replace with your network.
  };
  
  const alchemy = new Alchemy(settings);
  
  const filterTimekeeperEnableProposal = {
    address: factoryAddress,
    topics: [getKeccacByEventName('TimekeeperEnableProposal')]
  }
  
  const filterTimekeeperProposal = {
    address: factoryAddress,
    topics: [getKeccacByEventName('TimekeeperProposal')]
  }

  const filterForceOpenProposal = {
    address: factoryAddress,
    topics: [getKeccacByEventName('ForceOpenProposal')]
  }

  const wokenHook = new WokenHook()

  //----------------------------------------------------------------------------------------------------------
  const sendNotificationsToDiscordChannel = (address: string, eventName: string) => {
    let msgNotification = `Hey Woken DexAdmin ! `
    msgNotification += `An event ${eventName} was emitted by address ${address}`      
    console.log(msgNotification)
    wokenHook.setMsgNotification(msgNotification)
    wokenHook.sendNotification()
  }

  //----------------------------------------------------------------------------------------------------------
  const callBackTimekeeperEnableProposal = 
    (tx: AlchemyLogTransaction) => {
      const address = tx.address
      sendNotificationsToDiscordChannel(address, 'TimekeeperEnableProposal')
    }

  //----------------------------------------------------------------------------------------------------------
  const callBackTimekeeperProposal = 
    (tx: AlchemyLogTransaction) => {
      const address = tx.address
      sendNotificationsToDiscordChannel(address, 'TimekeeperProposal')
  }

  //----------------------------------------------------------------------------------------------------------
  const callBackForceOpenProposal = 
    (tx: AlchemyLogTransaction) => {
      const address = tx.address
      sendNotificationsToDiscordChannel(address, 'ForceOpenProposal')
  }

  log.logger.info(`Subscription to event log for address ${factoryAddress} and event TimekeeperEnableProposal`)
  //TimekeeperEnableProposal Subscription
  alchemy.ws.on(
      filterTimekeeperEnableProposal,
      callBackTimekeeperEnableProposal
  );

  log.logger.info(`Subscription to event log for address ${factoryAddress} and event TimekeeperProposal`)
  //TimekeeperProposal Subscription
  alchemy.ws.on(
    filterTimekeeperProposal,
    callBackTimekeeperProposal
  );

  log.logger.info(`Subscription to event log for address ${factoryAddress} and event ForceOpenProposal`)
  //ForceOpenProposal Subscription
  alchemy.ws.on(
    filterForceOpenProposal,
    callBackForceOpenProposal
  );

}  

async function isNetworkValid(network: network) {
  let errorMsg = ''
  let parsedObj = null
  try {
      parsedObj = networkSchema.parse(network);
    } catch (error: any) {
      errorMsg = 'Invalid Network set ! '  
      errorMsg += error.issues[0].message
    }
    finally {
      return errorMsg
    }
}