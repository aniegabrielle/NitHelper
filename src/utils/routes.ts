// pages
import { Login } from '../pages/Login';
import { Home } from '../pages/Home';
import { SignUp } from '../pages/SignUp';

export const routes = [
  {
    key: 'login-route',
    title: 'Login',
    path: '/',
    enabled: true,
    component: Login
  },
  {
    key: 'home-route',
    title: 'Home',
    path: '/home',
    enabled: true,
    component: Home
  },
  {
    key: 'signup-route',
    title: 'Cadastro',
    path: '/cadastro',
    enabled: true,
    component: SignUp
  }
];
