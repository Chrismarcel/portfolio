'use strict';

const Hapi = require('@hapi/hapi');
const path = require('path');
const dotenv = require('dotenv');
const inert = require('inert');

dotenv.config();

const initServer = async () => {
    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            files: {
                relativeTo: path.join(__dirname, 'server/public')
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return h.file('index.html');
        }
    });

    server.route({
        method: 'GET',
        path: '/{directory}/{filename?}',
        handler: ({ params }, h) => {
            if (params.directory === 'index.html') {
                return h.redirect('/');
            }
            return h.file(`${params.directory}/${params.filename}`);
        }
    });

    await server.register(inert);
    await server.start()
}

process.on('unhandledRejection', (error) => {
    process.exit(1);
});

initServer()
