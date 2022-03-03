import { jwt } from '~/config';
import { validate } from './handler';
import routes from './routes';
export * from './rbac';
export * from './mongoose';
export * from './utils';

export default [
    {
        plugin: require('hapi-auth-jwt2')
    },
    {
        plugin: {
            name: 'auth',
            version: '1.0.0',
            register: (server) => {
                // Define authentication
                server.auth.strategy('jwt', 'jwt', {
                    key: jwt.secret,
                    validate
                });
                server.auth.default('jwt');
                // Add routes
                server.route(routes);
            }
        }
    }
];
