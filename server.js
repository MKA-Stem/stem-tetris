#!/usr/bin/env node
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const morgan = require("morgan");
const spa = require("express-spa");

const DEV = process.env.NODE_ENV != "production";
const app = express();
const server = http.createServer(app);

// Connect to Datastore
const db = require("@google-cloud/datastore")({
	projectId: process.env.DATASTORE_PROJECT_ID
});

// Setup WS server for events
const wss = new WebSocket.Server({server});

// Middleware
app.use(morgan(DEV?"dev":"combined"));

// Serve the API.
const api = require("./api.js")(db, wss);
app.get("/api/top", api.top);
app.post("/api/submit", api.submit);

// Serve SPA HTML
app.use(spa("./dist/index.html"));
app.use(express.static("dist"));

const PORT = parseInt(process.env.PORT) || 8080;
server.listen(PORT);
console.log("Listening on http://localhost:"+PORT);
