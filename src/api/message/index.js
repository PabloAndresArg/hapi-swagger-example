import { find, findOne, create, update, deleteOne } from './handler';
import { addAuthor } from '~/utils';

export default [
    {
        method: 'GET',
        path: '/messages',
        options: {
            auth: false,
            description: 'Get messages',
            notes: 'Returns all messages',
            tags: ['api', 'message'],
            ...find
        }
    },
    {
        method: 'GET',
        path: '/messages/{_id}',
        options: {
            auth: false,
            description: 'Get one message',
            notes: 'Returns one message',
            tags: ['api', 'message'],
            ...findOne
        }
    },
    {
        method: 'POST',
        path: '/messages',
        options: {
            description: 'Add one message',
            notes: 'Returns the created message item',
            tags: ['api', 'message'],
            pre: [addAuthor],
            ...create
        }
    },
    {
        method: 'PUT',
        path: '/messages/{_id}',
        options: {
            description: 'Update one message',
            notes: 'Returns the updated message item',
            tags: ['api', 'message'],
            ...update
        }
    },
    {
        method: 'DELETE',
        path: '/messages/{_id}',
        options: {
            description: 'Delete one message',
            notes: 'Returns a status message',
            tags: ['api', 'message'],
            ...deleteOne
        }
    }

];
