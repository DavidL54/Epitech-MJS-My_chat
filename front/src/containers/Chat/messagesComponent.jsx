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
import { chatServices } from '../../redux/services/chatServices'
import NewReleasesIcon from '@material-ui/icons/NewReleases';

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
	const { selectedRoom, contact } = props;
	const [loaded, setLoaded] = useState(true);
	const [roomMessage, setroomMessage] = useState([]);
	const contactKeys = Object.keys(contact);
	
	
	useEffect(() => {
		if (selectedRoom) {
			chatServices.getLastMessageByRoomId(selectedRoom)
				.then(async (res) => {
					const idmsg = [];
					await res.forEach(msg => idmsg.push(msg.idmsg));
					let ret = [...res];
					await props.socket.message.forEach(msg => {
						if (!idmsg.includes(msg.idmsg))
							ret.push(msg)
					})
					const reversed = await ret.reverse()
					setroomMessage(reversed);
				})
		}
	}, [props.socket.message, selectedRoom])

	if (loaded === true) {
		return (
			<>
				<List dense={true}>
					{roomMessage.map(con => {
						if (con.roomid === selectedRoom) {
							let displayName = '';
							if (contactKeys.includes(con.sender)) {
								displayName = contact[con.sender].name;
							}
							let newFlag = (<div />)

							if (con.new) {
								newFlag = <NewReleasesIcon />;
							}
							return (
								<ListItem>
									{newFlag}
									{`${displayName} : `}<ListItemText
										primary={con.message}
									/>
								</ListItem>
							)
						}
					})}
				</List>
			</>
		)
		return (<div />)
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