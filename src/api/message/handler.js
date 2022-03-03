import Joi from 'joi';

import Message, { validationSchema } from './model';
import { headers } from '~/plugins/auth';
import { flatPick, failAction, pagination, params } from '~/utils';


// List all user
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
        // Check permissions
        await Message.permissions(credentials, 'find');
        // Find documents and paginate
        return await Message.paginate({}, {
            ...query,
            select: 'content author',
            populate: [{ path: 'author', select: 'username picture id' }]
        });
    }
};

// Find a user
export const findOne = {
    validate: ({
        headers,
        failAction,
        params
    }),
    handler: async ({ params: { _id }, auth: { credentials } }) => {
        try {
            // Check permissions
            await Message.permissions(credentials, 'findOne');
            // Find document by id
            return await Message.findById(_id)
                .throwIfEmpty()
                .select('content author')
                .lean();
        }
        catch (e) {
            return e;
        }
    },
    response: {
        status: {
            200: Joi.object({
                _id: Joi.any().required(),
                author: Joi.object().required(),
                content: Joi.string().required()
            }).label('Response Message findOne'),
            400: Joi.any()
        },
        failAction
    }
};

export const create = {
    validate: {
        payload: validationSchema,
        failAction
    },
    handler: async ({ auth: { credentials }, payload }) => {
        try {
            // Assign author to document
            payload.author = credentials;
            // Check permissions
            await Message.permissions(credentials, 'create');
            // Create document
            const message = await Message.create(payload);
            // Response document
            return flatPick(message, ['_id', 'author', 'content']);
        }
        catch (e) {
            return e;
        }
    },
    response: {
        status: {
            200: Joi.object({
                _id: Joi.any().required(),
                author: Joi.object(),
                content: Joi.string()
            }).label('Response Message create'),
            400: Joi.any()
        }
    }
};

export const update = {
    validate: {
        payload: validationSchema,
        failAction,
        params
    },
    handler: async ({
        auth: { credentials },
        params: { _id },
        payload
    }) => {
        try {
            // Find document
            const document = await Message.findById(_id);
            // Check permissions
            await Message.permissions(credentials, 'update', {
                document,
                credentials
            });
            // Update document
            const message = await Message.findOneAndUpdate({
                _id
            }, payload, { new: true });
            // Response document
            return flatPick(message, ['_id', 'author', 'content']);
        }
        catch (e) {
            return e;
        }
    },
    response: {
        status: {
            200: Joi.object({
                _id: Joi.any().required(),
                author: Joi.object(),
                content: Joi.string()
            }).label('Response Message update'),
            400: Joi.any()
        }
    }
};

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
            const document = await Message.findById(_id);
            // Check permissions
            await Message.permissions(credentials, 'update', {
                document,
                credentials
            });
            // Delete document
            await Message.findOneAndDelete({
                _id
            });
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
            }).label('Response Message delete'),
            400: Joi.any()
        }
    }
};
