import Hapi from '@hapi/hapi';

import routes from '~/api';
import plugins from '~/plugins';
import { host, port, mongodb, env } from '~/config';
import mongoose from '~/services/mongoose';

// Set initial server
const server = Hapi.server({
    port,
    host
});

server.route([
    ...routes
]);

// Set start function for server
export const start = async () => {
    await server.start();
    return server;
};

// Start server (self-executing)
(async () => {
    try {
        mongoose.connect(mongodb.uri);
        await server.register(plugins);
        await start();
    }
    catch (err) {
        // $lab:coverage:off$
        console.log(err);
        process.exit(1);
        // $lab:coverage:on$
    }
})();

// Export for test
export default server;
