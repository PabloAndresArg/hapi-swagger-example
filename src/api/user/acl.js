import { configuredRBAC } from '~/plugins/auth/rbac';

export default configuredRBAC({
    guest: {
        can: ['users:find', 'users:create', 'users:findOne']
    },
    user: {
        can: [
            {
                name: 'users:findMe',
                when: ({ document, user }, done) =>
                    done(null, document?._id.equals(user._id))
            },
            {
                name: 'users:update',
                when: ({ document, user }, done) =>
                    done(null, document._id.equals(user._id))
            },
            {
                name: 'users:delete',
                when: ({ document, user }, done) =>
                    done(null, document._id.equals(user._id))
            }
        ],
        inherits: ['guest']
    },
    admin: {
        can: ['users:*'],
        inherits: ['user']
    }
});
