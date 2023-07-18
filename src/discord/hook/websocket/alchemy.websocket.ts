import { Log } from '../../../logger/log';
import { AlchemyLogTransaction, callbackWebSocket, EventName, networkType, replacementsTemplate } from './types';
import { IEventHandler } from './event.handler';
import { INotificationSender } from './notification.sender';

interface IAlchemyWebsocket {
  startWebsocket(): Promise<void>;
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
