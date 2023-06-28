import React, { useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "../AuthProvider";
import { auth } from "../utils/firebase";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
	setPersistence,
	signInWithEmailAndPassword,
	browserSessionPersistence,
} from "firebase/auth";

import Button from "@mui/material/Button";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import {
	FormControl,
	IconButton,
	InputAdornment,
	InputLabel,
	Link,
	OutlinedInput,
} from "@mui/material";

export const Login = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [errorMessage, setErrorMessage] = useState();

	const { user, login } = useAuth();
	let navigate = useNavigate();

	const emailRef = useRef();
	const passwordRef = useRef();

	const handleSubmit = async (e) => {
		e.preventDefault();

		const email = emailRef.current?.value;
		const password = passwordRef.current?.value;

		await setPersistence(auth, browserSessionPersistence)
			.then(() => {
				login(String(email), String(password))
					.then((userCredential) => console.log(userCredential.user))
					.catch((error) => {
						if (error.code === "auth/wrong-password") {
							setErrorMessage("Senha inválida");
						} else {
							setErrorMessage("Email ou senha invalidos, tente novamente");
						}
					});
				signInWithEmailAndPassword(auth, String(email), String(password))
					.then((userCredential) => {
						const user = userCredential.user;
					})
					.catch((error) => {
						if (error.code === "auth/wrong-password") {
							setErrorMessage("Senha inválida");
						} else {
							setErrorMessage("Email ou senha invalidos, tente novamente");
						}
					});
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.log(errorCode, errorMessage);
			});
	};

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	useEffect(() => {
		if (user && user?.email !== null) {
			return navigate("/home");
		}
	}, [user, navigate]);

	return (
		<Container component="main" maxWidth="xs">
			<Grid
				container
				spacing={0}
				direction="column"
				alignItems="center"
				justifyContent="center"
				style={{ minHeight: "100vh" }}
			>
				<Grid
					item
					xs={3}
					container
					display="flex"
					justifyContent="center"
					sx={{
						padding: 5,
						borderRadius: 10,
						backgroundColor: "#F7F7F5",
						boxShadow: "5px 5px 16px rgba(0,0,0,0.1)",
					}}
				>
					<Typography
						component="h1"
						variant="overline"
						sx={{ fontSize: 24, fontWeight: 600 }}
					>
						LOGIN
					</Typography>
					<Box
						component="form"
						noValidate
						onSubmit={handleSubmit}
						sx={{ mt: 3 }}
					>
						<FormControl fullWidth sx={{ mb: 2 }}>
							<InputLabel>E-mail</InputLabel>
							<OutlinedInput
								required
								label="E-mail"
								inputRef={emailRef}
								sx={{ borderRadius: 10 }}
								startAdornment={
									<InputAdornment position="start">
										<EmailOutlinedIcon fontSize="small" />
									</InputAdornment>
								}
							/>
						</FormControl>

						<FormControl fullWidth sx={{ mb: 2 }}>
							<InputLabel>Senha</InputLabel>
							<OutlinedInput
								id="outlined-adornment-password"
								type={showPassword ? "text" : "password"}
								inputRef={passwordRef}
								sx={{ borderRadius: 10 }}
								startAdornment={
									<InputAdornment position="start">
										<LockOutlinedIcon fontSize="small" />
									</InputAdornment>
								}
								endAdornment={
									<InputAdornment position="end">
										<IconButton
											aria-label="toggle password visibility"
											onClick={handleClickShowPassword}
											onMouseDown={handleMouseDownPassword}
											edge="end"
											size="small"
										>
											{showPassword ? (
												<VisibilityOffOutlinedIcon fontSize="small" />
											) : (
												<RemoveRedEyeOutlinedIcon fontSize="small" />
											)}
										</IconButton>
									</InputAdornment>
								}
								label="Password"
							/>
						</FormControl>

						<Typography
							component="p"
							variant="body2"
							color="error"
							align="center"
						>
							{errorMessage ? errorMessage : null}
						</Typography>

						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								width: "100%",
							}}
						>
							<Button
								type="submit"
								variant="contained"
								size="large"
								sx={{ mt: 5, width: "80%", borderRadius: 10, fontWeight: 600 }}
							>
								Entrar
							</Button>
						</Box>
					</Box>
					<Box mt={1}>
						<Link component={RouterLink} to="/cadastro" variant="body2">
							Clique aqui para se cadastrar
						</Link>
					</Box>
				</Grid>
			</Grid>
		</Container>
	);
};

// tratar erros de login/cadastro
