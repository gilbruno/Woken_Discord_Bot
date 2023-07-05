import { WebhookClient } from "discord.js";
import { Log } from "../../logger/log";

export class WokenHook {

    private log: Log
    private webHookClient: WebhookClient
    private msgNotification
    
    constructor() {
        this.log = new Log()
        
        this.webHookClient = new WebhookClient(
                {
                    url: process.env.DISCORD_WEBHOOK_URL
                }
            )
    }

    public setMsgNotification(_msg: string) {
        this.msgNotification = _msg
    }

    public sendNotification() {
        this.webHookClient.send(this.msgNotification)
    }

}