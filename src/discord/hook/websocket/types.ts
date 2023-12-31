import { Network } from "alchemy-sdk";
import { z } from "zod";

export type AlchemyLogTransaction = {
    blockNumber: number,
    blockHash: string,
    transactionIndex: number,
    removed: boolean,
    address: string,
    data: string,
    topics: string[],
    transactionHash: string,
    logIndex: number
}

export type networkType = Network.ETH_GOERLI | Network.ETH_SEPOLIA | Network.ETH_MAINNET 
    
const networkTypeSchema = z.enum([Network.ETH_GOERLI, Network.ETH_SEPOLIA, Network.ETH_MAINNET])


export const networkSchema = z.object(
    {
        type: networkTypeSchema
    }
)

export type network = z.infer<typeof networkSchema>

export interface ChainInfo {
    chainName: string;
    chainId: number;
}

//export type eventName = 'TimekeeperEnableProposal' | 'TimekeeperProposal' | 'ForceOpenTimelock' | 'PairCreated'

export enum EventName {
    TimekeeperEnableProposal  = 'TimekeeperEnableProposal',
    TimekeeperProposal        = 'TimekeeperProposal',
    ForceOpenTimelock         = 'ForceOpenTimelock',
    PairCreated               = 'PairCreated',
    TimekeeperChange          = 'TimekeeperChange',
    TimekeeperEnable          = 'TimekeeperEnable',
    ForceOpen                 = 'ForceOpen',
    RolePairAdminDaoRequested = 'RolePairAdminDaoRequested',
    RolePairAdminRequested    = 'RolePairAdminRequested'

  }

export type replacementsTemplate = {
    pairAdmin?: string,
    pairAddress?: string,
    pairSymbol?: string,
    value?: number | string,
    daysOpen?: string,
    openingHours?: string,
    openingMinutes?: string,
    closingHours?: string,
    closingMinutes?: string,
    utcOffset?: string,
    isOnlyDay?: string,
    chain?: string

}

export type callbackWebSocket = (tx: AlchemyLogTransaction) => Promise<void>