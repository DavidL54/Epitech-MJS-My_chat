import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import "../../scss/Home.scss";
import {
	IconButton} from '@material-ui/core';
import { BiRefresh } from "react-icons/bi";
import Loader from "react-loader-spinner";
import { userServices } from '../../redux/services/userServices';

const Home = () => {
	const [loaded, setLoaded] = useState(true);

	useEffect(() => {
	}, []);

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
					<div className="recentlyPlayed">
				
					</div>
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