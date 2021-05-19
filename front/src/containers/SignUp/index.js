import React, { useEffect, useState } from 'react';
import '../../scss/Login.scss';
import config from "../../config";
import queryString from 'query-string';
import { Field, reduxForm, change } from 'redux-form';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import {
	Button,
	Link
} from '@material-ui/core';
import { userActions } from '../../redux/actions/userActions';
import { userServices } from '../../redux/services/userServices';
import { Redirect } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
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

const fieldStyle = { width: "30ch", backgroundColor: "white", padding: "15px", margin: "0 15px 15px 15px", fontSize: "16px", borderRadius: "10px" };

const Login = props => {
	const classes = useStyles();
	const [email, setemail] = useState("");
	const [age, setage] = useState(20);
	const [password, setPassword] = useState("");
	const [username, setusername] = useState("");
	const [firstname, setfirstname] = useState("");
	const [name, setname] = useState("");
	const [redirectRecover, setredirectRecover] = useState(false);
	const [redirectlogin, setredirectlogin] = useState(false);


	useEffect(() => {
		const form = props.form;
		if (form && form.values && form.values.email) {
			if (form.values.email.includes("@"))
				setemail(form.values.email);
			else
				setusername(form.values.email);
		}
	}, [])

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
					if (res.status && res.status == 409) {
						props.dispatch(change(`recover`, 'email', email));
						const action = { name: "Recover my password", action: { fonction: setredirectRecover, param: true } };
						toastError(`${res.message}`, action);
					}
					else if (res.statusText && res.statusText === "KO") {
						toastError(`${res.message}`);
					}
					else {
						toastSuccess("A confirmation email has been sent.Please click on the link in it to confirm your account");
						setredirectlogin(true);
					}
				});
		}
	}


	if (redirectlogin) {
		return <Redirect push to="/login" />;
	}
	else if (redirectRecover) {
		return <Redirect push to="/user/resetpassword" />;
	}
	return (
		<div id="login" className="App">
			<div className="login-container">
				<h1 className="title">D.E.scord</h1>
				<p>SignUp</p>
				<ValidatorForm
					onSubmit={connectme}
					onError={errors => console.log(errors)}
				>
					<Typography align="left" style={{ marginLeft: "50px" }} variant="h6" gutterBottom>Email</Typography>
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
					<Typography align="left" style={{ marginLeft: "50px" }} variant="h6" gutterBottom>Name</Typography>
					<TextValidator
						name="name"
						onChange={(e, val) => setname(e.target.value)}
						style={fieldStyle}
						placeholder="Name"
						type="text"
						value={name}
						validators={['required']}
						errorMessages={['The name is required']}
					/>

					<Typography align="left" style={{ marginLeft: "50px" }} variant="h6" gutterBottom>Firstname</Typography>
					<TextValidator
						name="firstname"
						onChange={(e, val) => setfirstname(e.target.value)}
						style={fieldStyle}
						placeholder="Firstname"
						validators={['required']}
						value={firstname}
						errorMessages={['The firstname is required']}
					/>

					<Typography align="left" style={{ marginLeft: "50px" }} variant="h6" gutterBottom>Age</Typography>
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
					<Typography align="left" style={{ marginLeft: "50px" }} variant="h6" gutterBottom>Username</Typography>
					<TextValidator
						name="username"
						onChange={(e, val) => setusername(e.target.value)}
						style={fieldStyle}
						placeholder="Username"
						value={username}
						validators={['required']}
						errorMessages={['The username is required']}
					/>
					<Typography align="left" style={{ marginLeft: "50px" }} variant="h6" gutterBottom>Password</Typography>
					<TextValidator
						name="password"
						type="password"
						style={fieldStyle}
						onChange={(e, val) => setPassword(e.target.value)}
						placeholder="password"
						value={password}
						validators={['required']}
						errorMessages={['The password is required']}
					/>
					<Button
						type="submit"
						variant="contained"
						className="connect"
						color="primary">
						SignUp
						</Button>
				</ValidatorForm>
				<div style={{ marginTop: "10px", cursor: 'pointer' }}>
					<Link onClick={() => setredirectlogin(true)}>Come back to Login</Link>
				</div>
			</div>
		</div>
	);
}

function mapState(state) {

	return ({ form: state.form.recover })
}

const actionCreators = {
	createUser: userActions.login,
	logout: userActions.logout
};

const connectedLogin = connect(mapState, actionCreators)(Login);

export default reduxForm({
	form: 'recover',
})(connectedLogin);
