import express from "express";
import bodyParser from "body-parser";
import { getMappingEventNameKeccac, getMappingKeccacEventName, reverseJsonObject } from "../../../utils/ethers.utils";
import { WokenHook } from "../woken.hook";

export async function alchemy_notify(): Promise<void> {
    const app = express();
  
    const port = `${process.env.PORT}`;
    
    const CONTRACT_NAME = 'UniswapV2Factory'

    // Parse the request body as JSON
    app.use(bodyParser.json());
    
    // Register handler for Alchemy Notify webhook events
    app.post("/notify", (req, res) => {
      const webhookEvent = req.body;
      const logs = webhookEvent.event.data.block.logs;
      if (logs.length === 0) {
        console.log("Empty logs array received, skipping");
      } else {
        const mappingKeccacEvents = getMappingKeccacEventName(CONTRACT_NAME)
        const wokenHook = new WokenHook()
        for (let i = 0; i < logs.length; i++) {
          const topicEventName = logs[i].topics[0]
          const eventName      = mappingKeccacEvents[topicEventName] 
          console.log(`eventName : ${eventName}`)   
          //const topic1 = "0x" + logs[i].topics[1].slice(26); // Remove '0x'
          //const data = parseInt(logs[i].data, 16) / 1e18; // Convert hexadecimal string to decimal number
          const from = logs[i].transaction.from.address
          const message = `${eventName} event was emitted by ${from}`;
          // wokenHook.setMsgNotification('2nd Notif from the Discord Hook')
          // wokenHook.sendNotification()
          console.log(message); // Print message to terminal
        }
      }
      res.sendStatus(200);
    });
  
    // Home page
    app.get("/", (req, res) => {
      res.send('ALCHEMY NOTIFY APP ==> OK')
    });

    // Keccac Event Pages
    app.get("/keccac_event", (req, res) => {
      const keccacEvents = getMappingEventNameKeccac(CONTRACT_NAME)
      const response = JSON.stringify(keccacEvents, null, 2)
      res.send(response)
    });

    // Listen to Alchemy Notify webhook events
    app.listen(port, () => {
      console.log(`ALCHEMY NOTIFY APP listening at ${port}`);
    });
}
  

