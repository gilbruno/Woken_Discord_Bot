import { Network, Alchemy } from 'alchemy-sdk';
import { decodeLogs, getKeccacByEventName, getLogsByTx, getSigner, getTransactionInfos } from '../../../utils/ethers.utils';
import { Log } from '../../../logger/log';
import { WokenHook } from '../woken.hook';
import { AlchemyLogTransaction, callbackWebSocket, eventName, networkType, replacementsTemplate } from './types';
import { buildNotificationText, isNetworkValid } from '../../../utils/utils';
import { templates } from '../../../templates/template';
import SmartContractUtils from '../../../utils/smart.contract.utils';

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
      //log.logger.info(JSON.stringify(tx))
      sendNotificationsToDiscordChannel(TIME_KEEPER_ENABLE_PROPOSAL, tx)
  }

  //----------------------------------------------------------------------------------------------------------
  const callBackTimekeeperProposal = 
    async (tx: AlchemyLogTransaction) => {
      sendNotificationsToDiscordChannel(TIME_KEEPER_PROPOSAL, tx)
  }

  //----------------------------------------------------------------------------------------------------------
  const callBackForceOpenProposal = 
    async (tx: AlchemyLogTransaction) => {
      sendNotificationsToDiscordChannel(FORCE_OPEN_PROPOSAL, tx)
  }

  //----------------------------------------------------------------------------------------------------------
  const callBackPairCreated = 
    async (tx: AlchemyLogTransaction) => {
      sendNotificationsToDiscordChannel(PAIR_CREATED, tx)
  }

  //List of events to listen with their callback functions
  const events: Record<eventName, callbackWebSocket> = {
    'TimekeeperEnableProposal' : callBackTimekeeperEnableProposal,
    'TimekeeperProposal': callBackTimekeeperProposal,
    'ForceOpenProposal': callBackForceOpenProposal,
    'PairCreated': callBackPairCreated
  }

  //----------------------------------------------------------------------------------------------------------
  const sendNotificationsToDiscordChannel = async (eventName: eventName, tx: AlchemyLogTransaction) => {
    const txHash    = tx.transactionHash
    const blockHash = tx.blockHash
    const logs     = await getLogsByTx(alchemy, tx)
    const signerTx  = await getSigner(await getTransactionInfos(alchemy, txHash))

    let pairAddress: string
    let value: number | string
    let pairAdmin: string

    let replacements: replacementsTemplate = {} 
    
    const parsedLog = decodeLogs(CONTRACT_NAME, eventName, logs[0])
    pairAddress = parsedLog.args[0]
    pairAdmin   = await SmartContractUtils.getPairAdmin(factoryAddress, provider, pairAddress)

    if (eventName === TIME_KEEPER_ENABLE_PROPOSAL || eventName === FORCE_OPEN_PROPOSAL) {
      value              = parsedLog.args[1]
      replacements.value = value
    } else if (eventName === PAIR_CREATED) {
      //Do nothing
    } else if (eventName === TIME_KEEPER_PROPOSAL) {
      const timeKeeperPerLp = await SmartContractUtils.getTimeKeeperPerLp(factoryAddress, provider, pairAddress)
      const daysOpenLP      = await SmartContractUtils.getDaysOpenLP(factoryAddress, provider, pairAddress)
      replacements.openingHours   = timeKeeperPerLp.openingHour
      replacements.openingMinutes = timeKeeperPerLp.openingMinute
      replacements.closingHours   = timeKeeperPerLp.closingHour
      replacements.closingMinutes = timeKeeperPerLp.closingMinute
      replacements.utcOffset      = timeKeeperPerLp.utcOffset
      replacements.isOnlyDay      = timeKeeperPerLp.isOnlyDay
      replacements.daysOpen       = daysOpenLP
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

  const subscribeToEvent = (eventName: eventName|string, callBack: (tx: AlchemyLogTransaction) => void) => {
      const filter = {
          address: factoryAddress,
          topics: [getKeccacByEventName(CONTRACT_NAME, eventName)]
      }
      alchemy.ws.on(filter, callBack);
  }

  //Loop through events
  for (const event in events) {
    log.logger.info(`Subscription to event log for address ${factoryAddress} and event ${event}`)
    subscribeToEvent(event, events[event])  
  }

  //Remarks : It works in a non-loop manner as well like below
  //PairCreated Subscription
  // log.logger.info(`Subscription to event log for address ${factoryAddress} and event ${PAIR_CREATED}`)
  // subscribeToEvent(PAIR_CREATED, callBackPairCreated)
  // //TimekeeperEnableProposal Subscription
  // log.logger.info(`Subscription to event log for address ${factoryAddress} and event ${TIME_KEEPER_ENABLE_PROPOSAL}`)
  // subscribeToEvent(TIME_KEEPER_ENABLE_PROPOSAL, callBackTimekeeperEnableProposal)
  // //TimekeeperProposal Subscription
  // log.logger.info(`Subscription to event log for address ${factoryAddress} and event ${TIME_KEEPER_PROPOSAL}`)
  // subscribeToEvent(TIME_KEEPER_PROPOSAL, callBackTimekeeperProposal)
  // //ForceOpenProposal Subscription
  // log.logger.info(`Subscription to event log for address ${factoryAddress} and event ${FORCE_OPEN_PROPOSAL}`)
  // subscribeToEvent(FORCE_OPEN_PROPOSAL, callBackForceOpenProposal)

}  
