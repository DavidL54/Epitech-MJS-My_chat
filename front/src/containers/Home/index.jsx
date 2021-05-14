import React, { useEffect, useState, useContext } from "react";
import { connect } from 'react-redux';
import "../../scss/Home.scss";
import {
	TextField,
	Button,
	List,
	ListItem,
	ListItemText,
	Grid
} from '@material-ui/core';
import Loader from "react-loader-spinner";
import { SocketContext } from '../App/SocketComponent';
import { sendMessage } from '../../redux/actions/socketAction'
import { makeStyles } from '@material-ui/core/styles';
import Room from './room';

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

const Home = (props) => {
	const [loaded, setLoaded] = useState(true);
	const [message, setmessage] = useState("");
	const [roomMessage, setroomMessage] = useState([]);
	const [selectedRoom, setselectedRoom] = useState("");
	const [contact, setcontact] = useState([{ name: "dadou" }, { name: "Elian" }]);
	const socket = useContext(SocketContext);
	const classes = useStyles();

	useEffect(() => {

		console.log(props.socket.message);
		setroomMessage(props.socket.message);
	}, [props.socket])

	const send = () => {
		if (props.user.userId) {
			props.sendMessage(socket, selectedRoom, message)
			setmessage('');
		}
	}

	if (loaded === true) {
		return (
			<>
				<Grid style={{ height: "auto", width: "auto" }} container spacing={3}>
					<Grid className={classes.item} item xs={2}>
						<h3>Contacts</h3>
						<List dense={true}>
							{contact.map(con => (
								<ListItem>
									<ListItemText
										primary={con.name}
									/>
								</ListItem>
							)
							)}

						</List>
					</Grid>
					<Grid className={classes.item} item xs={7}>
						<h3>Messages</h3>
						<List dense={true}>
							{roomMessage.map(con => {
							
								if (con.room === selectedRoom) {
									return (
										<ListItem>
											{`${con.user} : `}<ListItemText
												primary={con.message}
											/>
										</ListItem>
									)
								}
							})}

						</List>
					</Grid>
					<Grid className={classes.item} item xs={2}>
						<h3>Rooms</h3>
						<Room selectedRoom={selectedRoom} setselectedRoom={setselectedRoom} />
					</Grid>
				</Grid>
				<Grid style={{ height: "auto", width: "auto" }} container spacing={3}>
					<Grid className={classes.textarea} item xs={8}>
						<TextField style={{ backgroundColor: "white", color: "black", width: "100%" }} value={message} onChange={(e) => setmessage(e.target.value)} variant="outlined" />
					</Grid>
					<Grid className={classes.sendbutton} item xs={3}>
						<Button disabled={selectedRoom ? false : true} onClick={send} color='primary'>Envoyer</Button>
					</Grid>
				</Grid>
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

export default connect(mapStateToProps, actionCreators)(Home);