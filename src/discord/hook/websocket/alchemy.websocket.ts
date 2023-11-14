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
    'ForceOpenTimelock': (tx) => this.handleEvent(tx, EventName.ForceOpenTimelock),
    'PairCreated': (tx) => this.handleEvent(tx, EventName.PairCreated),
    'TimekeeperChange': (tx) => this.handleEvent(tx, EventName.TimekeeperChange),
    'TimekeeperEnable': (tx) => this.handleEvent(tx, EventName.TimekeeperEnable),
    'ForceOpen': (tx) => this.handleEvent(tx, EventName.ForceOpen),
    'RolePairAdminDaoRequested': (tx) => this.handleEvent(tx, EventName.RolePairAdminDaoRequested),
    'RolePairAdminRequested' : (tx) => this.handleEvent(tx, EventName.RolePairAdminRequested),
  }

  //----------------------------------------------------------------------------------------------------------
  private subscribeToEvents() {
    //Loop through events
    for (const event in {...this.events}) {
      this.log.logger.info(`Subscription to event log for address ${this.eventHandler.factoryAddress} and event ${event}`)
      this.eventHandler.subscribeToEvent(event, this.events[event])  
    }
  }

  //----------------------------------------------------------------------------------------------------------
  public async startWebsocket(): Promise<void> {
    this.subscribeToEvents()
  }  
}
