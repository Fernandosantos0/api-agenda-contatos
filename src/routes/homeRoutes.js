import { Router } from 'express';
import homeController from '../controllers/HomeController';

const routes = new Router();

// Rotas
routes.get('/', homeController.index);

export default routes;
