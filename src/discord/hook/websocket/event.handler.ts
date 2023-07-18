import { Alchemy } from "alchemy-sdk";
import { AlchemyLogTransaction, EventName } from "./types";
import { getKeccacByEventName } from "../../../utils/ethers.utils";
import { CONTRACT_NAME } from "../../../const/constants";

export interface IEventHandler {
    factoryAddress: any;
    subscribeToEvent(eventName: EventName|string, callBack: (tx: AlchemyLogTransaction) => void): void;
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
  