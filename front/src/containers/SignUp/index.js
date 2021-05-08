import React, { useEffect, useState } from 'react';
import '../../scss/Login.scss';
import config from "../../config";
import queryString from 'query-string';
import { Field, reduxForm } from 'redux-form';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import {
	Button,
	Link
} from '@material-ui/core';
import { userActions } from '../../redux/actions/userActions';
import { userServices } from '../../redux/services/userServices';
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import TextField from '@material-ui/core/TextField';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { toastError, toastSuccess } from '../../redux/actions/alertActions';


const useStyles = makeStyles((theme) => ({
	root: {
		'& > *': {
			margin: theme.spacing(1),
			width: '25ch',
		},
	},
}));

const fieldStyle = { width: "30ch", backgroundColor: "white", padding: "15px", margin: "15px", fontSize: "16px", borderRadius: "10px" };

const Login = props => {
	const classes = useStyles();
	const [email, setemail] = useState("t@t.fr");
	const [age, setage] = useState(20);
	const [password, setPassword] = useState("e");
	const [username, setusername] = useState("e");
	const [firstname, setfirstname] = useState("e");
	const [name, setname] = useState("e");
	const [showpassword, setshowpassword] = useState(false);
	const [redirectlogin, setredirectlogin] = useState(false);
	useEffect(() => {
	}, [props]);

	const connectme = () => {
		if (password && username) {
			const body = JSON.stringify({
				username,
				password,
				name,
				firstname,
				age,
				email,
			});
			userServices.createUser(body)
				.then((res) => {
					if (res.statusText && res.statusText === "KO") {
						toastError(`Error : ${res.message}`);
					}
					else {
						toastSuccess("User created with success. Please check your mailBox");
						setredirectlogin(true);
					}
				});
		}
	}


	if (redirectlogin) {
		return <Redirect push to="/login" />;
	}
	return (
		<div id="login" className="App">
			<div className="login-container">
				<h1 className="title">D.E.scord</h1>
				<p>Inscription</p>
				<ValidatorForm
					onSubmit={connectme}
					onError={errors => console.log(errors)}
				>
					<TextValidator
						name="email"
						onChange={(e, val) => setemail(e.target.value)}
						style={fieldStyle}
						placeholder="Email"
						type="email"
						value={email}
						validators={['required']}
						errorMessages={['The email is required']}
					/>
					<TextValidator
						name="name"
						onChange={(e, val) => setname(e.target.value)}
						style={fieldStyle}
						placeholder="Nom"
						type="text"
						value={name}
						validators={['required']}
						errorMessages={['The name is required']}
					/>
					<TextValidator
						name="firstname"
						onChange={(e, val) => setfirstname(e.target.value)}
						style={fieldStyle}
						placeholder="Firstname"
						validators={['required']}
						value={firstname}
						errorMessages={['The firstname is required']}
					/>
					<TextField
						name="age"
						type="number"
						onChange={(e, val) => setage(e.target.value)}
						style={fieldStyle}
						placeholder={20}
						value={age}
						validators={['required']}
						errorMessages={['The age is required']}
					/>
					<TextValidator
						name="username"
						onChange={(e, val) => setusername(e.target.value)}
						style={fieldStyle}
						placeholder="Username"
						value={username}
						validators={['required']}
						errorMessages={['The username is required']}
					/>
					<TextValidator
						name="password"
						type="password"
						style={fieldStyle}
						onChange={(e, val) => setPassword(e.target.value)}
						placeholder="mot de passe"
						value={password}
						validators={['required']}
						errorMessages={['The password is required']}
					/>
					<Button
						type="submit"
						variant="contained"
						className="connect"
						color="primary">
						S'Inscrire
						</Button>
				</ValidatorForm>
				<div style={{ marginTop: "10px", cursor: 'pointer' }}>
					<Link onClick={() => setredirectlogin(true)}>Revenir au Login</Link>
				</div>
			</div>
		</div>
	);
}

function mapState(state) {
	return ({})
}

const actionCreators = {
	createUser: userActions.login,
	logout: userActions.logout
};

const connectedLogin = connect(mapState, actionCreators)(Login);

export default reduxForm({
	form: 'log_in_form',
})(connectedLogin);
