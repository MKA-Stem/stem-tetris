#!/usr/bin/env node
const DEV = process.env.NODE_ENV != "production";

// Stackdriver agents for prod
if(!DEV){
	const traceAgent = require("@google-cloud/trace-agent").start();
	const debugAgent = require("@google-cloud/debug-agent").start({ allowExpressions: true });
}

const express = require("express");
const WebSocket = require("ws");
const morgan = require("morgan");
const spa = require("express-spa");

const app = express();

// Connect to Datastore
const db = require("@google-cloud/datastore")({
	projectId: process.env.DATASTORE_PROJECT_ID
});

// Setup WS server for events
const WS_PORT = parseInt(process.env.WS_PORT) || 9000;
process.env.WS_PORT = WS_PORT;
const wss = new WebSocket.Server({port:WS_PORT});
console.log("WS listening on ws://localhost:"+WS_PORT)

// Middleware
app.use(morgan(DEV?"dev":"combined"));

// Serve the API.
const api = require("./api.js")(db, wss);
app.get("/api/top", api.top);
app.post("/api/submit", api.submit);
app.get("/api/getWsUrl", api.getWsUrl);

// Serve SPA HTML
app.use(spa("./dist/index.html"));
app.use(express.static("dist"));

const PORT = parseInt(process.env.PORT) || 8080;
process.env.PORT = PORT;
app.listen(PORT);
console.log("Listening on http://localhost:"+PORT);
