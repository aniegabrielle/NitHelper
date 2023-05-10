import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../AuthProvider";
import { auth } from "../utils/firebase";
import { Link, useNavigate } from "react-router-dom";
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
	OutlinedInput,
} from "@mui/material";

export const Login = () => {
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const { user } = useContext(AuthContext);
	let navigate = useNavigate();

	const emailRef = useRef<HTMLInputElement>();
	const passwordRef = useRef<HTMLInputElement>();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const email = emailRef.current?.value;
		const password = passwordRef.current?.value;

		await setPersistence(auth, browserSessionPersistence)
			.then(() => {
				signInWithEmailAndPassword(auth, String(email), String(password))
					.then((userCredential) => {
						const user = userCredential.user;
						console.log(user);
					})
					.catch((error) => {
						console.log(error);
					});
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.log(errorCode, errorMessage);
			});
	};

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleMouseDownPassword = (event: { preventDefault: () => void }) => {
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
				style={{ minHeight: "90vh" }}
			>
				<Grid item xs={3} container display="flex" justifyContent="center">
					<Typography component="h1" variant="h5">
						Login
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
								startAdornment={
									<InputAdornment position="start">
										<EmailOutlinedIcon />
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
								startAdornment={
									<InputAdornment position="start">
										<LockOutlinedIcon />
									</InputAdornment>
								}
								endAdornment={
									<InputAdornment position="end">
										<IconButton
											aria-label="toggle password visibility"
											onClick={handleClickShowPassword}
											onMouseDown={handleMouseDownPassword}
											edge="end"
										>
											{showPassword ? (
												<VisibilityOffOutlinedIcon />
											) : (
												<RemoveRedEyeOutlinedIcon />
											)}
										</IconButton>
									</InputAdornment>
								}
								label="Password"
							/>
						</FormControl>

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
								sx={{ mt: 5, width: "80%" }}
							>
								Entrar
							</Button>
						</Box>
					</Box>
					<Box mt={3}>
						<Link to="/cadastro">Clique aqui para se cadastrar</Link>
					</Box>
				</Grid>
			</Grid>
		</Container>
	);
};
