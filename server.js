const express = require("express");
const morgan = require("morgan");
const spa = require("express-spa");

const DEV = process.env.DEV != "production";
const app = express();
const api = require("./api.js");

// Middleware
app.use(morgan(DEV?"dev":"combined"));

// Serve the API.
app.get("/api/test", api.test);

// Serve SPA HTML
app.use(spa("./dist/index.html"));
app.use(express.static("dist"));


const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT);
console.log("Listening on http://localhost:"+PORT);
