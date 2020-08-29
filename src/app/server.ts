import * as Express from "express";
import * as http from "http";
import * as path from "path";
import * as morgan from "morgan";
import { MsTeamsApiRouter, MsTeamsPageRouter } from "express-msteams-host";
import * as debug from "debug";
import * as compression from "compression";
import { adapter, EchoBot } from './bot';
import { ActivityTypes } from 'botbuilder';
import {ShareActivity} from "../app/ShareActivity"

const log = debug("msteams");

log(`Initializing Microsoft Teams Express hosted App...`);

// Initialize dotenv, to use .env file settings if existing
// tslint:disable-next-line:no-var-requires
require("dotenv").config();

// The import of components has to be done AFTER the dotenv config
import * as allComponents from "./TeamsAppsComponents";

// Create the Express webserver
const express = Express();
// const messageExtension = new MessageExtension();


const port = process.env.port || process.env.PORT || 3007;

// Inject the raw request body onto the request object
express.use(Express.json({
    verify: (req, res, buf: Buffer, encoding: string): void => {
        (req as any).rawBody = buf.toString();
    }
}));
express.use(Express.urlencoded({ extended: true }));

// Express configuration
express.set("views", path.join(__dirname, "/"));

// Add simple logging
express.use(morgan("tiny"));

// Add compression - uncomment to remove compression
express.use(compression());

// Add /scripts and /assets as static folders
express.use("/scripts", Express.static(path.join(__dirname, "web/scripts")));
express.use("/assets", Express.static(path.join(__dirname, "web/assets")));

// routing for bots, connectors and incoming web hooks - based on the decorators
// For more information see: https://www.npmjs.com/package/express-msteams-host
express.use(MsTeamsApiRouter(allComponents));

// routing for pages for tabs and connector configuration
// For more information see: https://www.npmjs.com/package/express-msteams-host
express.use(MsTeamsPageRouter({
    root: path.join(__dirname, "web/"),
    components: allComponents
}));


// Set default web page
express.use("/", Express.static(path.join(__dirname, "web/"), {
    index: "index.html"
}));

// Set the port
express.set("port", port);

// Start the webserver
http.createServer(express).listen(port, () => {
    log(`Server running on ${port}`);
});

// const messageExtension = new MessageExtension();
const bot = new EchoBot();
express.post('/api/messages', (req, res) => { 
    adapter.processActivity(req, res, async (context) => {
        if(context.activity.type==ActivityTypes.Invoke)
        {
            const share = new ShareActivity();
            console.info(context.activity.value)
            const scard =share.getshareadaptivecard(context.activity.value)
            await context.sendActivity({ attachments: [scard] });
            
        }
        else
        {
            
        await bot.run(context);
        }
});
})




// ngrok http 3007 -host-header=localhost:3007