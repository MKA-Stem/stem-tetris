const WebSocket = require('ws');
const request = require('request');

module.exports = function(db, wss) {
  let api = {};

  let token = null;
  const fetchToken = function() {
    return db.get(db.key(['Token', '0'])).then(resp => {
      if (typeof resp[0] == 'undefined') {
        return Promise.reject(new Error('No token in DB'));
      }
      token = resp[0].token;
      return Promise.resolve(token);
    });
  };
  fetchToken(); // Get token on app start.

  // Blast a message to all connected sockets.
  let blast = function(msg) {
    const jsonString = JSON.stringify(msg);
    wss.clients.forEach(c => {
      if (c.readyState == WebSocket.OPEN) {
        c.send(jsonString);
      }
    });
  };

  // Submit a score.
  api.submit = function(req, res) {
    // Query vars:
    // - name: string, name for leaderboard
    // - score: int, the score itself.
    // - token: Secret admin token.

    let key = db.key('Score');
    if (req.query.token == token) {
      let obj = {
        score: parseInt(req.query.score),
        name: req.query.name.trim()
      };

      // Save the score to db
      db
        .save({key, data: obj})
        .then(result => {
          res.status(200).end();
          obj.id = result[0].mutationResults[0].key.path[0].id;

          // Send the score to all sockets.
          blast(obj);
        })
        .catch(err => res.status(500).end());
    } else {
      res.status(400).json({error: 'Bad token'});
    }
  };

  api.checkToken = function(req, res) {
    // Check if a token is valid. This will update the locally cached token from db.

    // Query for token obj
    fetchToken()
      .then(t => {
        if (req.query.token === token) {
          // Token is valid
          res.status(200).json({valid: true});
        } else {
          // Token is invalid
          res.status(200).json({valid: false});
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({error: 'Internal error'});
      });
  };

  // Get scores.
  api.top = function(req, res) {
    // Query vars:
    // - num: int, number of scores to fetch.
    let num = parseInt(req.query.num) || 50; // default 50 items.
    let query = db
      .createQuery('Score')
      .order('score', {descending: true})
      .limit(num);
    db
      .runQuery(query)
      .then(dbResponse => {
        const results = dbResponse[0].map(e => ({
          name: e.name,
          score: e.score,
          id: e[db.KEY].path[1]
        }));

        res.status(200).json({results});
      })
      .catch(err => {
        console.log(err);
        res.status(500).end();
      });
  };

  // Get the external URL of the instance and cache it
  // From https://github.com/GoogleCloudPlatform/nodejs-docs-samples/blob/master/appengine/websockets/app.js
  var wsUrl = null;
  request(
    {
      url:
        'http://metadata/computeMetadata/v1//instance/network-interfaces/0/access-configs/0/external-ip',
      headers: {
        'Metadata-Flavor': 'Google'
      }
    },
    (err, resp, body) => {
      var url = '';
      if (err || resp.statusCode !== 200) {
        if (process.env.NODE_ENV == 'production') {
          throw new Error("Can't find WS URL for this instance, crashing.");
        }
        wsUrl = `ws://localhost:${process.env.WS_PORT}`;
      } else {
        wsUrl = `ws://${body}:${process.env.WS_PORT}`;
      }
    }
  );

  api.getWsUrl = function getWsUrl(req, res) {
    if (!wsUrl) {
      res.status(500).json({error: 'Fetching... try again later.'});
    } else {
      res.status(200).json({url: wsUrl});
    }
  };

  return api;
};
