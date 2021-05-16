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

const ModalRoom = (props) => {
  const { roomModal, setroomModal } = props;
  const classes = useStyles();


  return (
    <Dialog onClose={() => setroomModal(false)} aria-labelledby="customized-dialog-title" open={roomModal}>
      <MuiDialogTitle id="customized-dialog-title" onClose={() => setroomModal(false)}>
         Menu Room
        </MuiDialogTitle>
      <MuiDialogContent dividers>
    
        </MuiDialogContent>
        <MuiDialogActions>
        <Button className={classes.accept} autoFocus onClick={() => {  }}>
            Accept
          </Button>
        <Button className={classes.refuse} autoFocus onClick={() => { }}>
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
