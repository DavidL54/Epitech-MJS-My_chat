import React, { useEffect, useState, useContext } from "react";
import { connect } from 'react-redux';
import "../../scss/Home.scss";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button
} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Loader from "react-loader-spinner";
import { sendMessage } from '../../redux/actions/socketAction'
import { roomServices } from '../../redux/services/roomServices'
import ClearIcon from '@material-ui/icons/Clear';


const Room = (props) => {
  const { selectedRoom, setselectedRoom } = props;
  const [loaded, setLoaded] = useState(true);
  const [modalRoom, setmodalRoom] = useState(false);
  const [room, setroom] = useState([]);

  useEffect(() => {
    roomServices.getAllowRoomByUser(props.user.userId)
      .then(res => { setroom(res); })
  }, [])

  const leaveRoom = () => {
    const newRoomArr = room.filter((item) => { return item._id.toString() !== selectedRoom.toString() })
    setroom(newRoomArr);
    setselectedRoom("");
    setmodalRoom(false);
  }

  if (loaded === true) {
    return (
      <>
        <List dense={true}>
          {room.map(con => {
            const color = selectedRoom === con._id ? "#0069B4" : "#5a98c4";
            return (
              <ListItem button style={{ backgroundColor: color, borderRadius: "5px", border: "1px black solid", margin: "5px" }}>
                <ListItemIcon ><ClearIcon style={{ color: "red" }} onClick={() => { setselectedRoom(con._id); setmodalRoom(true); }} /></ListItemIcon>
                <ListItemText
                  primary={con.name}
                  onClick={() => setselectedRoom(con._id)}
                />
              </ListItem>
            )
          })}
        </List>
        <Dialog onClose={() => setmodalRoom(false)} aria-labelledby="customized-dialog-title" open={modalRoom}>
          <MuiDialogTitle onClose={() => setmodalRoom(false)}>
            Leave Room
           </MuiDialogTitle>
          <MuiDialogContent dividers>
            Are you sure you want leave this room ?
            </MuiDialogContent>
          <MuiDialogActions>
            <Button autoFocus onClick={() => setmodalRoom(false)} type="submit" color="primary">
              No
          </Button>
            <Button autoFocus onClick={leaveRoom}type="submit" color="primary">
              Yes
          </Button>
          </MuiDialogActions>
        </Dialog>
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

export default connect(mapStateToProps, actionCreators)(Room);