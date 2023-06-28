import { Client, GatewayIntentBits } from "discord.js"
import * as dotenv from "dotenv"
import { readdirSync } from "fs"

dotenv.config()

const client = new Client(
    {
        intents:[
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.MessageContent
        ]
    }
)

client.login(process.env.TOKEN)
