import { Router } from 'express';
import contatoController from '../controllers/ContatoController';

const routes = new Router();

// Rotas
routes.post('/', contatoController.store); // CREATE
routes.get('/', contatoController.index); // READ
routes.get('/:id', contatoController.show); // READ BY ID
routes.put('/:id', contatoController.update); // UPDATE
routes.delete('/:id', contatoController.delete); // DELETE

export default routes;
