const express = require('express')
const cors = require('cors');

const { socketController } = require('../sockets/controller');


class Server{

    constructor() {
        this.app    = express();
        this.port   = process.env.PORT;
        this.server = require('http').createServer( this.app );
        this.io     = require('socket.io')( this.server );

        this.paths  = {
        }

        //Middlewares
        // Los middlewares son funciones que van añadir funcionalidades al web server
        this.middlewares();

        //Rutas de mi aplicación
        this.routes();

        //Sockets
        this.sockets();
    }

    middlewares() {

        //cors
        this.app.use( cors() );

        //directorio público
        this.app.use( express.static('public') );
        
    }

    routes() {
        
        // this.app.use( this.paths.auth ,         require('../routes/auth'));
        
    }

    sockets() {
        this.io.on('connection', socketController);
    }

    listen() {
        this.server.listen( this.port, ()=>{
            console.log('Servidor corriendo en el puerto', this.port);
        })
    }
}

module.exports = Server;