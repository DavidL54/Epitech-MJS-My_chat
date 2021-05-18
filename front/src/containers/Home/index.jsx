import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import "../../scss/Home.scss";
import { makeStyles } from '@material-ui/core/styles';
import { Loading } from '../../helpers/utils'
import logo from '../../img/logo.svg';
import Box from '@material-ui/core/Box';

const Home = (props) => {
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
				<Box flexDirection="col">
					<Box style={{ width: '100%' }}>
						<h2>Welcome to D.E.scord</h2>
					</Box>
					<Box style={{ width: '100%' }}>
						<img src={logo} alt="Descord Logo" style={{ height: "200px" }} />
					</Box>
					<Box style={{ width: '100%' }}>
						Why D.E.scord ? It's for "David" "Elian" and "scord" like the famous chat of course !	
					</Box>
				</Box>
				<div>
				</div>
			</div>

		)
	}
	else {
		return (<Loading />)
	}
}

function mapStateToProps(state) {
	return { user: state.user }
}

export default connect(mapStateToProps, {})(Home);