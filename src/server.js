import doten from 'dotenv';
doten.config();

import 'colors';
import app from './app';

import connection from './db';

// Evento
app.on('server_on', () => {
    const SERVER_HOST = process.env.SERVER_HOSTNAME || '127.0.0.1';
    const SERVER_PORT = process.env.SERVER_PORT || 3000;

    app.listen(SERVER_PORT, SERVER_HOST, function() {
        console.log('Servidor ligado'.yellow.bold);
        console.log(`Endereço http://${SERVER_HOST}:${SERVER_PORT}`.green.bold);
    });
});

connection()
    .then(() => {
        console.log('Conexão com o banco de dados estabelecido com sucesso'.blue.bold);
        app.emit('server_on');
    })
    .catch((err) => {
        console.log('Não foi possível estabelecer conexão com o banco'.red.bold);
        console.error(err);
    });


