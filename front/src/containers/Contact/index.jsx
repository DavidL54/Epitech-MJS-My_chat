import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import "../../scss/Home.scss";
import {
	IconButton,
	Button,
	Typography,
	ListItem,
	List,
	ListItemSecondaryAction,
	ListItemAvatar,
	Avatar,
	ListItemText
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Loading } from '../../helpers/utils'
import { roomServices } from '../../redux/services/roomServices';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { toastSuccess } from "../../redux/actions/alertActions";
import { useParams } from "react-router-dom";
import ModalRoomEdit from './modalRoomEdit';
import ModalRoom from './modalRoom';
import ModalInvitation from './modalInvitation';


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

const Contact = (props) => {
	const [loaded, setLoaded] = useState(true);
	const [modalRoom, setmodalRoom] = useState(false);
	const [modalinvit, setmodalinvit] = useState(false);
	const [modalRoomEdit, setmodalRoomEdit] = useState(false);
	const [myRoom, setmyRoom] = useState([]);
	const [selectedRoom, setselectedRoom] = useState("");
	const { invitation, token } = useParams();

	const classes = useStyles();
	useEffect(() => {
		roomServices.getRoomByUser(props.user.userId)
			.then(res => {
				setmyRoom(res);
			})
		
		if (invitation && token) setmodalinvit(true);
	}, []);

	const deleteRoom = (idroom) => {
		roomServices.deleteRoom(idroom)
			.then(() => {
				setmyRoom(myRoom.filter(item => item._id !== idroom));
				toastSuccess('Room deleted with success');
			})
	}

	const editRoom = (idroom) => {
		setselectedRoom(idroom);
		setmodalRoomEdit(true);
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
				<div className={classes.root}>
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<h1>Contacts</h1>
						</Grid>
						<Grid className={classes.categorie} item xs={12}>
							<h2>My Rooms</h2>
						</Grid>
						<Grid item xs={12}>
							<Paper className={classes.paper}>
								<Grid container spacing={3}>
									<Grid className={classes.categorie} item xs={12}>
										<Button variant="contained" color="primary" onClick={() => setmodalRoom(true)}>
											Create Room
      							</Button>
									</Grid>
									<Grid className={classes.categorie} item xs={12}>
										<List dense={true}>
											{myRoom.map((elem) => (
												<ListItem>
													<ListItemText
														primary={elem.name}
													/>
													<ListItemSecondaryAction>
														<IconButton edge="end" aria-label="delete" onClick={() => editRoom(elem._id)}>
															<EditIcon />
														</IconButton>
														<IconButton edge="end" aria-label="delete" onClick={() => deleteRoom(elem._id)}>
															<DeleteIcon />
														</IconButton>
													</ListItemSecondaryAction>
												</ListItem>
											))}
										</List>
									</Grid>
								</Grid>
							</Paper>
						</Grid>
					</Grid>
				</div>
				{ modalRoom ? <ModalRoom modalRoom={modalRoom} setmodalRoom={setmodalRoom} myRoom={myRoom} setmyRoom={setmyRoom} /> : <div />}
				{ modalinvit ? <ModalInvitation modalinvit={modalinvit} setmodalinvit={setmodalinvit} token={token} /> : <div />}
				{ modalRoomEdit ? <ModalRoomEdit roomModal={modalRoomEdit} setroomModal={setmodalRoomEdit} selectedRoom={selectedRoom} /> : <div />}
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

export default connect(mapStateToProps, {})(Contact);

// 					<BottomPlayer recentlyPlayed={recentlyPlayed && !recentlyPlayed.error ? recentlyPlayed.items[0] : null} />