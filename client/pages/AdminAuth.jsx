import React from "react";
import {Redirect} from "react-router";

export default class AdminAuth extends React.Component{
	constructor(props){
		super(props);
		this.state = {validating:true};
	}

	componentDidMount(){
		const token = this.props.match.params.token;
		fetch(`/api/checkToken?token=${encodeURIComponent(token)}`)
			.then(resp => resp.json())
			.then(x => {
				if(x.valid){
					// Token is valid
					this.setState({valid:true});
					localStorage.setItem("token", token);

				}else{
					this.setState({valid:false});
				}
				this.setState({validating:false});
			});
	}

	render(){
		if(this.state.validating){
			return <h1>Validating token...</h1>;
		}else if(this.state.valid){
			return <Redirect to="/admin/submit"/>;
		}else{
			return <div>
				<h1>Error: Invalid token</h1>
				<p>Have you checked the URL?</p>
			</div>
		}
		
	}
}
