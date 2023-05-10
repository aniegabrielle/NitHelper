import React, { useRef, useState } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";

import { db } from "../utils/firebase";
import {
	FormControl,
	FormLabel,
	IconButton,
	InputAdornment,
	InputLabel,
	OutlinedInput,
	Stack,
	ToggleButton,
	ToggleButtonGroup,
} from "@mui/material";
import { useAuth } from "../AuthProvider";
import { ref, set } from "firebase/database";
import { Citizen, PublicAgent, UserSystem } from "../types/user";
import { updateProfile } from "firebase/auth";

export const SignUp = () => {
	const { signUp } = useAuth();

	const emailRef = useRef<HTMLInputElement>();
	const nameRef = useRef<HTMLInputElement>();
	const passwordRef = useRef<HTMLInputElement>();
	const phoneRef = useRef<HTMLInputElement>();
	const zipCodeRef = useRef<HTMLInputElement>();
	const officeRef = useRef<HTMLInputElement>();
	const registerRef = useRef<HTMLInputElement>();

	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [isLoading, setLoading] = useState<boolean>(false);
	const [userRole, setUserRole] = useState<UserSystem["role"]>("citizen");

	const registerUser = async (
		email: string,
		name: string,
		password: string,
		phone: string
	) => {
		setLoading(true);
		await signUp(email, password).then((userCredential) => {
			const user = userCredential.user;

			updateProfile(user, {
				displayName: name,
			}).then(() => {});

			const userCredentials = {
				displayName: name,
				phoneNumber: phone,
				email: email,
				uid: user.uid,
				reports: [],
				comments: [],
			} as unknown as Citizen | PublicAgent;

			return set(ref(db, "/users/" + user.uid), { ...userCredentials });
		});

		setLoading(false);
		window.location.pathname = `/home`;
	};

	const writeUserData = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const email = emailRef.current?.value;
		const name = nameRef.current?.value;
		const password = passwordRef.current?.value;
		const phone = phoneRef.current?.value;
		const zipCode = zipCodeRef.current?.value;
		const office = officeRef.current?.value;
		const register = registerRef.current?.value;

		if (email && name && password)
			registerUser(
				String(email),
				String(name),
				String(password),
				String(phone)
			);
	};

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleMouseDownPassword = (event: { preventDefault: () => void }) => {
		event.preventDefault();
	};

	const handleRoleChange = (
		e: React.MouseEvent<HTMLElement, MouseEvent>,
		newRole: UserSystem["role"]
	) => {
		setUserRole(newRole);
	};

	return isLoading ? (
		<CircularProgress />
	) : (
		<Container component="main" maxWidth="xs">
			<Grid
				container
				spacing={0}
				direction="column"
				alignItems="center"
				justifyContent="center"
				style={{ minHeight: "90vh" }}
			>
				<Grid item xs={3}>
					<Typography component="h1" variant="h5">
						Cadastro
					</Typography>
					<Box
						component="form"
						noValidate
						onSubmit={writeUserData}
						sx={{ mt: 3 }}
					>
						<FormControl fullWidth sx={{ mb: 2 }}>
							<InputLabel>Nome Completo</InputLabel>
							<OutlinedInput
								required
								label="Nome Completo"
								inputRef={nameRef}
								startAdornment={
									<InputAdornment position="start">
										<PermIdentityOutlinedIcon />
									</InputAdornment>
								}
							/>
						</FormControl>

						<FormControl fullWidth sx={{ mb: 3 }}>
							<Stack spacing={1}>
								<FormLabel>Qual seu papel para o aplicativo?</FormLabel>
								<ToggleButtonGroup
									color="primary"
									value={userRole}
									exclusive
									onChange={handleRoleChange}
									aria-label="Platform"
									sx={{ mb: 1 }}
								>
									<ToggleButton value="citizen" size="small">
										Cidadao
									</ToggleButton>
									<ToggleButton value="publicAgent" size="small">
										Funcionario publico
									</ToggleButton>
								</ToggleButtonGroup>
							</Stack>
						</FormControl>

						{userRole === "publicAgent" ? (
							<Box>
								<FormControl fullWidth sx={{ mb: 2 }}>
									<InputLabel>Cargo</InputLabel>
									<OutlinedInput
										required
										label="E-mail"
										inputRef={officeRef}
										startAdornment={
											<InputAdornment position="start">
												<EmailOutlinedIcon />
											</InputAdornment>
										}
									/>
								</FormControl>
								<FormControl fullWidth sx={{ mb: 2 }}>
									<InputLabel>Registro</InputLabel>
									<OutlinedInput
										required
										label="E-mail"
										inputRef={registerRef}
										startAdornment={
											<InputAdornment position="start">
												<EmailOutlinedIcon />
											</InputAdornment>
										}
									/>
								</FormControl>
							</Box>
						) : (
							<Box>
								<FormControl fullWidth sx={{ mb: 2 }}>
									<InputLabel>CEP</InputLabel>
									<OutlinedInput
										required
										label="CEP"
										inputRef={zipCodeRef}
										startAdornment={
											<InputAdornment position="start">
												<EmailOutlinedIcon />
											</InputAdornment>
										}
									/>
								</FormControl>
							</Box>
						)}

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
							<InputLabel>Telefone</InputLabel>
							<OutlinedInput
								required
								label="Telefone"
								inputRef={phoneRef}
								startAdornment={
									<InputAdornment position="start">
										<LocalPhoneOutlinedIcon />
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
								Cadastrar
							</Button>
						</Box>
					</Box>
				</Grid>
			</Grid>
		</Container>
	);
};
