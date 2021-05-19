import React, { useEffect, useState, useContext } from "react";
import { connect } from 'react-redux';
import "../../scss/Home.scss";
import {
	Button,
	Grid
} from '@material-ui/core';
import Loader from "react-loader-spinner";
import { SocketContext } from '../App/SocketComponent';
import { makeStyles } from '@material-ui/core/styles';
import Room from './roomComponent';
import Contact from './contacts';
import Message from './messagesComponent';
import Tapping from './tappingComponent'
import MessageField from './messageField'

const useStyles = makeStyles((theme) => ({
	item: {
		backgroundColor: "#bbb7bc",
		color: "black",
		minHeight: "80vh",
		padding: "20px",
		borderRadius: "10px"
	},
	itemMessage: {
		backgroundColor: "#cecece",
		color: "black",
		minHeight: "80vh",
		padding: "20px",
		borderRadius: "10px"
	},
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

const Chat = (props) => {
	const [loaded, setLoaded] = useState(true);
	const [selectedRoom, setselectedRoom] = useState("");
	const [contact, setcontact] = useState([]);
	const socket = useContext(SocketContext);
	const classes = useStyles();

	useEffect(() => {
		socket.emit("connected", 2);
		return () => socket.emit("connected", 1);
	}, [])

	if (loaded === true) {
		return (
			<>
				<Grid style={{ height: "auto", width: "100%" }} className={classes.sendbox} container>
					<Grid className={classes.item} item xs={2}>
						<h3>Contacts</h3>
						<Contact contact={contact} setcontact={setcontact} selectedRoom={selectedRoom} />
					</Grid>
					<Grid className={classes.itemMessage} item xs={8}>
						<div className={classes.message}>
							<Message className={classes.message} contact={contact} selectedRoom={selectedRoom} />
						</div>
						<div className={classes.tapping} >
							<Tapping contact={contact} className={classes.tapping} />
						</div>
					</Grid>
					<Grid className={classes.item} item xs={2}>
						<h3>Rooms</h3>
						<Room selectedRoom={selectedRoom} setselectedRoom={setselectedRoom} />
					</Grid>
				</Grid>
				<MessageField selectedRoom={selectedRoom} />
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

export default connect(mapStateToProps, {})(Chat);