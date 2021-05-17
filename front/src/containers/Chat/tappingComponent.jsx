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

const Tapping = (props) => {
  const { contact } = props;
  const contactKeys = Object.keys(contact);

  useEffect(() => {
  }, [props.socket.tap])

  const tap = [];
  props.socket.tap.forEach(element => {
    if (contactKeys.includes(element)) {
      tap.push(<div>{`${contact[element].name} is typing` }</div>)
    }
  });
  return (
    <>
      {tap}
  </>)
}

function mapStateToProps(state) {
  const socket = state.socket;
  return { socket }
}

const actionCreators = {
  sendMessage
}

export default connect(mapStateToProps, actionCreators)(Tapping);