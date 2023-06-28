import { Client, GatewayIntentBits } from "discord.js";
import { Log } from "../../logger/log";

export class WokenBot {

    private log: Log
    private client: Client

    constructor() {
        this.log = new Log()

        this.client = new Client(
            {
                intents:[
                    GatewayIntentBits.Guilds,
                    GatewayIntentBits.GuildMessages,
                    GatewayIntentBits.GuildMessageReactions,
                    GatewayIntentBits.MessageContent
                ]
            }
        )
    }

    public login() {
        this.log.logger.info('Discord Woken Bot try to log in ...')
        this.client.login(process.env.TOKEN)
        this.log.logger.info('Discord Woken Bot is logged ...')
    }
}