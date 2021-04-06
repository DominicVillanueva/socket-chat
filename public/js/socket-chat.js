var socket = io();

var params = new URLSearchParams(window.location.search);
if(!params.has('name') || !params.has('room')) {
    window.location = 'index.html';
    throw new Error('El nombre y la sala son necesarios');
};

var user = {
    name: params.get('name'),
    room: params.get('room'),
}

socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('enterChat', user, function(res) {
        //console.log('Usuarios conectados en sala:', res);
        renderUsers(res);
    });
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Escuchar información|mensaje
socket.on('createdMessage', function(message) {
    renderMessages(message, false);
    scrollBottom();
});

// Escuchar cambios cuando un usuario entra o sale del chat
socket.on('listPeoples', function(personas) {
    // console.log(personas);
    renderUsers(personas);
});

// Private message
socket.on('privateMessage', function(message) {
    console.log('Mensaje privado:', message);
});

