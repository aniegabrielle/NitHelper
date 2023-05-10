import { AuthProvider } from "./AuthProvider";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import { routes as appRoutes } from "./utils/routes";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { MenuNavigation } from "./components/Menu";

export const App = () => {
	return (
		<AuthProvider>
			<ThemeProvider theme={theme}>
				<BrowserRouter>
					<MenuNavigation />
					<Routes>
						{appRoutes.map((route) => (
							<Route
								key={route.key}
								path={route.path}
								element={<route.component />}
							/>
						))}
					</Routes>
				</BrowserRouter>
			</ThemeProvider>
		</AuthProvider>
	);
};
