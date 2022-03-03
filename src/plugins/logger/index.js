const plugin = {
    name: 'logger',
    version: '1.0.0',
    register: (server) => {
        // $lab:coverage:off$
        if (process.env.NODE_ENV !== 'development') {
            return;
        }

        server.events.on('start', () => {
            const { info } = server;
            console.log(
                // eslint-disable-next-line max-len
                `\x1b[32m[server] alive at ${info.uri}\x1b[0m`
            );
        });


        server.events.on('response', (request) => {
            // Disable log swagger url
            if (request.path.match(/(docu|swagger)/)) {
                return;
            }

            if (request.path) {
                console.log(
                // eslint-disable-next-line max-len
                    `\x1b[34m\x1b[1m${request.method.toUpperCase()} \x1b[0m\x1b[33m${request.path} - ${request.response.statusCode}\x1b[0m`
                );
            }
        });

        const logger = (message) => {
            console.log(
                // eslint-disable-next-line max-len
                `\x1b[31m[${message.type || 'error'}]\x1b[0m`
            );
            console.log(message.content);
        };

        server.decorate('toolkit', 'logger', logger);

        // $lab:coverage:on$
    }
};

export default plugin;
