import { find, deleteOne } from './handler';

export default [
    {
        method: 'GET',
        path: '/sessions',
        options: {
            description: 'Get sessions',
            notes: 'Returns all sessions of the user',
            tags: ['api', 'session'],
            ...find
        }
    },
    {
        method: 'DELETE',
        path: '/sessions/{_id}',
        options: {
            description: 'Delete one session',
            notes: 'Returns a status session',
            tags: ['api', 'session'],
            ...deleteOne
        }
    }

];
