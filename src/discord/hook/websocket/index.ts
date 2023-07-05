import { Network, Alchemy, AlchemySubscription } from 'alchemy-sdk';
import { ethers } from "ethers";
import { getKeccacByEventName } from '../../../utils/ethers.utils';
import { Log } from '../../../logger/log';
import { WokenHook } from '../woken.hook';
import { AlchemyLogTransaction } from './types';

export async function alchemy_websocket(): Promise<void> {

  const log = new Log()

  const apiKey = process.env.ALCHEMY_API_KEY

  const factoryAddress = process.env.FACTORY_ADDRESS
  
  // Optional Config object, but defaults to demo api-key and eth-mainnet.
  const settings = {
    apiKey: apiKey, // Replace with your Alchemy API Key.
    network: Network.ETH_GOERLI, // Replace with your network.
  };
  
  const alchemy = new Alchemy(settings);
  
  //TimekeeperEnableProposal Topic
  
  const filterTimekeeperEnableProposal = {
    address: factoryAddress,
    topics: [getKeccacByEventName('TimekeeperEnableProposal')]
  }
  
  log.logger.info(`Subscription to event log for address ${factoryAddress} and event TimekeeperEnableProposal`)

  const wokenHook = new WokenHook()

  const callBackTimekeeperEnableProposal = 
    (tx: AlchemyLogTransaction) => {
      const address = tx.address
      let msgNotification = `Hey Woken DexAdmin ! `
      msgNotification += `An event TimekeeperEnableProposal was emitted by address ${address}`      
      console.log(msgNotification)
      wokenHook.setMsgNotification(msgNotification)
      wokenHook.sendNotification()
}

  alchemy.ws.on(
      filterTimekeeperEnableProposal,
      callBackTimekeeperEnableProposal
  );

}  
