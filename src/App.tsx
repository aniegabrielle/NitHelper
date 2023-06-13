import { AuthProvider } from "./AuthProvider";
import { Grid, ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import { routes as appRoutes } from "./utils/routes";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { MenuNavigation } from "./components/Menu";

export const App = () => {
	return (
		<AuthProvider>
			<ThemeProvider theme={theme}>
				<BrowserRouter>
					<Grid container>
						<Grid
							item
							xs={2}
							height="100vh"
							sx={{
								backgroundColor: "#fff",
								position: "fixed",
								maxWidth: "200px !important",
								width: "100%",
								boxShadow: "5px 5px 16px rgba(0,0,0,0.1)",
							}}
						>
							<MenuNavigation />
						</Grid>
						<Grid
							item
							xs={10}
							sx={{ backgroundColor: "#F2F2F2", marginLeft: "200px" }}
						>
							<Routes>
								{appRoutes.map((route) => (
									<Route
										key={route.key}
										path={route.path}
										element={<route.component />}
									/>
								))}
							</Routes>
						</Grid>
					</Grid>
				</BrowserRouter>
			</ThemeProvider>
		</AuthProvider>
	);
};
