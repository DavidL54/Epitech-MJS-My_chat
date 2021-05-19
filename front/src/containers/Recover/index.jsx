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
import logo from '../../img/logo.svg';
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
  const { form, confirmandlogin } = props;
  const [redirect, setredirect] = useState(false);
  const [redirectcontact, setredirectcontact] = useState(false);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [repeatPassword, setrepeatPassword] = useState("");

  const { token, id  } = useParams();

  if (token) {
    ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
      if (value !== password) {
        return false;
      }
      return true;
    });
  }

  if (token && id) {
    userServices.confirmaccount(id, token)
      .then((res) => {
        if (res.statusText && res.statusText === "KO") {
          setredirect(true);
          toastError(res.message)
        }
        else if (!res.token) {
          setredirect(true);
          toastSuccess(res);
        }
        else {
          confirmandlogin(res, setredirectcontact);
        }
      })
  }

  useEffect(() => {
    if (form && form.values && form.values.email) {
      setemail(form.values.email);
    }
  }, [])
  
 
  const recoverme = () => {
      userServices.recover(JSON.stringify({ username: email }))
        .then(res => {
          if (res.statusText && res.statusText === "KO") {
            setredirect(true);
            toastSuccess(res.message);
          }
          else {
            setredirect(true);
            toastSuccess(res);
          }
        })
  }

  const changepassword = () => {
    if (password && repeatPassword && password === repeatPassword) {
      userServices.resetpasswordCallback(token, JSON.stringify({ newpass: password }))
        .then(res => {
          if (res.statusText && res.statusText === "KO") {
            toastError(`Error : ${res.message}`);
          }
          else {
            confirmandlogin(res, setredirectcontact);
          }
        })
    }
  }

  if (redirect) {
    return <Redirect push to="/login" />;
  }
  else if (redirectcontact) {
    return <Redirect push to="/contact" />;
  }
  else if (token && id ) {
    return (<div id="login" className="App">
      <div className="login-container">

        You will redirect...
      </div>
    </div>)
  }
  else {
    return (<div id="login" className="App">
      <div className="login-container">
        <img src={logo} alt="Descord Logo" style={{ height: "80px" }} />
        <p>{token ? "Set new password": "Send recover link"}</p>
        <ValidatorForm
          onSubmit={token ? changepassword : recoverme}
          onError={errors => console.log(errors)}
        >
          <TextValidator
            name={token ? "password" : "email"}
            onChange={(e) => { token ? setpassword(e.target.value) : setemail(e.target.value) } }
            style={fieldStyle}
            placeholder={token ? "New Password" : "Email"}
            type={token ? "password" : "email"}
            value={token ? password : email}
            validators={['required']}
            errorMessages={[`The ${token ? "password" : "email"} is required`]}
          />
          {token ? <TextValidator
            onChange={(e) => setrepeatPassword(e.target.value)}
            name="repeatPassword"
            type="password"
            style={fieldStyle}
            validators={['isPasswordMatch', 'required']}
            placeholder="Repeat Password"
            errorMessages={['Password mismatch', 'The repeat password is required']}
            value={repeatPassword}
          /> : <div />}
          <Button
            type="submit"
            variant="contained"
            className="connect"
            color="primary">
            {token ? "Change password" : "Send me a recover link"}
						</Button>
        </ValidatorForm>
        <div style={{ marginTop: "10px", cursor: 'pointer' }}>
          <Link onClick={() => setredirect(true)}>Come back to login</Link>
        </div>
      </div>
    </div>)
  }
}

function mapState(state) {

  return ({ form: state.form.recover })
}

const actionCreators = {
  login: userActions.login,
  logout: userActions.logout,
  confirmandlogin: userActions.confirmandlogin
};

const connectedLogin = connect(mapState, actionCreators)(Recover);

export default reduxForm({
  form: 'recover',
})(connectedLogin);
