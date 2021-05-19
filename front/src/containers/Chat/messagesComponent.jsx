import React, { useEffect, useState, useContext } from "react";
import { connect } from 'react-redux';
import "../../scss/Home.scss";
import {
	List,
} from '@material-ui/core';
import Loader from "react-loader-spinner";
import { SocketContext } from '../App/SocketComponent';
import { sendMessage } from '../../redux/actions/socketAction'
import { makeStyles } from '@material-ui/core/styles';
import { chatServices } from '../../redux/services/chatServices'
import NewReleasesIcon from '@material-ui/icons/NewReleases';
import Box from '@material-ui/core/Box';
import moment from 'moment';

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
	const socket = useContext(SocketContext);
	
	useEffect(() => {
		if (selectedRoom) {
			chatServices.getLastMessageByRoomId(selectedRoom)
				.then(async (res) => {
					const idmsg = [];
					await res.forEach(msg => {
						socket.emit('read', msg.idmsg);
						idmsg.push(msg.idmsg)
					});
					let ret = [...res];
					await props.socket.message.forEach(msg => {
						if (!idmsg.includes(msg.idmsg))
							ret.push(msg)
					})
					ret.sort((a, b) => { if (a.created_at <= b.created_at) return -1; return 1; });
					setroomMessage(ret);
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

							if (con.sender !== props.user.userId && con.read && !con.read.includes(props.user.userId)) {
								newFlag = <NewReleasesIcon />;
							}

							const read = con.read ? con.read.length - 1 : 0;
							if (con.sender == props.user.userId)
								return (
									<div style={{ width: '100%' }}>
										<Box display="flex" justifyContent="flex-end" m={1} p={1}>
											<Box p={1} borderRadius={10} bgcolor="#E0EC8A">
												<Box>{con.message} {`: Me`}{newFlag}</Box>
												<Box display="flex" style={{ fontSize: "10px" }} justifyContent="flex-end" >{moment(con.created_at).format('DD/MM/YYYY hh:mm') }</Box>
												<Box display="flex" style={{ fontSize: "10px" }} justifyContent="flex-end" >{read < 0 ? 0 : read} read</Box>
											</Box>
										</Box>
									</div>
								);
							else
								return (
									<div style={{ width: '100%' }}>
										<Box display="flex" justifyContent="flex-start" m={1} p={1}>
											<Box p={1} borderRadius={10} bgcolor="#AECEE7">
												<Box>{newFlag}{`${displayName} : `}{con.message}</Box>
												<Box display="flex" style={{ fontSize: "10px" }} justifyContent="flex-start" >{moment(con.created_at).format('DD/MM/YYYY hh:mm') }</Box>
											</Box>
										</Box>
									</div>
								);
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
	sendMessage,
}

export default connect(mapStateToProps, actionCreators)(Message);