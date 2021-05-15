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
  const { selectedRoom } = props;

  const [loaded, setLoaded] = useState(true);
  const [contact, setcontact] = useState([]);
  const [contactState, setcontactState] = useState({});
  const contactStateKeys = Object.keys(contactState);

  const socket = useContext(SocketContext);

  useEffect(() => {
    setcontactState(props.socket.chat);
    if (selectedRoom) {
      chatServices.getUserByRoom(selectedRoom)
        .then(res => {
          setcontact(res);
        });
    }
  }, [props.socket, selectedRoom])

  if (loaded === true) {
    return (
      <>
        <List dense={true}>
          {contact.map(con => {
            let color = 'red';
            if (contactStateKeys.includes(con._id)) {
              if (contactState[con._id] === 2) color = "green"
              else if (contactState[con._id] === 1) color = "yellow"
            }
            return (
              <ListItem>
                <FiberManualRecordIcon style={{ color }} />
                <ListItemText
                  primary={`${con.name} ${con.firstname}`}
                />
              </ListItem>)
          }
          )}
        </List>
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