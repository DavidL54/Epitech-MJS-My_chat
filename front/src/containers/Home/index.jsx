import React, { useEffect, useState, useContext } from "react";
import { connect } from 'react-redux';
import "../../scss/Home.scss";
import {
	TextField,
	Button,
} from '@material-ui/core';
import Loader from "react-loader-spinner";
import { SocketContext } from '../App/SocketComponent';

const Home = () => {
	const [loaded, setLoaded] = useState(true);
	const [message, setmessage] = useState("");
	const socket = useContext(SocketContext);
	useEffect(() => {
		//dispatch(loadInitialDataSocket(socket))

		/*socket.on("newuser", data => {
			console.log(data);
		});
		socket.on("message", data => {
			console.log(data);
		});
		socket.on('itemAdded', (res) => {
			console.log(res)
			dispatch(AddItem(res))
		})

		socket.on('itemMarked', (res) => {
			console.log(res)
			dispatch(completeItem(res))
		})

		return () => socket.disconnect();*/
	}, []);

	const send = () => {
		console.log(message);
		socket.emit('message', message);
	}

	if (loaded === true) {
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center"
				}}
			>
				<div id="home">
					<h2>Bienvenue sur D.E.scord</h2>
					<TextField style={{ backgroundColor: "white" }} value={message} onChange={(e) => setmessage(e.target.value)} variant="outlined" />
					<Button onClick={send} color='primary'>Envoyer</Button>
				</div>
			</div>
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
	const token = state.authentication.auth.access_token
	return { accessToken: token }
}

export default connect(mapStateToProps, {})(Home);

// 					<BottomPlayer recentlyPlayed={recentlyPlayed && !recentlyPlayed.error ? recentlyPlayed.items[0] : null} />