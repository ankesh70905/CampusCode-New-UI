import './styles/base.css';
import './styles/site.css';
import './styles/auth.css';
import './styles/redesign.css';
import { initializeAuth } from './scripts/auth.js';
import { initializeExperience } from './scripts/experience.js';
import { initializeMotion } from './scripts/motion.js';
import { initializeNavigation, initializeScrollProgress } from './scripts/navigation.js';
import { initializeTheme } from './scripts/theme.js';
import { homePage } from './pages/home.js';
import { loginPage } from './pages/login.js';
import { registerPage } from './pages/register.js';

const app = document.querySelector('#app');
const basePath = import.meta.env.BASE_URL;
const pathWithoutBase = window.location.pathname.startsWith(basePath)
  ? window.location.pathname.slice(basePath.length - (basePath.endsWith('/') ? 1 : 0))
  : window.location.pathname;
const route = pathWithoutBase.replace(/\/+$/, '') || '/';

if (route === '/login') {
  app.innerHTML = loginPage();
  document.title = 'Login — CampusCode';
  initializeAuth();
} else if (route === '/register') {
  app.innerHTML = registerPage();
  document.title = 'Join CampusCode';
  initializeAuth();
} else {
  app.innerHTML = homePage();
  document.title = 'CampusCode — Hackathon Arena';
  initializeNavigation();
  initializeScrollProgress();
  initializeExperience();
}

initializeTheme();
initializeMotion();
