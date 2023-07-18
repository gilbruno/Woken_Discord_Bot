import { Alchemy, AlchemyProvider } from 'alchemy-sdk';
import { decodeLogs, getKeccacByEventName, getLogsByTx, getSigner, getTransactionInfos } from '../../../utils/ethers.utils';
import { Log } from '../../../logger/log';
import { WokenHook } from '../woken.hook';
import { AlchemyLogTransaction, callbackWebSocket, EventName, networkType, replacementsTemplate } from './types';
import { buildNotificationText, isNetworkValid } from '../../../utils/utils';
import { templates } from '../../../templates/template';
import { CONTRACT_NAME, FORCE_OPEN_PROPOSAL, PAIR_CREATED, TIME_KEEPER_ENABLE_PROPOSAL, TIME_KEEPER_PROPOSAL } from '../../../const/constants';
import SmartContractUtils from '../../../utils/smart.contract.utils';

interface IAlchemyWebsocket {
  startWebsocket(): Promise<void>;
}

interface IEventHandler {
  factoryAddress: any;
  subscribeToEvent(eventName: EventName|string, callBack: (tx: AlchemyLogTransaction) => void): void;
}

interface INotificationSender {
  sendNotificationsToDiscordChannel(eventName: EventName, tx: AlchemyLogTransaction): Promise<void>
}

/**
 * EventHandler Class
 */
export class EventHandler implements IEventHandler {
  
  constructor(private readonly alchemy: Alchemy, public factoryAddress: string) {}

  public subscribeToEvent(eventName: EventName|string, callBack: (tx: AlchemyLogTransaction) => void) {
    const filter = {
      address: this.factoryAddress,
      topics: [getKeccacByEventName(CONTRACT_NAME, eventName)]
    }
    this.alchemy.ws.on(filter, callBack)
  }
}

/**
 * NotificationSender class
 */
export class NotificationSender implements INotificationSender {
  constructor(private readonly alchemy: Alchemy, private readonly factoryAddress: string, private readonly provider: AlchemyProvider,
      private readonly wokenHook: WokenHook, private readonly log: Log) {}

  public async sendNotificationsToDiscordChannel(eventName: EventName, tx: AlchemyLogTransaction) {
    const txHash    = tx.transactionHash
    const blockHash = tx.blockHash
    const logs     = await getLogsByTx(this.alchemy, tx)
    const signerTx  = await getSigner(await getTransactionInfos(this.alchemy, txHash))

    let pairAddress: string
    let value: number | string
    let pairAdmin: string

    let replacements: replacementsTemplate = {} 
    
    const parsedLog = decodeLogs(CONTRACT_NAME, eventName, logs[0])
    pairAddress = parsedLog.args[0]
    pairAdmin   = await SmartContractUtils.getPairAdmin(this.factoryAddress, this.provider, pairAddress)

    if (eventName === TIME_KEEPER_ENABLE_PROPOSAL || eventName === FORCE_OPEN_PROPOSAL) {
      value              = parsedLog.args[1]
      replacements.value = value
    } else if (eventName === PAIR_CREATED) {
      //Do nothing
    } else if (eventName === TIME_KEEPER_PROPOSAL) {
      const timeKeeperPerLp = await SmartContractUtils.getTimeKeeperPerLp(this.factoryAddress, this.provider, pairAddress)
      const daysOpenLP      = await SmartContractUtils.getDaysOpenLP(this.factoryAddress, this.provider, pairAddress)
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

    this.log.logger.info(msgNotification)
    this.wokenHook.setMsgNotification(msgNotification)
    this.wokenHook.sendNotification()

  }
}

/**
 * AlchemyWebsocket Class
 */
export class AlchemyWebsocket implements IAlchemyWebsocket {

  //----------------------------------------------------------------------------------------------------------
  constructor(private readonly eventHandler: IEventHandler, private readonly notificationSender: INotificationSender, private readonly log: Log) {}

  //----------------------------------------------------------------------------------------------------------
  private handleEvent = async (tx: AlchemyLogTransaction, eventName: EventName) => {
    this.notificationSender.sendNotificationsToDiscordChannel(eventName, tx)
}
  //List of events to listen with their callback functions
  public events: Record<EventName, callbackWebSocket> = {
    'TimekeeperEnableProposal' : (tx) => this.handleEvent(tx, EventName.TimekeeperEnableProposal),
    'TimekeeperProposal': (tx) => this.handleEvent(tx, EventName.TimekeeperProposal),
    'ForceOpenProposal': (tx) => this.handleEvent(tx, EventName.ForceOpenProposal),
    'PairCreated': (tx) => this.handleEvent(tx, EventName.PairCreated)
  }

  //----------------------------------------------------------------------------------------------------------
  private subscribeToEvents() {
    //Loop through events
    for (const event in {...this.events}) {
      this.log.logger.info(`Subscription to event log for address ${this.eventHandler.factoryAddress} and event ${event}`)
      this.eventHandler.subscribeToEvent(event, this.events[event])  
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

  //----------------------------------------------------------------------------------------------------------
  public async startWebsocket(): Promise<void> {
    this.subscribeToEvents()
  }  
}
