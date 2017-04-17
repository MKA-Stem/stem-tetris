const WebSocket = require("ws");
const request = require("request");

module.exports = function(db, wss){
	let api = {};
	
	// Blast a message to all connected sockets.
	let blast = function(msg){
		const jsonString = JSON.stringify(msg);
		wss.clients.forEach(c => {
			if(c.readyState == WebSocket.OPEN){
				c.send(jsonString);
			}
		})
	}
	
	// Submit a score.
	api.submit = function(req, res){
		// Query vars:
		// - name: string, name for leaderboard
		// - score: int, the score itself.
		let key = db.key("Score");

		const obj = {
			score: parseInt(req.query.score),
			name: req.query.name.trim()
		}
		
		// Send the score to all sockets.
		blast(obj);

		// Save the score to db
		db.save({key, data:obj})
			.then(result => { res.status(200).end(); })
			.catch(err => res.status(500).end()); }

	// Get scores.
	api.top = function(req, res){
		// Query vars:
		// - num: int, number of scores to fetch.
		let num = parseInt(req.query.num) || 50
		let query = db.createQuery("Score").order("score", {descending:true}).limit(num);
		db.runQuery(query)
			.then(dbResponse => {
				const results = dbResponse[0].map(e => ({name:e.name, score:e.score}));
				res.status(200).json({results})
			})
			.catch(err => res.status(500).end());
	}

	// Get the external URL of the instance and cache it
	// From https://github.com/GoogleCloudPlatform/nodejs-docs-samples/blob/master/appengine/websockets/app.js
	var wsUrl = null;
	request({
		url: 'http://metadata/computeMetadata/v1//instance/network-interfaces/0/access-configs/0/external-ip',
		headers: {
			'Metadata-Flavor': 'Google'
		}
	}, (err, resp, body) => {
		var url = ""
		if (err || resp.statusCode !== 200) {
			if(process.env.NODE_ENV == "production"){
				throw new Error("Can't find WS URL for this instance, crashing.");
				process.exit(1);
			}
			console.log("Dev mode: Assuming localhost for WS url");
			wsUrl = `localhost:${process.env.WS_PORT}`;
		}else{
			wsUrl = body + ":WS_PORT";
		}
	});

	api.getWsUrl = function getWsUrl(req, res){
		if(!wsUrl){
			res.status(500).json({error:"Fetching... try again later."});
		}else{
			res.status(200).json({url:wsUrl})
		}
	}
	
	return api;
}

