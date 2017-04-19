import React from "react";
import styles from "pages/Submitter.css";

const Field = ({label, type, validator, id}) => (<div className={styles.formGroup}>
	<label htmlFor={id}>{label}</label>
	<br/>
	<input className={styles.formEntry} type={type} id={id}></input>
</div>)

const Button = ({text, onClick}) => (
	<button 
		className={styles.formButton} 
		type="button" 
		onClick={onClick}>
		{text}
	</button>
)

export default function Submitter(props){
	const token = props.match.params.token;
	return <div>
		<h1>Submit a score</h1>
		<form>
			<Field label="Name" type="text" id="player-name"/>
			<Field label="Score" type="number" id="player-score"/>
			<Button text="Add Score" onClick={()=> alert("test")}/>
		</form>
	</div>
}
