import { WebhookClient } from "discord.js";
import { Log } from "../../logger/log";

export class WokenHook {

    private log: Log
    private webHookClientProposal: WebhookClient
    private webHookClientEvents: WebhookClient
    private msgNotification
    
    constructor() {
        this.log = new Log()
        
        this.webHookClientProposal = new WebhookClient(
                {
                    url: process.env.DISCORD_WEBHOOK_PROPOSAL_URL
                }
            )
        this.webHookClientEvents = new WebhookClient(
            {
                url: process.env.DISCORD_WEBHOOK_EVENTS_URL
            }
        )
    }

    public setMsgNotification(_msg: string) {
        this.msgNotification = _msg
    }

    public async sendNotificationProposal() {
        await this.webHookClientProposal.send(this.msgNotification)
    }
    public async sendNotificationEvents() {
        await this.webHookClientEvents.send(this.msgNotification)
    }

}