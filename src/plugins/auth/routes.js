import { auth } from './handler';

export default [
    {
        method: 'POST',
        path: '/auth',
        options: {
            auth: false,
            description: 'Authenticate user',
            notes: 'Returns a valid jwt token',
            tags: ['api', 'auth'],
            ...auth
        }
    }
];

