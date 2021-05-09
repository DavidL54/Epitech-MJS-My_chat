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
import { roomServices } from '../../redux/services/roomServices';
import { toastError, toastSuccess } from '../../redux/actions/alertActions';
import AsyncSelect from 'react-select/async';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  categorie: {
    padding: theme.spacing(2),
    textAlign: 'left',
  },
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
  const { modalRoom, setmodalRoom, myRoom, setmyRoom } = props;
  const [name, setname] = useState('');
  const [invitation, setinvitation] = useState([]);
  const [availableinvit, setavailableinvit] = useState([]);
  
  console.log("ca passe icic")
  
  const classes = useStyles();
  useEffect(() => {
  }, []);

  const create = () => {
    const body = JSON.stringify({
      name,
      invitation
    });
    roomServices.createRoom(body)
      .then(res => {
        if (res.statusText && res.statusText === "KO") {
          toastError(res.message);
        }
        else {
          setmyRoom([...myRoom, res])
          toastSuccess('Room created with success');
        }
      })
    setmodalRoom(false);
  }

  const loadAvailableUser = (input, callback) => {
    userServices.getAll().then(res => {
      const finres = [];
      res.forEach(user => {
        finres.push({label : `${user.name} ${user.firstname}`, value: user._id, email: user.email })
      })
      callback(finres);
    });
  }

  return (
    <Dialog onClose={() => setmodalRoom(false)} aria-labelledby="customized-dialog-title" open={modalRoom}>
      <ValidatorForm
        onSubmit={create}
        onError={errors => console.log(errors)}
      >
      <MuiDialogTitle id="customized-dialog-title" onClose={() => setmodalRoom(false)}>
        Create Room
        </MuiDialogTitle>
      <MuiDialogContent dividers>
          <TextValidator
            name="name"
            onChange={(e, val) => setname(e.target.value)}
            style={fieldStyle}
            placeholder="Name"
            type="text"
            value={name}
            variant="outlined"
            validators={['required']}
            errorMessages={['The name is required']}
          />
        <AsyncSelect
          isMulti
          styles={customStyles}
          placeholder={'Invitation'}
          loadOptions={loadAvailableUser}
          defaultOptions
          cacheOptions
          isClearable
          value={invitation || ''}
          onChange={(e) => { setinvitation(e) }}
          />
      </MuiDialogContent>
      <MuiDialogActions>
          <Button autoFocus type="submit" color="primary">
          Create
          </Button>
        </MuiDialogActions>
      </ValidatorForm>
    </Dialog>

  )
}

function mapStateToProps(state) {
  return { user: state.user }
}

export default connect(mapStateToProps, {})(ModalRoom);
