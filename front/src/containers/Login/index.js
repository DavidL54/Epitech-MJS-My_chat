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
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { Redirect } from 'react-router-dom';
import { toastError, toastSuccess } from '../../redux/actions/alertActions';

const useStyles = makeStyles((theme) => ({
	root: {
		'& > *': {
			margin: theme.spacing(1),
			width: '25ch',
		},
	},
}));

const fieldStyle = { width: "25ch", backgroundColor: "white", padding: "15px", margin: "15px", fontSize: "16px", borderRadius: "10px" };

const Login = props => {
	const classes = useStyles();
	const [redirect, setredirect] = useState(false);
	const [password, setPassword] = useState();
	const [username, setUsername] = useState();
	const [showpassword, setshowpassword] = useState(false);
	const [redirectSignup, setredirectSignup] = useState(false);
	const [redirectRecover, setredirectRecover] = useState(false);

	useEffect(() => {
	}, [props, redirect]);

	const connectme = () => {
		if (password && username) {
			const body = JSON.stringify({
				username: username,
				password: password,
			});
			props.login(body, setredirectRecover);
		}
	}

	const changeusername = (e) => {
		props.dispatch(change(`recover`, 'email', e.target.value));
		setUsername(e.target.value)
	}

	if (redirect) {
		return <Redirect push to="/" />;
	}
	else if (redirectSignup) {
		return <Redirect push to="/signup" />;
	}
	else if (redirectRecover) {
		return <Redirect push to="/user/resetpassword" />;
	}
	else {
		return (
			<div id="login" className="App">
				<div className="login-container">
					<h1 className="title">D.E.scord</h1>
					<p>Please login to access on chat</p>

						<ValidatorForm
							onSubmit={connectme}
							onError={errors => console.log(errors)}
						>
							<TextValidator
								name="email"
							onChange={(e, val) => changeusername(e)}
								style={fieldStyle}
							placeholder="Email ou Username"
								type="text"
								value={username}
								validators={['required']}
								errorMessages={['The email or username is required']}
							/>
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
								Login
						</Button>
						</ValidatorForm>
					<div style={{ marginTop: "10px" }}>
						Not registered? : <Link style={{ cursor: 'pointer' }} onClick={() => setredirectSignup(true)}>Sign up</Link>
					</div>
					<div style={{ marginTop: "10px" }}>
						Lost Password? : <Link style={{ cursor: 'pointer' }} onClick={() => setredirectRecover(true)}>Recover my password</Link>
					</div>
				</div>
			</div>
		);
	}
}

function mapState(state) {
	return({})
}

const actionCreators = {
	login: userActions.login,
	logout: userActions.logout
};

const connectedLogin = connect(mapState, actionCreators)(Login);

export default reduxForm({
	form: 'recover',
})(connectedLogin);
