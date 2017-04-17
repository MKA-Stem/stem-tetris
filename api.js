const WebSocket = require("ws");

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

	return api;
}

