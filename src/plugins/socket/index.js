import jwtAuth from './auth';
import socketActions from './actions';

export default {
    name: 'socket',
    version: '1.0.0',
    register: (server) => {
        const io = require('socket.io')(server.listener);

        // Authorization
        io.set('authorization', jwtAuth)
            .on('connection', (socket) =>
                socketActions(socket));

        server.decorate('toolkit', 'socket', io);
    }
};


