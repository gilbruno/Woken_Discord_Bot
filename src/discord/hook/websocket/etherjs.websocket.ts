import { JsonRpcProvider } from "ethers";
import { keccak256 } from "@ethersproject/keccak256";
import { toUtf8Bytes } from "@ethersproject/strings";
import { AbiCoder } from "@ethersproject/abi";

// Define interfaces for events
interface EventDescriptor {
    signature: string;
    decodeParams: string[];
}

interface EventHandlers {
    [eventName: string]: (values: any[]) => void;
}

class EventListener {
    private provider: JsonRpcProvider;
    private contractAddress: string;
    private coder: AbiCoder;

    constructor(alchemyAPIKey: string, contractAddress: string) {
        this.provider = new JsonRpcProvider(`https://goerli.alchemyapi.io/v2/${alchemyAPIKey}`);
        this.contractAddress = contractAddress;
        this.coder = new AbiCoder();
    }

    listenToEvents(events: EventDescriptor[], handlers: EventHandlers) {
        for (const event of events) {
            const eventTopic = keccak256(toUtf8Bytes(event.signature));
            const filter = {
                address: this.contractAddress,
                topics: [eventTopic]
            };

            this.provider.on(filter, (log) => {
                const decoded = this.coder.decode(event.decodeParams, log.data);
                handlers[event.signature](decoded.result);
            });
        }
    }
}

// Usage
const alchemyAPIKey = "YOUR_ALCHEMY_API_KEY";
const contractAddress = "YOUR_CONTRACT_ADDRESS_HERE";

const eventListener = new EventListener(alchemyAPIKey, contractAddress);

const events: EventDescriptor[] = [
    {
        signature: "CustomEvent1(address,uint256)",
        decodeParams: ["address", "uint256"]
    },
    {
        signature: "CustomEvent2(address,string)",
        decodeParams: ["address", "string"]
    }
    // Add more events as needed
];

const handlers: EventHandlers = {
    "CustomEvent1(address,uint256)": ([user, amount]) => {
        console.log(`CustomEvent1 detected! User: ${user}, Amount: ${amount.toString()}`);
    },
    "CustomEvent2(address,string)": ([admin, action]) => {
        console.log(`CustomEvent2 detected! Admin: ${admin}, Action: ${action}`);
    }
    // Add more handlers as needed
};

eventListener.listenToEvents(events, handlers);
