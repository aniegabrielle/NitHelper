import Button from "@mui/material/Button";
import { AppBar, Typography, Toolbar } from "@mui/material";
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";

export const MenuNavigation = () => {
	let navigate = useNavigate();

	const handleLogout = () => {
		auth.signOut();
		return navigate("/");
	};

	return (
		<AppBar
			position="static"
			color="default"
			elevation={0}
			sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
		>
			<Toolbar sx={{ flexWrap: "wrap" }}>
				<Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
					NitHelper
				</Typography>
				<Button
					onClick={handleLogout}
					variant="outlined"
					sx={{ my: 1, mx: 1.5 }}
				>
					Sair
				</Button>
			</Toolbar>
		</AppBar>
	);
};
