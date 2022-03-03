export default (socket) => {
    console.log(
        `\x1b[32m[socket] ${socket.id} connected\x1b[0m`
    );

    // Join (subscribe)
    socket.on('subscribe', (room) =>
        socket.join(room));

    // Leave (unsubscribe)
    socket.on('unsubscribe', (room) =>
        socket.leave(room));

    // Testcall
    socket.on('test', (msg) =>
        console.log(
            `\x1b[33m[socket:testmessage] ${msg}\x1b[0m`
        ));
};
