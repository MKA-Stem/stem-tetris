const WebSocket = require("ws");

let ws = new WebSocket("ws://localhost:8081");

ws.on("open", ()=> console.log("Socket connected."));
ws.on("message", (data, flags) => console.log(data));
