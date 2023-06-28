// pages
import { Login } from "../pages/Login";
import { Home } from "../pages/Home";
import { SignUp } from "../pages/SignUp";
import { Perfil } from "../pages/Profile";

export const routes = [
	{
		key: "login-route",
		title: "Login",
		path: "/",
		enabled: true,
		component: Login,
	},
	{
		key: "home-route",
		title: "Home",
		path: "/home",
		enabled: true,
		component: Home,
	},
	{
		key: "signup-route",
		title: "Cadastro",
		path: "/cadastro",
		enabled: true,
		component: SignUp,
	},
	{
		key: "profile-route",
		title: "Perfil",
		path: "/perfil",
		enabled: true,
		component: Perfil,
	},
];
