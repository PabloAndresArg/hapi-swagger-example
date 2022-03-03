import { configuredRBAC } from '~/plugins/auth';

export default configuredRBAC({
    guest: {
        can: ['messages:find', 'messages:findOne']
    },
    user: {
        can: [
            'messages:create',
            {
                name: 'messages:update',
                when: ({ document: { author }, credentials }, done) =>
                    done(null, author._id.equals(credentials._id))
            },
            {
                name: 'messages:delete',
                when: ({ document: { author }, credentials }, done) =>
                    done(null, author._id.equals(credentials._id))
            }
        ],
        inherits: ['guest']
    },
    admin: {
        can: ['messages:*'],
        inherits: ['user']
    }
});
