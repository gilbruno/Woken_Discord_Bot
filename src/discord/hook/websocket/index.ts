import { Network, Alchemy, Utils, Wallet, Contract } from 'alchemy-sdk';
import { getAbi, getKeccacByEventName } from '../../../utils/ethers.utils';
import { Log } from '../../../logger/log';
import { WokenHook } from '../woken.hook';
import { AlchemyLogTransaction, eventName, network, networkSchema, networkType } from './types';

export async function alchemy_websocket(): Promise<void> {

  const log = new Log()
  const apiKey         = process.env.ALCHEMY_API_KEY
  const factoryAddress = process.env.FACTORY_ADDRESS
  //const privateKey     = process.env.PRIVATE_KEY
  let networkSet: networkType = process.env.NETWORK 
  
  const TIME_KEEPER_ENABLE_PROPOSAL = 'TimekeeperEnableProposal' as const
  const TIME_KEEPER_PROPOSAL        = 'TimekeeperProposal' as const
  const FORCE_OPEN_PROPOSAL         = 'ForceOpenProposal' as const
  
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
  
  const provider = await alchemy.config.getProvider();
  //const signer   = new Wallet(privateKey, provider)

  const filterTimekeeperEnableProposal = {
    address: factoryAddress,
    topics: [getKeccacByEventName(TIME_KEEPER_ENABLE_PROPOSAL)]
  }
  
  const filterTimekeeperProposal = {
    address: factoryAddress,
    topics: [getKeccacByEventName(TIME_KEEPER_PROPOSAL)]
  }

  const filterForceOpenProposal = {
    address: factoryAddress,
    topics: [getKeccacByEventName(FORCE_OPEN_PROPOSAL)]
  }

  const wokenHook = new WokenHook()

  //----------------------------------------------------------------------------------------------------------
  const sendNotificationsToDiscordChannel = async (eventName: eventName, tx: AlchemyLogTransaction) => {
    const txHash   = tx.transactionHash
    const txInfos  = await getTransactionInfos(txHash)
    const signerTx = txInfos.from
    let addressPair: string
    let tokensPair: string
    let value: string
    let pairAdmin: string

    if (eventName === 'TimekeeperEnableProposal') {
      addressPair = Utils.hexValue(txInfos.logs[0].topics[1])
      value       = Utils.hexValue(txInfos.logs[0].data)
      pairAdmin   = await getPairAdmin(addressPair)
    } 

    let msgNotification = `Hey Woken DexAdmin ! \n`
    msgNotification += `An event ${eventName} was emitted by signer address ${signerTx} \n`
    msgNotification += `  ==> Pair : ${addressPair} \n`
    msgNotification += `  ==> Value : ${value} \n`
    msgNotification += `  ==> PairAdmin :  ${pairAdmin}\n`
    msgNotification += `------------------------------------`

    log.logger.info(msgNotification)
    wokenHook.setMsgNotification(msgNotification)
    // wokenHook.sendNotification()
  }


  //----------------------------------------------------------------------------------------------------------
  const getPairAdmin = async (addressPair: string) => {
    const factoryAbi = getAbi('UniswapV2Factory')
    // Load the contract
    const factoryContract = new Contract(factoryAddress, factoryAbi, provider);
    const pairAdmin = await factoryContract.pairAdmin(addressPair)
    return pairAdmin
  }

  //----------------------------------------------------------------------------------------------------------
  const getTransactionInfos = async(txHash: string) => {
    //Call the method to return array of logs
    let txInfos = await alchemy.core.getTransactionReceipt(txHash)
    const txInfosLogs = txInfos.logs[0]
    //Logging the response to the console
    return txInfos
  }

  //----------------------------------------------------------------------------------------------------------
  const getLogs = async(blockHash: string, eventName: string, blockNumber: number) => {
    //Call the method to return array of logs
    let response = await alchemy.core.getLogs({blockHash})

    //Filter response by blockNumber 
    const logs = response.filter(
      (response_elt: any) => {
        return (response_elt.blockNumber === blockNumber 
          && response_elt.topics[0] == getKeccacByEventName(eventName))
      }
      )
    //Logging the response to the console
    //log.logger.info(JSON.stringify(logs, null, 2))
    return logs

  }

  //----------------------------------------------------------------------------------------------------------
  const getTokensPair = async(addressPair: string) => {
      const factoryAbi = getAbi('UniswapV2Factory')
      // Load the contract
      const factoryContract = new Contract(factoryAddress, factoryAbi);
      const pair = await factoryContract.getTokens(addressPair)
      log.logger.info(`PAIR : ${pair}`)
      return pair
  }

  //----------------------------------------------------------------------------------------------------------
  const callBackTimekeeperEnableProposal = 
    async (tx: AlchemyLogTransaction) => {
      const address = tx.address
      log.logger.info(JSON.stringify(tx))
      sendNotificationsToDiscordChannel(TIME_KEEPER_ENABLE_PROPOSAL, tx)
    }

  //----------------------------------------------------------------------------------------------------------
  const callBackTimekeeperProposal = 
    async (tx: AlchemyLogTransaction) => {
      const address = tx.address
      sendNotificationsToDiscordChannel(TIME_KEEPER_PROPOSAL, tx)
  }

  //----------------------------------------------------------------------------------------------------------
  const callBackForceOpenProposal = 
    (tx: AlchemyLogTransaction) => {
      
      sendNotificationsToDiscordChannel(FORCE_OPEN_PROPOSAL, tx)
  }

  //TEST 
  //await getTransactionInfos('0x345d6797a6ee7e9332e2d320b7a60369f61d7cd32fde067ccd6253f4e702a77d')

  const subscribeToEvent = (eventName: eventName, callBack: (tx: AlchemyLogTransaction) => void) => {
      const filter = {
          address: factoryAddress,
          topics: [getKeccacByEventName(eventName)]
      }
      alchemy.ws.on(filter, callBack);
  }

  //TimekeeperEnableProposal Subscription
  log.logger.info(`Subscription to event log for address ${factoryAddress} and event ${TIME_KEEPER_ENABLE_PROPOSAL}`)
  subscribeToEvent(TIME_KEEPER_ENABLE_PROPOSAL, callBackTimekeeperEnableProposal)
  //TimekeeperProposal Subscription
  log.logger.info(`Subscription to event log for address ${factoryAddress} and event ${TIME_KEEPER_PROPOSAL}`)
  subscribeToEvent(TIME_KEEPER_PROPOSAL, callBackTimekeeperProposal)
  //ForceOpenProposal Subscription
  log.logger.info(`Subscription to event log for address ${factoryAddress} and event ${FORCE_OPEN_PROPOSAL}`)
  subscribeToEvent(FORCE_OPEN_PROPOSAL, callBackForceOpenProposal)

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