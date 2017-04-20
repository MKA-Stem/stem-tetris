import React from "react";

export default function About(props){
	return <div>
		<h1>STEM Tetris Leaderboard</h1>
		<p>This is a site we put together to keep track of the scores for the STEM Team Tetris competition.</p>
		<p>It runs on GCP, with the app hosted on App Engine, using Datastore for storage, and using Travis for CI/CD.</p>
		<p>If you want to learn to make cool stuff like this, check it out on <a href="//github.com/MKA-Stem/stem-tetris">GitHub</a> or join the STEM Team!</p>
	</div>;
} 
