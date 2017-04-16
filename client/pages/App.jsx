import React from "react";
import {Route} from "react-router-dom";

import styles from "pages/App.css";

const main = props => (
	<div>
		This is the main component.
		<pre>{JSON.stringify(props)}</pre>
	</div>
)

const about = (props) => (
	<div>
		This is the about component.
		<pre>{JSON.stringify(props)}</pre>
	</div>
)

export default function App(props){
	return <div>
		<h1 className={styles.testClass}>This is the app header</h1>
		<pre>Styles: {JSON.stringify(styles)}</pre>
		<Route exact path="/" component={main}/>
		<Route path="/about"  component={about}/>
	</div>
}
