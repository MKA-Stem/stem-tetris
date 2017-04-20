import React from "react";
import styles from "pages/Submitter.css";
import {TextField, NumericField, Button} from "components/FormControls.jsx";


export default class Submitter extends React.Component{
	constructor(props){
		super(props);
		this.token = localStorage.getItem("token");
		this.state = {
			name: {value:"", valid:true, nag:""},
			score:{value:"", valid:true, nag:""}
		}
	}

	reset(){
		this.setState({
			name: {value:"", valid:true, nag:""},
			score:{value:"", valid:true, nag:""}
		})
	}

	onSubmit(){
		if(this.isValid()){
			const e = val => encodeURIComponent(val);
			const url = `/api/submit`
				+ `?name=${e(this.state.name.value)}`
				+ `&score=${e(this.state.score.value)}`
				+ `&token=${e(this.token)}`;
			fetch(url, {method:"POST"})
				.then(res => {
					if(res.ok){this.reset()}
					else{
						alert("Error submitting.\nTry checking the token.");
					}
				})
				.catch(err => alert("Error submitting."));
		}else{
			console.log("Nope.");
		}
	}

	isValid(){
		return ![this.state.name, this.state.score]
			.map(e => !e.valid) // Get if invalid
			.some(e => e) // Any are invalid
	}

	onChange(e){
		const value = e.target.value;
		const name  = e.target.name;
		var valid = true;
		var nag = "";

		switch(name){
			case "name":
				valid = value.length < 50;
				nag = "Name must be shorter than 50 characters.";
				break;
			case "score":
				valid = value > 10;
				nag = "Score must be greater than 10."
				break;
		}

		this.setState({
			[name]:{value, valid, nag}
		});
	}

	render(){
		return <div>
			<h1>Submit a score</h1>
			<form className={styles.formContainer}>
				<TextField
					label="Name"
					name="name"
					id="input-name"
					onChange={e => this.onChange(e)}
					{...this.state.name}
				/>

			<NumericField
				label="Score"
				name="score"
				id="input-score"
				onChange={e => this.onChange(e)}
				{...this.state.score}
			/>

			<Button 
				text="Add Score" 
				onClick={() => this.onSubmit()} 
				active={this.isValid()}
			/>
		</form>
	</div>
	}
}

