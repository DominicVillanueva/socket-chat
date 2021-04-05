const { io } = require('../server');
const { User } = require('../class/user.class');
const { createdMessage } = require('../utils/utilidades');

const users = new User();

io.on('connection', (client) => {
    client.on('enterChat', (data, callback) => {
        
        if(!data.name || !data.room) {
            return callback({
                error: true,
                message: 'El nombre/sala es necesario',
            });
        }

        // Agregar en una sala a un usuario especifico.
        client.join(data.room);

        users.addPeople(client.id, data.name, data.room);
        
        client.broadcast.to(data.room).emit('listPeoples', users.getPeopleByRoom(data.room));

        callback(users.getPeopleByRoom(data.room));
    });

    client.on('createdMessage', (data) => {
        let people = users.getPeople(client.id);
        let message = createdMessage(people.name, data.message);
        client.broadcast.to(people.room).emit('createdMessage', message);
    });

    client.on('disconnect', () => {
        let userOutRoom = users.removePeople(client.id);
        client.broadcast.to(userOutRoom.room).emit('createdMessage', createdMessage('Administrador', `${ userOutRoom.name } salió`));
        client.broadcast.to(userOutRoom.room).emit('listPeoples', users.getPeopleByRoom(userOutRoom.room));
    });

    // Message privates
    client.on('privateMessage', (data) => {
        let people = users.getPeople(client.id);
        // Enviar mensaje a un usuario
        client.broadcast.to(data.to).emit('privateMessage', createdMessage(people.name, data.message));
    });
});