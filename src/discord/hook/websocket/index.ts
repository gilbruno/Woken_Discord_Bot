import { Network, Alchemy, Utils, Wallet, Contract } from 'alchemy-sdk';
import { decodeLogs, getAbi, getAbiEvent, getAbiEvents, getKeccacByEventName, getSignatureEvent, getSigner, getTransactionInfos } from '../../../utils/ethers.utils';
import { Log } from '../../../logger/log';
import { WokenHook } from '../woken.hook';
import { AlchemyLogTransaction, eventName, network, networkSchema, networkType } from './types';
import { buildNotificationText } from '../../../utils/utils';
import { templates } from '../../../templates/template';

export async function alchemy_websocket(): Promise<void> {

  const log = new Log()
  const apiKey         = process.env.ALCHEMY_API_KEY
  const factoryAddress = process.env.FACTORY_ADDRESS
  //const privateKey     = process.env.PRIVATE_KEY
  let networkSet: networkType = process.env.NETWORK 
  
  const TIME_KEEPER_ENABLE_PROPOSAL = 'TimekeeperEnableProposal' as const
  const TIME_KEEPER_PROPOSAL        = 'TimekeeperProposal' as const
  const FORCE_OPEN_PROPOSAL         = 'ForceOpenProposal' as const
  const PAIR_CREATED                = 'PairCreated' as const
  const CONTRACT_NAME               = 'UniswapV2Factory' as const 

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

  const wokenHook = new WokenHook()

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

  //----------------------------------------------------------------------------------------------------------
  const callBackPairCreated = 
    (tx: AlchemyLogTransaction) => {
      
      sendNotificationsToDiscordChannel(PAIR_CREATED, tx)
  }

  //List of events to listen with their callback functions
  const events = {
    TIME_KEEPER_ENABLE_PROPOSAL : callBackTimekeeperEnableProposal,
    TIME_KEEPER_PROPOSAL: callBackTimekeeperProposal,
    FORCE_OPEN_PROPOSAL: callBackForceOpenProposal,
    PAIR_CREATED: callBackPairCreated
  }

  const eventsList = {...events}

  //----------------------------------------------------------------------------------------------------------
  const filterTimekeeperEnableProposal = {
    address: factoryAddress,
    topics: [getKeccacByEventName(CONTRACT_NAME, TIME_KEEPER_ENABLE_PROPOSAL)]
  }
  
  //----------------------------------------------------------------------------------------------------------
  const filterTimekeeperProposal = {
    address: factoryAddress,
    topics: [getKeccacByEventName(CONTRACT_NAME, TIME_KEEPER_PROPOSAL)]
  }

  //----------------------------------------------------------------------------------------------------------
  const filterForceOpenProposal = {
    address: factoryAddress,
    topics: [getKeccacByEventName(CONTRACT_NAME, FORCE_OPEN_PROPOSAL)]
  }

  //----------------------------------------------------------------------------------------------------------
  const buildNotificationTExt = (eventName: string) => {
    const template = require(``)
  }

  //----------------------------------------------------------------------------------------------------------
  const sendNotificationsToDiscordChannel = async (eventName: eventName, tx: AlchemyLogTransaction) => {
    const txHash    = tx.transactionHash
    const blockHash = tx.blockHash
    const logs      = await getLogs(blockHash, eventName)
    const signerTx  = await getSigner(await getTransactionInfos(alchemy, txHash))

    let pairAddress: string
    let value: number | string
    let pairAdmin: string

    let replacements: any = {} 

    if (eventName === 'TimekeeperEnableProposal') {
      pairAddress = Utils.hexValue(logs[0].topics[1])
      pairAdmin   = await getPairAdmin(pairAddress)
      value       = parseInt(logs[0].data, 16)
      replacements.value = (value===1)?'true':'false'
    } else if (eventName === 'PairCreated') {
      pairAddress = Utils.hexValue(logs[0].topics[1])
      pairAdmin   = await getPairAdmin(pairAddress)
    } else if (eventName === 'TimekeeperProposal') {
      pairAddress = Utils.hexValue(logs[0].topics[1])
      pairAdmin   = await getPairAdmin(pairAddress)
    } else if (eventName === FORCE_OPEN_PROPOSAL) {
      const parsedLog = decodeLogs(CONTRACT_NAME, eventName, logs[0])
      pairAddress = parsedLog.args[0]
      pairAdmin   = await getPairAdmin(pairAddress)
      value       = parsedLog.args[1]
      //console.log(parsedLog)
      replacements.value = value
    }

    replacements = {...replacements, ...{
        signer: signerTx,
        pairAdmin: pairAdmin,
        pairAddress: pairAddress
      }
    }

    let msgNotification = buildNotificationText(templates, eventName, replacements)

    log.logger.info(msgNotification)
    wokenHook.setMsgNotification(msgNotification)
    wokenHook.sendNotification()
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
  const getLogs = async(blockHash: string, eventName?: string, blockNumber?: number) => {
    //Call the method to return array of logs
    let logs = await alchemy.core.getLogs({blockHash})

    //Filter response by blockNumber if exists
    if (eventName !== undefined) {
      logs = logs.filter(
        (response_elt: any) => {
          return (response_elt.topics[0] == getKeccacByEventName(CONTRACT_NAME, eventName))
        }
      )  
      return logs
    }
    
    //Filter response by blockNumber if exists
    if (blockNumber !== undefined) {
      logs = logs.filter(
        (response_elt: any) => {
          return (response_elt.blockNumber === blockNumber)
        }
      )  
      return logs
    }
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


  //TEST 
  //await getTransactionInfos('0x345d6797a6ee7e9332e2d320b7a60369f61d7cd32fde067ccd6253f4e702a77d')

  const subscribeToEvent = (eventName: eventName, callBack: (tx: AlchemyLogTransaction) => void) => {
      const filter = {
          address: factoryAddress,
          topics: [getKeccacByEventName(CONTRACT_NAME, eventName)]
      }
      alchemy.ws.on(filter, callBack);
  }

  // for (const event in events) {
  //   log.logger.info(`Subscription to event log for address ${factoryAddress} and event ${event}`)
  //   subscribeToEvent(TIME_KEEPER_PROPOSAL, events[event])  
  // }

  //const abiEvents = getAbiEvents('UniswapV2Factory')
  //const signature = getSignatureEvent(CONTRACT_NAME, 'PairCreated')
  const abiEvent = getAbiEvent('UniswapV2Factory', 'PairCreated')

  //PairCreated Subscription
  log.logger.info(`Subscription to event log for address ${factoryAddress} and event ${PAIR_CREATED}`)
  subscribeToEvent(PAIR_CREATED, callBackPairCreated)
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