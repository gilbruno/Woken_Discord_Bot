import { networkType } from "./discord/hook/websocket/types"

declare global {

    namespace NodeJS {
        interface ProcessEnv {
            CLIENT_ID: string,
            TOKEN: string,
            TOKEN_WEBHOOK: string,
            DISCORD_WEBHOOK_PROPOSAL_URL: string,
            DISCORD_WEBHOOK_EVENTS_URL: string,
            ALCHEMY_API_KEY: string,
            FACTORY_ADDRESS: string,
            RPC_URL: string,
            CHAIN_ID: string,
            PORT: number,
            NETWORK: networkType,
            PRIVATE_KEY: string
        }
    }
}

export {}