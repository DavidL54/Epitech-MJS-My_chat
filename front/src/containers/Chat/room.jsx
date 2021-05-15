import React, { useEffect, useState, useContext } from "react";
import { connect } from 'react-redux';
import "../../scss/Home.scss";
import {
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import Loader from "react-loader-spinner";
import { sendMessage } from '../../redux/actions/socketAction'
import { roomServices } from '../../redux/services/roomServices'


const Room = (props) => {
  const { selectedRoom, setselectedRoom } = props;
  const [loaded, setLoaded] = useState(true);
  const [room, setroom] = useState([]);

  useEffect(() => {
    roomServices.getAllowRoomByUser(props.user.userId)
      .then(res => { setroom(res); })
  }, [])

  const changeRoom = (roomid) => {
    setselectedRoom(roomid);
  };

  if (loaded === true) {
    return (
      <List dense={true}>
        {room.map(con => {
          const color = selectedRoom === con._id ? "#bf99db" : "transparent";
          return (
            <ListItem button style={{ backgroundColor: color }} onClick={() => changeRoom(con._id)}>
              <ListItemText
                primary={con.name}
              />
            </ListItem>
          )
        })}
      </List>
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

export default connect(mapStateToProps, actionCreators)(Room);