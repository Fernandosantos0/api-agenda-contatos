import { Router } from 'express';

const routes = new Router();

import homeRoutes from './homeRoutes';
import contatoRoutes from './contatoRoutes';

// Rotas
routes.use('/', homeRoutes);
routes.use('/contatos', contatoRoutes);

// 404
routes.use((req, res) => {
    return res.status(404).json({
        errors: `Not found ${req.method} ${req.url}`
    });
});

export default routes;
