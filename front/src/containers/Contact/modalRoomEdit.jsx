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
import { roomServices } from '../../redux/services/roomServices';
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

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused || state.isSelected ? '#deebff' : 'white',
    color: 'black',
    fontSize: '14px',
    minWidth: '300px'
  }),
  control: (base, state) => ({
    ...base,
    minHeight: '56px',
    marginTop: '10px',
    marginBottom: '10px',
    fontSize: '16px',
    boxShadow: state.isFocused ? '0 0 0 1px #002984' : 0,
    minWidth: '300px'
  }),
  menu: (provided) => ({ ...provided, zIndex: 9999 }),
  menuPortal: base => ({ ...base, zIndex: 9999 })
};


const ModalRoomEdit = (props) => {
  const { roomModal, setroomModal, selectedRoom } = props;
  const [selectedadmin, setselectedadmin] = useState(null);
  const [invitation, setinvitation] = useState(null);
  const classes = useStyles();

  const loadAvailableUser = (input, callback) => {
    invitServices.getAvalaibleUserInvitRoomUpdate(selectedRoom).then(res => {
      const finres = [];
      res.forEach(user => {
        let addimmediat = user.iscommun ? "(Instant Add)" : '';
        finres.push({
          label: `${user.name} ${user.firstname} ${addimmediat}`,
          value: user._id,
          email: user.email,
          iscommun: user.iscommun
        })
      })
      callback(finres);
    });
  }

  const loadAvailableAdmin = (input, callback) => {
    invitServices.getAvalaibleUserInvitAdmin(selectedRoom).then(res => {
      const finres = [];
      res.forEach(user => {
        finres.push({
          label: `${user.name} ${user.firstname}`,
          value: user._id,
          email: user.email,
          iscommun : true
        })
      })
      callback(finres);
    });
  }

  const Update = () => {
    if (!invitation && !selectedadmin) {
      toastError("Please select at least one field");
      return;
    }
    const body = JSON.stringify({
      invitation: invitation ? invitation : [],
      admin: selectedadmin ? selectedadmin : [],
    });
    roomServices.updateRoom(selectedRoom, body)
      .then(res => {
        if (res.statusText && res.statusText === "KO") {
          toastError(res.message);
        }
        else {
          toastSuccess('Room updated with success');
        }
      })
    setroomModal(false);
  }

  return (
    <Dialog onClose={() => setroomModal(false)} aria-labelledby="customized-dialog-title" open={roomModal}>
      <MuiDialogTitle id="customized-dialog-title" onClose={() => setroomModal(false)}>
         Edit Room
        </MuiDialogTitle>
      <MuiDialogContent dividers>
        Invit users
        <AsyncSelect
          isMulti
          styles={customStyles}
          placeholder={'Select user(s)'}
          loadOptions={loadAvailableUser}
          defaultOptions
          cacheOptions
          isClearable
          value={invitation || ''}
          onChange={(e) => { setinvitation(e) }}
          menuPosition={'fixed'}
        />
        Change Administrator
        <AsyncSelect
          styles={customStyles}
          placeholder={'Select administrator'}
          loadOptions={loadAvailableAdmin}
          defaultOptions
          cacheOptions
          isClearable
          value={selectedadmin || ''}
          onChange={(e) => { setselectedadmin(e) }}
          menuPosition={'fixed'}
        />
        </MuiDialogContent>
      <MuiDialogActions>
        <Button autoFocus onClick={() => { setroomModal(false); }}>
          Close
          </Button>
        <Button autoFocus onClick={() => { Update() }}>
            Send
          </Button>
        </MuiDialogActions>
    </Dialog>

  )
}

function mapStateToProps(state) {
  return { user: state.user }
}

export default connect(mapStateToProps, {})(ModalRoomEdit);
