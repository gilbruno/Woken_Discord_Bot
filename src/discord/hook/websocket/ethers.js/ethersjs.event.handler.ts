import { getAbi } from "../../../../utils/ethers.utils";
import { JsonRpcProvider, getNetwork } from '@ethersproject/providers';
import { keccak256 } from "@ethersproject/keccak256";
import { toUtf8Bytes } from "@ethersproject/strings";
import { AbiCoder } from "@ethersproject/abi";
import { Log } from "../../../../logger/log";
import { EventHandlers } from "./etherjs.websocket";
import { IEthersJsNotificationSender } from "./etherjs.notification.sender";

export interface IEthersJsEventListener {
    factoryAddress: any;
    listenToEvents(notificationSender: IEthersJsNotificationSender): void;
  }
  
export interface EventDescriptor {
    name: string;
    signature: string;
    decodeParams: string[];
    inputs: any[];
}
  
/**
 * EventHandler Class
 */
export class EthersJsEventListener implements IEthersJsEventListener {
  private provider: JsonRpcProvider;
  private coder: AbiCoder;

    private eventsName = [
        'TimekeeperEnableProposal',
        'TimekeeperProposal',
        'ForceOpenProposal',
        'PairCreated',
        'TimekeeperChange',
        'TimekeeperEnable',
        'ForceOpen',
        'RolePairAdminDaoRequested',
        'RolePairAdminRequested',
    ]

    private handlers: EventHandlers = {
        "CustomEvent1(address,uint256)": ([user, amount]) => {
            console.log(`CustomEvent1 detected! User: ${user}, Amount: ${amount.toString()}`)
        },
        "CustomEvent2(address,string)": ([admin, action]) => {
            console.log(`CustomEvent2 detected! Admin: ${admin}, Action: ${action}`)
        }
        // Add more handlers as needed
    };

    constructor(alchemyAPIKey: string, provider: JsonRpcProvider, public factoryAddress: string, private readonly log: Log) {
        this.provider = provider 
        this.factoryAddress = factoryAddress
        this.coder = new AbiCoder()
    }

    extractEventDescriptors(abi: any[]): EventDescriptor[] {
        return abi
            .filter(
                entry => (entry.type === 'event' && this.eventsName.includes(entry.name)) 
            )
            .map(event => ({
                name: event.name,
                signature: `${event.name}(${event.inputs.map(input => input.type).join(',')})`,
                decodeParams: event.inputs.map(input => input.type),
                inputs: event.inputs
            }))
    }
    listenToEvents(notificationSender: IEthersJsNotificationSender) {
        const abi = getAbi('UniswapV2Factory')
        const events = this.extractEventDescriptors(abi);

        //Display errors in case of errors
        this.provider.on("error", (error) => {
            console.error("Error in provider listener:", error)
        });

        for (const event of events) {
            this.log.logger.info(`Subscription for event ${event.name} for the factory address ${this.factoryAddress}` )
            const eventTopic = keccak256(toUtf8Bytes(event.signature));
            const filter = {
                address: this.factoryAddress,
                topics: [eventTopic]
            };

            this.provider.on(filter, (log) => {
                notificationSender.sendNotificationsToDiscordChannel(event, log)
                // const decodedValues = this.coder.decode(event.decodeParams, log.data)
                // const eventOutput = {}

                // event.inputs.forEach((input, index) => {
                //     eventOutput[input.name] = decodedValues.result[index]
                // });

                // console.log(`Event ${event.name} detected in transaction ${log.transactionHash}!`, eventOutput)
            })
        }
    }
  
}
