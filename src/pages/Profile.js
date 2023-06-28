import {
	Box,
	Button,
	Container,
	FormControl,
	Grid,
	InputAdornment,
	InputLabel,
	OutlinedInput,
} from "@mui/material";
import React, { useState } from "react";
import { useAuth } from "../AuthProvider";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";

export const Perfil = () => {
	const { currentUser } = useAuth();

	const [formValues, setFormValues] = useState({
		displayName: "",
		email: "",
		phoneNumber: ""
	});

	return (
		<Container component="main">
			<Grid
				container
				direction="column"
				alignItems="center"
				justifyContent="center"
				minHeight="100vh"
			>
				<Grid
					item
					md={8}
					sx={{
						padding: 5,
						borderRadius: 10,
						backgroundColor: "#F7F7F5",
						boxShadow: "5px 5px 16px rgba(0,0,0,0.1)",
					}}
				>
					<FormControl fullWidth>
						<Grid container spacing={2}>
							<Grid item xs={6}>
								<Box>Foto de perfil</Box>
							</Grid>
							<Grid item xs={6}>
								<FormControl fullWidth sx={{ mb: 2 }}>
									<InputLabel>Nome Completo</InputLabel>
									<OutlinedInput
										required
										label="Nome completo"
										sx={{ borderRadius: 10 }}
										value={currentUser.displayName}
										onChange={(e) => setFormValues({ ...formValues, displayName: e.target.value })}
										startAdornment={
											<InputAdornment position="start">
												<PermIdentityOutlinedIcon fontSize="small" />
											</InputAdornment>
										}
									/>
								</FormControl>
								<FormControl fullWidth sx={{ mb: 2 }}>
									<InputLabel>E-mail</InputLabel>
									<OutlinedInput
										required
										label="E-mail"
										sx={{ borderRadius: 10 }}
										value={currentUser.email}
										onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
										startAdornment={
											<InputAdornment position="start">
												<EmailOutlinedIcon fontSize="small" />
											</InputAdornment>
										}
									/>
								</FormControl>
								<FormControl fullWidth sx={{ mb: 2 }}>
									<InputLabel>Telefone</InputLabel>
									<OutlinedInput
										required
										label="Telefone"
										sx={{ borderRadius: 10 }}
										value={currentUser.phoneNumber}
										onChange={(e) => setFormValues({ ...formValues, phoneNumber: e.target.value })}
										startAdornment={
											<InputAdornment position="start">
												<LocalPhoneOutlinedIcon fontSize="small" />
											</InputAdornment>
										}
									/>
								</FormControl>
							</Grid>
						</Grid>
						<Box
							sx={{
								display: "flex",
								justifyContent: "flex-end",
								width: "100%",
							}}
						>
							<Button
								type="submit"
								variant="contained"
								sx={{ mt: 1, borderRadius: 10 }}
							>
								Salvar alterações
							</Button>
						</Box>
					</FormControl>
				</Grid>
			</Grid>
		</Container>
	);
};
