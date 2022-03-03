import Joi from 'joi';
import { badRequest } from '@hapi/boom';

import Session from './model';
import { headers } from '~/plugins/auth';
import { failAction, pagination, params } from '~/utils';

// List all sessions
export const find = {
    validate: ({
        headers,
        failAction,
        query: pagination
    }),
    handler: async ({
        auth: { credentials },
        query
    }) => {
        try {
            // Check permissions
            await Session.permissions(credentials, 'find');
            // Find documents, paginate and response
            return await Session.paginate({ author: credentials._id }, {
                ...query,
                select: 'jti device location ip',
                populate: [{ path: 'author', select: 'username picture id' }]
            });
        }
        catch (e) {
            return e;
        }
    }
};

// Delete one session
export const deleteOne = {
    validate: {
        failAction,
        params
    },
    handler: async ({
        auth: { credentials },
        params: { _id }
    }) => {
        try {
            // Find document
            const document = await Session.findById(_id);
            // Check if document equals active session
            if (document?.jti === credentials.jti) {
                return badRequest('Cannot delete active session');
            }

            // Check permissions
            await Session.permissions(credentials, 'delete', {
                document, credentials
            });
            // Delete session
            await Session.deleteOne({ _id });

            // Send response
            return { status: 'success' };
        }
        catch (e) {
            return e;
        }
    },
    response: {
        status: {
            200: Joi.object({
                status: Joi.string()
            }).label('Response session delete'),
            400: Joi.any()
        }
    }
};
