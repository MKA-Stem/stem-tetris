#!/usr/bin/env node
const request = require("request");
const WebSocket = require("ws");

const appUrl = process.argv[2];
console.log("Requesting ws url from http://" + appUrl);

request("http://" + appUrl + "/api/getWsUrl", (err, resp, body) => {
	console.log("Got from server: " + body);
	let wsUrl = JSON.parse(body)["url"]
	if(typeof wsUrl === "undefined"){process.exit(1)}
	console.log("URL: " + wsUrl)
	let ws = new WebSocket(wsUrl);

	ws.on("open", ()=> console.log("Socket connected."));
	ws.on("message", (data, flags) => console.log(data));
})

