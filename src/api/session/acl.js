import { configuredRBAC } from '~/plugins/auth/rbac';

export default configuredRBAC({
    guest: {
        can: []
    },
    user: {
        can: [
            'sessions:find', {
                name: 'sessions:delete',
                when: ({ document: { author }, credentials }, done) =>
                    done(null, author._id.equals(credentials._id))
            }
        ]
    }
});
