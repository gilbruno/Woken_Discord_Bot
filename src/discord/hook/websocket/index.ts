import { Network, Alchemy, AlchemySubscription } from 'alchemy-sdk';
import { ethers } from "ethers";
import { getKeccacByEventName } from '../../../utils/ethers.utils';
import { Log } from '../../../logger/log';

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

  const callBackTimekeeperEnableProposal = 
    (tx: any) => {
      console.log(`An event TimekeeperEnableProposal was emitted`)  
      console.log(tx)
    }

  alchemy.ws.on(
      filterTimekeeperEnableProposal,
      callBackTimekeeperEnableProposal
  );

}  
