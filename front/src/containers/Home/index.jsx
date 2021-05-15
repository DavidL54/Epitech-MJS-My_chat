import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import "../../scss/Home.scss";
import { makeStyles } from '@material-ui/core/styles';
import { Loading } from '../../helpers/utils'

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		width: "100%",
	},
	paper: {
		padding: theme.spacing(2),
		textAlign: 'center',
		color: theme.palette.text.secondary,
	},
	categorie: {
		padding: theme.spacing(2),
		textAlign: 'left',
	},
}));

const Home = (props) => {
	const [loaded, setLoaded] = useState(true);
	const classes = useStyles();
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
				<h2>Welcome to D.E.scord</h2>
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