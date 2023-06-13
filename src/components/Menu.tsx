import Button from "@mui/material/Button";
import { Typography, Box, Stack } from "@mui/material";
import { auth } from "../utils/firebase";
import { Link, useLocation, useNavigate } from "react-router-dom";

export const MenuNavigation = () => {
	const location = useLocation();

	let navigate = useNavigate();

	const handleLogout = () => {
		auth.signOut();
		return navigate("/");
	};

	if (location.pathname === "/cadastro" || location.pathname === "/")
		return <Box></Box>;

	return (
		<Stack
			direction="column"
			justifyContent="space-between"
			alignItems="center"
			height="100vh"
			width="100%"
		>
			<Stack direction="column" spacing={3} width="80%" mt={3}>
				<Typography variant="h6" color="inherit" mb={7}>
					NitHelper
				</Typography>
				<Link to="/home">Feed</Link>
				<Link to="/perfil">Perfil</Link>
			</Stack>

			<Button
				onClick={handleLogout}
				variant="outlined"
				color="primary"
				sx={{ mb: 3, width: "80%" }}
			>
				Sair
			</Button>
		</Stack>
	);
};
