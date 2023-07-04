import express from "express";
import bodyParser from "body-parser";

export async function alchemy_notify(): Promise<void> {
    const app = express();
  
    const port = "8080";
  
    // Parse the request body as JSON
    app.use(bodyParser.json());
    
    // Register handler for Alchemy Notify webhook events
    app.post("/notify", (req, res) => {
      const webhookEvent = req.body;
      const logs = webhookEvent.event.data.block.logs;
      if (logs.length === 0) {
        console.log("Empty logs array received, skipping");
      } else {
        for (let i = 0; i < logs.length; i++) {
            const topic1 = "0x" + logs[i].topics[1].slice(26); // Remove '0x'
            const data = parseInt(logs[i].data, 16) / 1e18; // Convert hexadecimal string to decimal number
            const from = logs[i].transaction.from.address
            const message = `${topic1} event was emitted by ${from}`;
            console.log(message); // Print message to terminal
        }
      }
      res.sendStatus(200);
    });
  
    // Home page
    app.get("/", (req, res) => {
      res.send('ALCHEMY NOTIFY APP ==> OK')
    });

    // Listen to Alchemy Notify webhook events
    app.listen(port, () => {
      console.log(`ALCHEMY NOTIFY APP listening at ${port}`);
    });
}
  

