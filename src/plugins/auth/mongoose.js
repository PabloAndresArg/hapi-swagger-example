import { forbidden } from '@hapi/boom';

export const checkPermissions = (schema, acl) => {
    // Check ownership
    schema.methods = {
        isMine: (item, { _id }) => item._id.equals(_id)
    };
    // Check permissions
    schema.statics = {
        permissions(user, op, condition) {
            const userRole = user?.role || 'guest';

            return new Promise(async (resolve, reject) => {
                await acl.can(
                    userRole,
                    `${this.collection.name}:${op}`,
                    condition
                ) ? resolve(true) :
                    reject(forbidden('Missing authorization'));
            });
        }

    };
};
