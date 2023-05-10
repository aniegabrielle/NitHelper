import React, { useContext, useEffect, useRef, useState } from "react";
import Container from "@mui/material/Container";
import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	Chip,
	Collapse,
	FormControl,
	Grid,
	IconButton,
	IconButtonProps,
	InputLabel,
	MenuItem,
	Modal,
	Select,
	Stack,
	TextField,
	Typography,
	styled,
} from "@mui/material";
import { child, onValue, push, ref, set, update } from "firebase/database";
import { db } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthProvider";
import { Report } from "../types/post";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FormComment } from "../components/FormComment";
import { CommentReport } from "../components/Comment";
import Face6Icon from "@mui/icons-material/Face6";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
};

interface ExpandMoreProps extends IconButtonProps {
	expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
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
	const { user } = useContext(AuthContext);

	let navigate = useNavigate();

	const addressReportRef = useRef<HTMLInputElement>();
	const descriptionReportRef = useRef<HTMLInputElement>();

	const [reportType, setReportType] = React.useState("");
	const [reports, setReports] = React.useState<Report[]>([]);

	const [openReport, setOpenReport] = useState(false);
	const handleOpenReport = () => setOpenReport(true);
	const handleCloseReport = () => setOpenReport(false);

	const [openComment, setOpenComment] = useState(false);
	const handleOpenComment = () => setOpenComment(true);
	const handleCloseComment = () => setOpenComment(false);

	const [currentReportId, setCurrentReportId] = useState<string>("");

	const [expanded, setExpanded] = useState<number | null>(null);

	const handleExpandClick = (index: number, id: string) => {
		if (expanded !== null) {
			setExpanded(null);
		} else {
			setExpanded(index);
		}

		setCurrentReportId(id);
	};

	function writeReportData(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const data = {
			type: reportType,
			address: addressReportRef.current?.value,
			description: descriptionReportRef.current?.value,
			status: "nao atendido",
			createdAt: new Date().toLocaleString(),
			user: {
				id: user?.uid,
				name: user?.displayName,
			},
		} as unknown as Report;

		let newReportKey = push(child(ref(db), "reports")).key;

		const updates: any = {};
		updates["/reports/" + newReportKey] = data;
		updates["/users/" + user?.uid + "/reports/" + newReportKey] = data;

		setOpenReport(false);

		return update(ref(db), updates);
	}

	useEffect(() => {
		if (user === null) {
			return navigate("/");
		}
	}, [user, navigate]);

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
		<Container component="main" maxWidth="md">
			<Box mt={4}>
				<Button variant="contained" onClick={handleOpenReport} color="info">
					Relatar um problema
				</Button>
			</Box>
			<Modal
				open={openReport}
				onClose={handleCloseReport}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<FormControl>
						<Box
							component="form"
							onSubmit={writeReportData}
							noValidate
							sx={{ mt: 1 }}
						>
							<FormControl fullWidth>
								<InputLabel>Tipo de denuncia</InputLabel>
								<Select
									value={reportType}
									label="Tipo de denuncia"
									onChange={(e) => setReportType(e.target.value)}
								>
									<MenuItem value={"iluminacao"}>Iluminacao</MenuItem>
									<MenuItem value={"transporte"}>Transporte</MenuItem>
									<MenuItem value={"Condicoes de vias publicas"}>
										Condicoes de vias publicas
									</MenuItem>
									<MenuItem value={"outros"}>Outros</MenuItem>
								</Select>
							</FormControl>
							<TextField
								margin="normal"
								required
								fullWidth
								name="address-report"
								label="Endereco da denuncia"
								type="address"
								id="address_report"
								inputRef={addressReportRef}
							/>
							<TextField
								margin="normal"
								required
								fullWidth
								name="description-report"
								label="Descricao da denuncia"
								type="description"
								id="description_report"
								inputRef={descriptionReportRef}
								multiline
								rows={2}
								maxRows={4}
							/>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								sx={{ mt: 3, mb: 2 }}
							>
								Registrar Problema
							</Button>
						</Box>
					</FormControl>
				</Box>
			</Modal>

			<Stack gap={"1rem"} mt={6} mb={10}>
				{reports.map((item, index) => (
					<Card key={index} sx={{ minWidth: 275 }}>
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
									<Box display="flex" alignItems="center" gap={2}>
										<Typography>Visualizar comentarios</Typography>
										<ExpandMore
											expand={expanded === index}
											onClick={() => handleExpandClick(index, item.id)}
											aria-expanded={expanded === index}
											aria-label="show more"
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
									Object.keys(item.comments).map((key: any) => {
										return <CommentReport item={item.comments[key]} />;
									})
								) : (
									<Typography> Sem comentarios disponiveis </Typography>
								)}

								<Grid container mt={4}>
									<FormComment currentReportId={currentReportId} />
								</Grid>
							</CardContent>
						</Collapse>
					</Card>
				))}
			</Stack>
		</Container>
	);
};
