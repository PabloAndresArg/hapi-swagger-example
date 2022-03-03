import { create, find, findOne } from './handler';

const routes = [
    {
        method: 'POST',
        path: '/users',
        options: {
            auth: false,
            description: 'Add one user',
            notes: 'Returns a user item',
            tags: ['api', 'user'], // ADD THIS TAG
            ...create
        }
    },
    {
        method: 'GET',
        path: '/users',
        options: {
            description: 'Get users',
            notes: 'Returns the users',
            tags: ['api', 'user'], // ADD THIS TAG
            ...find
        }
    },
    {
        method: 'GET',
        path: '/users/{_id}',
        options: {
            description: 'Get a user',
            notes: 'Returns the user',
            tags: ['api', 'user'], // ADD THIS TAG
            ...findOne
        }
    }
];

export default routes;
