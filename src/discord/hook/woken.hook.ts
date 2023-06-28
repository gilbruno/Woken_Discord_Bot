import { WebhookClient } from "discord.js";
import { Log } from "../../logger/log";

export class WokenHook {

    private log: Log
    private webHookClient: WebhookClient
    private msgNotification
    private url = 'https://discord.com/api/webhooks/1123627152139632640/' as const

    constructor() {
        this.log = new Log()

        const webHookClient = new WebhookClient(
                {
                    url: this.url
                }
            )
    }

    public setMsgNotification(_msg: string) {
        this.msgNotification = _msg
    }

    public sendNotification() {
        this.log.logger.
        this.webHookClient.send(this.msgNotification)
    }

}