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
import { Redirect, useParams } from 'react-router-dom';
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

const Recover = props => {
  const [redirect, setredirect] = useState(false);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const { token } = useParams();
  console.log(token);

  useEffect(() => {
    const form = props.form;
    if (form && form.values && form.values.email) {
      setemail(form.values.email);
    }
  }, []);

  const recoverme = () => {
    userServices.recover(JSON.stringify({ username: email }))
      .then(res => {
        console.log(res);
      })
  }

  const changepassword = () => {
    userServices.resetpasswordCallback(token, JSON.stringify({ newpass: password }))
      .then(res => {
        if (res.statusText && res.statusText === "KO") {
            toastError(`Error : ${res.message}`);
        }
        else {
          setredirect(true);
          toastSuccess('password changed with success');
        }
      })
  }

  if (redirect) {
    return <Redirect push to="/login" />;
  }
  else if (token) {
    return (<div id="login" className="App">
      <div className="login-container">
        <h1 className="title">D.E.scord</h1>
        <p>Nouveau mot de passe</p>
        <ValidatorForm
          onSubmit={changepassword}
          onError={errors => console.log(errors)}
        >
          <TextValidator
            name="email"
            onChange={(e, val) => setpassword(e.target.value)}
            style={fieldStyle}
            placeholder="New Password"
            type="password"
            value={password}
            validators={['required']}
            errorMessages={['The password is required']}
          />
          <Button
            type="submit"
            variant="contained"
            className="connect"
            color="primary">
            Change password
						</Button>
        </ValidatorForm>
        <div style={{ marginTop: "10px", cursor: 'pointer' }}>
          <Link onClick={() => setredirect(true)}>Revenir au login</Link>
        </div>
      </div>
    </div>)
  }
  else {
    return (
      <div id="login" className="App">
        <div className="login-container">
          <h1 className="title">D.E.scord</h1>
          <p>Recuperation de mot de passe</p>
          <ValidatorForm
            onSubmit={recoverme}
            onError={errors => console.log(errors)}
          >
            <TextValidator
              name="email"
              onChange={(e, val) => setemail(e.target.value)}
              style={fieldStyle}
              placeholder="Email"
              type="text"
              value={email}
              validators={['required']}
              errorMessages={['The email is required']}
            />
            <Button
              type="submit"
              variant="contained"
              className="connect"
              color="primary">
              Send me a recover link
						</Button>
          </ValidatorForm>
          <div style={{ marginTop: "10px", cursor: 'pointer' }}>
            <Link onClick={() => setredirect(true)}>Revenir au login</Link>
          </div>
        </div>
      </div>
    );
  }
}

function mapState(state) {

  return ({ form: state.form.recover })
}

const actionCreators = {
  login: userActions.login,
  logout: userActions.logout
};

const connectedLogin = connect(mapState, actionCreators)(Recover);

export default reduxForm({
  form: 'recover',
})(connectedLogin);
