import { networkType } from "./discord/hook/websocket/types"

declare global {

    namespace NodeJS {
        interface ProcessEnv {
            CLIENT_ID: string,
            TOKEN: string,
            TOKEN_WEBHOOK: string,
            DISCORD_WEBHOOK_URL: string,
            ALCHEMY_API_KEY: string,
            FACTORY_ADDRESS: string,
            PORT: number,
            NETWORK: networkType
        }
    }
}

export {}