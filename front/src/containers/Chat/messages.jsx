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

const Message = (props) => {
	const { selectedRoom } = props;
	const [loaded, setLoaded] = useState(true);
	const [roomMessage, setroomMessage] = useState([]);
	const socket = useContext(SocketContext);
	const classes = useStyles();

	useEffect(() => {
		setroomMessage(props.socket.message);
	}, [props.socket, selectedRoom])

	if (loaded === true) {
		return (
			<>
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

export default connect(mapStateToProps, actionCreators)(Message);