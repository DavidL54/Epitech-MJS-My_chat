import React, { useState, useEffect, useContext } from 'react';
import InputEmoji from "react-input-emoji";
import { connect } from 'react-redux';
import {
  Button,
  Grid
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { SocketContext } from '../App/SocketComponent';
import { Field, reduxForm } from 'redux-form'
import { sendMessage } from '../../redux/actions/socketAction'

const useStyles = makeStyles((theme) => ({
  textarea: {
    backgroundColor: "#cecece",
    color: "black",
    minHeight: "10vh",
    padding: "20px"
  },
  sendbutton: {
    backgroundColor: "#cecece",
    color: "black",
    minHeight: "10vh",
    minWidth: "50px",
    paddingTop: "30px"
  },
  sendbox: {
    marginTop: '10px',
    borderRadius: "10px"
  },
  tapping: {
    width: "200px"
  },
  message: {
    height: "90%"
  }
}));

const CustomField = ({ input, meta, message, send}) => {
  return (<InputEmoji
    value={message}
    onChange={(e) => input.onChange(e)}
    onEnter={send}
    placeholder="Type a message"
  />)
}

const MessageField = (props) => {
  const { selectedRoom } = props;
  const [message, setmessage] = useState();
  const [value, setvalue] = useState();
  const [lastTyping, setlastTyping] = useState(Date.now());
  const classes = useStyles();

  const socket = useContext(SocketContext);
  const send = () => {
    if (props.user.userId && selectedRoom && message) {
      props.sendMessage(socket, selectedRoom, message)
      setmessage('');
      socket.emit("typing", false);
    }
  }

  const handleOnChange = (event) => {
    setmessage(event);
    setvalue(event);
    const now = Date.now();
    if (now - lastTyping > 1000 && message !== event) {
      socket.emit("typing", true);
      setlastTyping(now);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => socket.emit("typing", false), 2000);
    return () => { clearTimeout(timeoutId);};
  }, [value]);

  return (
    <>
      <Grid style={{ height: "auto", width: "100%" }} className={classes.sendbox} container>
        <Grid className={classes.textarea} item xs={9}>
          <Field
            component={CustomField}
            onChange={(e) => handleOnChange(e)}
          />
        </Grid>
        <Grid className={classes.sendbutton} item xs={3}>
          <Button style={{ width: "200px" }} disabled={selectedRoom ? false : true} onClick={send} variant="contained" color='primary'>Envoyer</Button>
        </Grid>
      </Grid>
    </>
  );
};

function mapStateToProps(state) {
  const user = state.user;
  const socket = state.socket;
  return { user, socket }
}

const actionCreators = {
  sendMessage
}

const connectedContentForm = reduxForm({
  form: "toto"
})(MessageField);

export default connect(mapStateToProps, actionCreators)(connectedContentForm);

