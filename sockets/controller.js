

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