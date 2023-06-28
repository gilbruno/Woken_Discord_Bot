declare global {

    namespace NodeJS {
        interface ProcessEnv {
            CLIENT_ID: string,
            TOKEN: string,
            TOKEN_WEBHOOK: string
        }
    }
}

export {}