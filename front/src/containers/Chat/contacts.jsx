import React, { useEffect, useState, useContext } from "react";
import { connect } from 'react-redux';
import "../../scss/Home.scss";
import {
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import Loader from "react-loader-spinner";
import { SocketContext } from '../App/SocketComponent';
import { sendMessage } from '../../redux/actions/socketAction'
import { makeStyles } from '@material-ui/core/styles';
import { chatServices } from '../../redux/services/chatServices';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

const useStyles = makeStyles((theme) => ({
  item: {
    backgroundColor: "#cecece",
    color: "black",
    border: "1px black solid",
    margin: '15px',
    padding: '20px',
    minHeight: "80vh",
  },
  textarea: {
    backgroundColor: "#cecece",
    color: "black",
    border: "1px black solid",
    margin: '15px',
    padding: '20px',
    minHeight: "10vh",
  },
  sendbutton: {
    backgroundColor: "#cecece",
    color: "black",
    border: "1px black solid",
    margin: '15px',
    padding: '20px',
    minHeight: "10vh",
  },
}));

const Contact = (props) => {
  const { selectedRoom, contact, setcontact } = props;

  const [loaded, setLoaded] = useState(true);
  const [contactState, setcontactState] = useState({});
  const contactStateKeys = Object.keys(contactState);

  useEffect(() => {
    setcontactState(props.socket.chat);
    if (selectedRoom) {
      chatServices.getUserByRoom(selectedRoom)
        .then(res => {
          let formatedContact = {}
          res.forEach(ct => {
            formatedContact[ct._id] = { name: `${ct.firstname} ${ct.name}`, id: ct._id };
          })
          setcontact(formatedContact);
        });
    }
    else {
      setcontact([]);
    }
  }, [props.socket.chat, selectedRoom])

  if (loaded === true) {
    
    let returnContact = []

    for (const [key, ct] of Object.entries(contact)) {
      let color = 'grey';
      if (contactStateKeys.includes(ct.id)) {
        if (contactState[ct.id] === 2) color = "green"
        else if (contactState[ct.id] === 1) color = "yellow"
      }
      returnContact.push(
        <ListItem>
          <FiberManualRecordIcon style={{ color }} />
          <ListItemText
            primary={ct.name}
          />
        </ListItem>)
    }
    return (
      <>
        {returnContact}
      </>
    )
  }
  else {
    return (
      <div id="home">
        <Loader type="ThreeDots" color="#7909c4" height={80} width={80} />
      </div>
    )
  }
}

function mapStateToProps(state) {
  const user = state.user;
  const socket = state.socket;
  return { user, socket }
}

const actionCreators = {
  sendMessage
}

export default connect(mapStateToProps, actionCreators)(Contact);