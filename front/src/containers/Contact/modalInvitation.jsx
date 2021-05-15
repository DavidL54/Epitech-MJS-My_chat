import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import "../../scss/Home.scss";

import { makeStyles } from '@material-ui/core/styles';
import { Button,TextField } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { userServices } from '../../redux/services/userServices';
import { invitServices } from '../../redux/services/invitServices';
import { toastError, toastSuccess } from '../../redux/actions/alertActions';
import AsyncSelect from 'react-select/async';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import jwt_decode from 'jwt-decode';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
  },
  accept: {
    backgroundColor: 'green',
  },
  refuse: {
    backgroundColor: 'red',
  }
}));

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused || state.isSelected ? '#deebff' : 'white',
    color: 'black',
    fontSize: '14px',
  }),
  control: (base, state) => ({
    ...base,
    minHeight: '56px',
    marginTop: '10px',
    marginBottom: '10px',
    fontSize: '16px',
    boxShadow: state.isFocused ? '0 0 0 1px #002984' : 0,
  }),
  menu: (provided) => ({ ...provided, zIndex: 1 }),
};

const fieldStyle = { width: "100%", backgroundColor: "white", fontSize: "16px", borderRadius: "10px" };

const ModalRoom = (props) => {
  const { modalinvit, setmodalinvit, token } = props;
  const [response, setresponse] = useState(false);
  const classes = useStyles();
  
  let info;
  try {
    info = jwt_decode(token)
    console.log(info);
  }
  catch {
    toastError("invalid token");
    setmodalinvit(false);
  }


  const respond = (res) => {
    console.log(info.invitid);
    invitServices.responseInvit(info.invitid, JSON.stringify({ token, res: res }))
      .then(ret => {
        toastSuccess(ret)
        setmodalinvit(false);
      });
  }

  return (
    <Dialog onClose={() => setmodalinvit(false)} aria-labelledby="customized-dialog-title" open={modalinvit}>
        <MuiDialogTitle id="customized-dialog-title" onClose={() => setmodalinvit(false)}>
         Invitation
        </MuiDialogTitle>
      <MuiDialogContent dividers>
      You haved been invited to join room : {info.roomname}
        </MuiDialogContent>
        <MuiDialogActions>
        <Button className={classes.accept} autoFocus onClick={() => { respond(true) }}>
            Accept
          </Button>
        <Button className={classes.refuse} autoFocus onClick={() => { respond(false)}}>
          Refuse
          </Button>
        </MuiDialogActions>
    </Dialog>

  )
}

function mapStateToProps(state) {
  return { user: state.user }
}

export default connect(mapStateToProps, {})(ModalRoom);
