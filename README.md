# Sockets - Fundamentos de los sockets
- Qué es web sockets

    Un sockets io nos facilita el uso de web sockets, lo usamos para manejar clientes(socket), activa a activa? a nuestro servidor. lo utilizamos para comunicarnos con los clientes pero que no tengan que pedir información en todo momento si no al momento de haber un cambio en el back-end

    1. Introducción a los sockets
    2. Resolver preguntas comunes sobre los sockets
    3. Instalación de Socket.io
    4. Detectar conexiones y desconexiones de usuarios
    5. Emitir mensajes cliente servidor / servidor cliente
    6. Escuchar los mensajes servidor cliente / cliente servidor
    7. Broadcast
    8. Callbacks en los sockets
    9. Pruebas en Heroku
- Qué son los sockets y para que nos pueden servir?
    - Un socket permite mantener una comunicación activa con la máquina cliente y el servidor.
    - Podemos saber por ejemplo, cuando una persona se desconecta, conecta y se vuelve a conectar.

- Fundamentos sobre los Web Sockets
    - Configuramos nuestro server para poder iniciar el proyecto, instalamos los paquetes de `express corn dotenv` así poder correr nuestro servidor.

    ```jsx
    const express = require('express')
    const cors = require('cors');

    class Server{

        constructor() {
            this.app = express();
            this.port = process.env.PORT;

            this.paths = {
            }

            //Middlewares
            // Los middlewares son funciones que van añadir funcionalidades al web server
            this.middlewares();

            //Rutas de mi aplicación
            this.routes();
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

        listen() {
            this.app.listen(this.port, ()=>{
                console.log('Servidor corriendo en el puerto', this.port);
            })
        }
    }

    module.exports = Server;
    ```

    - Dejamos algunas configuraciones de nuestro proyecto anterior, que usaremos más adelante, y vemos correr a nuestro servidor renderizando los archivos del `public`

    ```jsx
    require('dotenv').config()

    const Server = require('./models/server');

    const server = new Server();

    server.listen();
    ```

    ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/d63fe11d-364a-43c4-9a9e-a99c892a7118/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/d63fe11d-364a-43c4-9a9e-a99c892a7118/Untitled.png)

    ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/18f2f20b-bef7-41ec-80f0-af174f462560/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/18f2f20b-bef7-41ec-80f0-af174f462560/Untitled.png)

    - todo funciona bien :)
- Instalación de SOCKET.IO
    - Para poder instalar [SOCKET.IO](http://socket.IO) utilizaremos el paquete `npm i[socket.io](http://socket.io)` , esto nos va ayudar a utilizar la tecnología de web sockets, una vez hecho la instalación, en la documentación nos va ayudar.

    ```jsx
    constructor() {
            this.app    = express();
            this.port   = process.env.PORT;
            this.server = require('http').createServer( this.app );
            this.io     = require('socket.io')( this.server );
    ```

    - Y se va configurar el listen cambiando el app por el server

    ```jsx
    listen() {
            this.server.listen(this.port, ()=>{
                console.log('Servidor corriendo en el puerto', this.port);
            })
        }
    ```

    - Y para revisar si el [socket.io](http://socket.io) funciona se va enlazar el siguiente script y si no sale ningún error en el log entonces el socket.io esta funcionando correctamente

    ```jsx
    <body class="container">
        <h1 class="mt-2">Socket Client</h1>
        <hr>

        <script src="./socket.io/socket.io.js"></script>
        <script src="./js/socket-client.js"></script>
    </body>
    ```

- Configuración del [SOCKET.IO](http://socket.IO) front-end
    - Para poder configurar nuestro socket en el front vamos a configurar el servidor y js del cliente.

    ```jsx
    constructor() {
            this.app    = express();
            this.port   = process.env.PORT;
            this.server = require('http').createServer( this.app );
            this.io     = require('socket.io')( this.server );
    }

    sockets() {
            this.io.on('connection', socket => {
                console.log('cliente conectado');
                
                socket.on('disconnect', () => {
                    console.log('Cliente desconectado')
                })
            });
    }
    ```

    - Iniciamos la conexión con el `this.io.on` el primer parámetro mostrando la conexión o desconexión  y luego utilizando las propiedades del socket que se está empleando.
    - Para el cliente vamos a conectarnos con lo siguiente

    ```jsx
    const socket = io();
    ```

    - Cuando el servidor se desconecta el socket del cliente va intentar conectarse al servidor unas x veces en intervalos de tiempo cada vez más grande.
    - Cuando el cliente termina o se conecta al servidor con los sockets podemos detectarlo en el servidor a través de mensajes de error.

- Mensajes de conexión y desconexión Cliente
    - Para manejar la conexión o desconexión del cliente utilizaremos `bootstrap` y algunos manejos con el js del cliente, funciones de la propiedad [socket.io](http://socket.io).

    ```jsx
    <p>
            Server Status:
            <span id="lblOnline" class="text-success" >Online</span>
            <span id="lblOffline" class="text-danger" >Offline</span>
        </p>
    ```

    - Este es el código para el mensaje en el lado del cliente sobre conexión o desconexión.

    ```jsx
    const lblOnline  = document.querySelector('#lblOnline');
    const lblOffline = document.querySelector('#lblOffline');

    const socket = io();

    socket.on('connect', () =>{
        console.log('Conectado');

        lblOffline.style.display = 'none';
        lblOnline.style.display  = '';
    })

    socket.on('disconnect', () =>{
        console.log('Desconectado del servidor');

        lblOnline.style.display  = 'none';
        lblOffline.style.display = '';
    })
    ```

    - la propiedad `socket.on` tiene parámetros establecidos uno de ellos es el `connect` y el `disconnect` las cuales al detectar el estado del cliente respecto al servidor va ejecutar la función flecha.

- Emitir desde el cliente - Escuchar en el servidor
    - Para enviar datos al servidor a través del socket se va utilizar el `socket.on` el primer parámetro vamos a crear una canal en el cual si el servidor también tiene ese canal lo va recibir, desde el cliente, como segundo parámetro, se puede enviar datos o llamado también `payload` en este objeto vamos a almacenar toda la información para enviarla al servidor.

    ```jsx
    btnEnviar.addEventListener( 'click', () => {
        
        const mensaje = txtMensaje.value;

        const payload = {
            mensaje,
            id: '123',
            fecha: new Date().getTime()
        }

        socket.emit( 'enviar-mensaje', payload );
    })
    ```

    ```jsx
    socket.on('enviar-mensaje', ( payload ) => {
                    console.log( payload );
                })
    ```

    ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/199e96c5-7c9b-4bf7-b518-dc0f3bfd5156/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/199e96c5-7c9b-4bf7-b518-dc0f3bfd5156/Untitled.png)

- Emitir desde el servidor - Escuchar en el cliente
    - Para emitir mensajes a través del servidor, tenemos que crear un nuevo nuevo `socket.on` dentro del socket `enviar-mensaje` pero este caso este socket está emitiendo `emit` y lo que va enviar como mensaje es el mismo `payload` que está recibiendo, por lo cual en este caso esta enviando información a todos los clientes.

     

    ```jsx
    socket.on('enviar-mensaje', ( payload ) => {
                    
                    this.io.emit('enviar-mensaje', payload );

                })
    ```

    - También hacemos lo mismo desde el lado del cliente, creamos un `socket.on` con el parámetro de `enviar-mensaje` este va ser el canal en donde está siendo recibido, por el cual va comenzar a hablar en nuestro navegador.

    ```jsx
    socket.on('enviar-mensaje', ( payload )=>{
        console.log( payload )
    })
    ```

    ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/675cebdd-4b3b-46a3-b190-e98e97b2acd0/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/675cebdd-4b3b-46a3-b190-e98e97b2acd0/Untitled.png)

- Retroalimentación de emisiones del cliente hacia el servidor
    - En este punto podemos enviar un mensaje de éxito al cliente cuando realice su comunicación, para esto desde el cliente vamos a usar un tercer parámetro en el `socket.emit` lo cual se le va enviar un objeto o variable que queremos que se refleje en el mensaje.

    ```jsx
    btnEnviar.addEventListener( 'click', () => {
        
        const mensaje = txtMensaje.value;

        const payload = {
            mensaje,
            id: '123',
            fecha: new Date().getTime()
        }

        socket.emit( 'enviar-mensaje', payload, ( id ) => {
            console.log('Desde el server', id);
        });
    })
    ```

    - Y desde el servidor en el `socket.on` de `enviar-mensaje` en la función flecha que solo tenia el parámetro del `payload` se le va agregar un `callback` en el cual se le está regresando el parámetro  que se uso en el cliente.

    ```jsx
    sockets() {
            this.io.on('connection', socket => {
                // console.log('cliente conectado');
                
                socket.on('disconnect', () => {
                    // console.log('Cliente desconectado');
                })

                socket.on('enviar-mensaje', ( payload, callback ) => {
                    
                    const id = 12345;

                    callback( id );

                    // this.io.emit('enviar-mensaje', payload );

                })
            });
        }
    ```

- Broadcast - Ordenar nuestro código
    - Lo que se va hacer es ordenar el código, exportando nuestro código de los sockets a un archivo llamado `controller`, luego nombramos una función y pegamos todo el código del socket.

    ```jsx
    const socketController = (socket) => {
        console.log('cliente conectado', socket.id);
        
        socket.on('disconnect', () => {
            console.log('Cliente desconectado');
        })

        socket.on('enviar-mensaje', ( payload, callback ) => {
            
            const id = 12345;

            callback( id );

            socket.broadcast.emit('enviar-mensaje', payload );

        })
    }

    module.exports = {
        socketController
    }
    ```

    ```jsx
    sockets() {
            this.io.on('connection', socketController);
        }
    ```

    - También se cambio el `[this.io](http://this.io)` en el `emit` dado que ya no estamos trabajando en el archivo del server, entonces mandaría conflicto y utilizaremos el `socket.broadcast` lo cual también no ayuda a que al momento de emitir el mensaje desde el lado del cliente, este no reciba su propio mensaje, y solo recibe el mensaje de confirmación o éxito que configuramos en el servidor

- Despliegue a Heroku
    - Se tiene que agregar el start: "node app" en el package