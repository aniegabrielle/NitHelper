import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	Chip,
	Collapse,
	Grid,
	IconButton,
	Stack,
	Typography,
	styled,
} from "@mui/material";
import { onValue, ref, get, child, update, push } from "firebase/database";
import { db } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FormComment } from "../components/FormComment";
import { CommentReport } from "../components/Comment";
import Face6Icon from "@mui/icons-material/Face6";
import { FormReport } from "../components/FormReport";

const ExpandMore = styled((props) => {
	const { expand, ...other } = props;
	return <IconButton {...other} />;
})(({ theme, expand }) => ({
	transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
	marginLeft: "auto",
	transition: theme.transitions.create("transform", {
		duration: theme.transitions.duration.shortest,
	}),
}));

export const Home = () => {
	const { currentUser } = useAuth();
	let navigate = useNavigate();

	const [reports, setReports] = React.useState([]);

	const [currentReportId, setCurrentReportId] = useState("");

	const [expanded, setExpanded] = useState(null);


	const handleExpandClick = (index, id) => {
		if (expanded !== null) {
			setExpanded(null);
		} else {
			setExpanded(index);
		}

		setCurrentReportId(id);
	};

	const handleFollowUser = (userId) => {
		const updates = {}

		get(child(ref(db), `users/${currentUser.uid}/friendships`)).then((snapshot) => {
			if (snapshot.exists()) {
				const objectSnapshot = snapshot.val()
				const list = Object.values(objectSnapshot)
				const key = list.length

				if (!list.includes(userId)) {
					updates[`users/${currentUser.uid}/friendships/${key}`] = userId
					update(ref(db), updates);
				}
			} else {
				updates[`users/${currentUser.uid}/friendships/0`] = userId
				update(ref(db), updates);
			}
		})

		get(child(ref(db), `users/${userId}/friendships`)).then((snapshot) => {
			if (snapshot.exists()) {
				const objectSnapshot = snapshot.val()
				const list = Object.values(objectSnapshot)
				const key = list.length

				if (!list.includes(currentUser.uid)) {
					updates[`users/${userId}/friendships/${key}`] = currentUser.uid
					update(ref(db), updates);
				}
			} else {
				updates[`users/${userId}/friendships/0`] = currentUser.uid
				update(ref(db), updates);
			}
		})
	}

	function checkFriendship(userId) {
		const reportRef = ref((db), `users/${currentUser.uid}/friendships`);

		return onValue(reportRef, (snapshot) => {
			const objectSnapshot = snapshot.val()
			const list = Object.values(objectSnapshot)

			return list.includes(userId)
		})
	}

	useEffect(() => {
		if (currentUser === null) {
			return navigate("/");
		}
	}, [currentUser, navigate]);

	useEffect(() => {
		const reportRef = ref(db, "reports");

		onValue(reportRef, (snapshot) => {
			let reports = snapshot.val();

			const reportsList = [];

			for (let id in reports) {
				reportsList.push({ id, ...reports[id] });
			}

			setReports(reportsList);
		});
	}, []);

	return (
		<Container component="main" maxWidth="sm">
			<FormReport />

			<Stack gap={"1rem"} mt={6} mb={10}>
				{reports.map((item, index) => (
					< Card key={index} sx={{ minWidth: 275, borderRadius: 3 }}>
						<CardContent>
							<Grid container spacing={3}>
								<Grid item xs={8}>
									<Stack direction="row" spacing={2} alignItems="center">
										<Box
											sx={{
												backgroundColor: "info.dark",
												width: "60px",
												height: "60px",
												borderRadius: "50%",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
											}}
										>
											<Face6Icon color="secondary" fontSize="large" />
										</Box>
										<Typography sx={{ fontSize: "24px", fontWeight: "bold" }}>
											{item.user?.name ? item.user.name : null}
										</Typography>

										{/* {checkFriendship(item.user.id) ? <Typography>Seguindo</Typography> : <Typography>Seguir</Typography>} */}

										<Button onClick={() => handleFollowUser(item.user.id)}>Seguir</Button>
									</Stack>
								</Grid>
								<Grid
									container
									item
									xs={4}
									direction="row"
									alignItems="center"
									justifyContent="flex-end"
									gap={2}
								>
									<Chip
										variant="outlined"
										label={item.type}
										color="info"
										sx={{ fontWeight: "bold" }}
									/>
									<Chip
										variant="outlined"
										label={item.status}
										color="warning"
										sx={{ fontWeight: "bold" }}
									/>
								</Grid>
							</Grid>

							<Typography sx={{ mt: 3 }} color="text.secondary">
								{item.description}
							</Typography>
						</CardContent>
						<CardActions>
							<Grid container>
								<Grid
									container
									item
									xs={12}
									direction="row"
									alignItems="center"
									justifyContent="flex-end"
								>
									<Box display="flex" alignItems="center">
										<Typography variant="body2">
											Visualizar comentários
										</Typography>
										<ExpandMore
											expand={expanded === index}
											onClick={() => handleExpandClick(index, item.id)}
											aria-expanded={expanded === index}
											aria-label="show more"
											disableRipple
										>
											<ExpandMoreIcon />
										</ExpandMore>
									</Box>
								</Grid>
							</Grid>
						</CardActions>
						<Collapse in={expanded === index} timeout="auto" unmountOnExit>
							<CardContent>
								{item.comments ? (
									Object.keys(item.comments).map((key) => {
										return <CommentReport item={item.comments[key]} />;
									})
								) : (
									<Typography> Sem comentários disponíveis </Typography>
								)}

								<Grid container mt={4}>
									<FormComment currentReportId={currentReportId} />
								</Grid>
							</CardContent>
						</Collapse>
					</Card>
				))}
			</Stack>
		</Container >
	);
};
