import { Log } from "../../../../logger/log";
import { EventDescriptor, IEthersJsEventListener } from "./ethersjs.event.handler";
import { IEthersJsNotificationSender } from "./etherjs.notification.sender";

// Define interfaces for events
export interface EventHandlers {
    [eventName: string]: (values: any[]) => void;
}

interface IEthersJsWebsocket {
    startWebsocket(): Promise<void>;
  }
  

export class EthersJsWebsocket implements IEthersJsWebsocket{

  //----------------------------------------------------------------------------------------------------------
  constructor(private readonly eventHandler: IEthersJsEventListener, private readonly notificationSender: IEthersJsNotificationSender, private readonly log: Log) {}

  //----------------------------------------------------------------------------------------------------------
  private handleEvent = async (event: EventDescriptor, blockchainLog: any) => {
    this.notificationSender.sendNotificationsToDiscordChannel(event, blockchainLog)
  }
  
  private eventsName = [
    'TimekeeperEnableProposal',
    'TimekeeperProposal',
    'ForceOpenTimelock',
    'PairCreated',
    'TimekeeperChange',
    'TimekeeperEnable',
    'ForceOpen',
    'RolePairAdminDaoRequested',
    'RolePairAdminRequested',
  ]

  public async startWebsocket(): Promise<void> {
    this.eventHandler.listenToEvents(this.notificationSender)
}

}    
