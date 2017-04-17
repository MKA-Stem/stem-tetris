const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

// Get and normalize process.env.NODE_ENV
const DEV = process.env.NODE_ENV != "production";
process.env.NODE_ENV = DEV ? "development":"production";

module.exports = {
	devtool: "source-map",

	devServer:{
		hot:true,
		port:8080,
		stats:{chunks:false},
		proxy:{
			"/api":{target:"http://localhost:8081"}
		},
		historyApiFallback: {index:"./client/index.html"}, // prev ./client/index.html
	},

	entry:{
		client: "client.js"
	},

	output:{
		path: path.resolve("./dist"),
		filename:"[name].js",
	},

	resolve:{
		// Resolve packages rooted in ./client, the proj dir, and node_modules.
		modules:[path.resolve("./client"), "node_modules"]
	},
	
	plugins:[
		// --- Shared plugins

		// Sync up prod/dev env to builds
		new webpack.EnvironmentPlugin(["NODE_ENV"]),
		
		...(DEV?[ // --- Dev only plugins
			new webpack.HotModuleReplacementPlugin(),
			new webpack.NamedModulesPlugin(),

		]:[       // --- Prod only plugins
			// Copy index.html to output
			new CopyWebpackPlugin([{from:"./client/index.html", to:"index.html"}]),

			// Minify production JS
			new webpack.optimize.UglifyJsPlugin({
				compress:{screw_ie8:true, warnings:false},
				output:{comments:false},
				sourceMap:true
			}),

			// Loader Options, for wp1 compat
			new webpack.LoaderOptionsPlugin({
				minimize:true,
				debug:false,
			})
		])
	],

	module:{rules:[
		{
			test:/\.(sc|sa|c)ss$/,
			use:[
				{loader:"style-loader", options:{sourceMap:true}},
				{loader:"css-loader",   options:{sourceMap:true, modules:true}},
			]
		},
		{
			test:/\.jsx?$/,
			exclude:/node_modules/,
			use:[
				...(DEV?["react-hot-loader"]:[]),
				{loader:"babel-loader", options:{presets:["es2015", "react"]}}
			]
		},
		{
			test:/\.svg$/,
			use:"file-loader"
		}
	]}
	
};
