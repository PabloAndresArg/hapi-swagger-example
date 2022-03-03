import Joi from 'joi';
import { flatPick, failAction } from '~/utils';
import User, { mailLookup, validationSchema } from './model';
import { headers } from '~/plugins/auth';

// List all user
export const find = {
    validate: ({
        headers,
        failAction
    }),
    handler: async ({ auth: { credentials } }) => {
        await User.permissions(credentials, 'find');
        return await User.find({}).select('email picture username');
    }
};

// Find a user
export const findOne = {
    validate: ({
        headers,
        failAction
    }),
    handler: async ({ params: { _id }, auth: { credentials } }) => {
        try {
            await User.permissions(credentials, 'findMe');
            return await User.findById(_id)
                .select('email picture username')
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
                email: Joi.string().required(),
                picture: Joi.string().required(),
                username: Joi.string().required()
            }).label('Response User findOne'),
            400: Joi.any()
        }
    }
};

// Create a user
export const create = {
    validate: {
        payload: validationSchema.concat(
            Joi.object({
                email: Joi.string().external(mailLookup),
                // Exclude if user try to put keys in body
                // username: Joi.string().strip(),
                role: Joi.string().meta({ swaggerHidden: false }).strip(),
                lang: Joi.string().meta({ swaggerHidden: false }).strip(),
                picture: Joi.string().meta({ swaggerHidden: false }).strip(),
                active: Joi.boolean().meta({ swaggerHidden: false }).strip(),
                verified: Joi.boolean().meta({ swaggerHidden: false }).strip(),
                services: Joi.object().meta({ swaggerHidden: false }).strip()
            })
        ),
        failAction
    },
    handler: async ({ payload }) => {
        console.log(payload);
        try {
            const user = await User.create(payload);
            return flatPick(user, ['_id', 'email', 'username', 'picture']);
        }
        catch (e) {
            return e;
        }
    },
    response: {
        status: {
            200: Joi.object({
                _id: Joi.any().required(),
                email: Joi.string(),
                picture: Joi.string(),
                username: Joi.string()
            }).label('Response User create'),
            400: Joi.any()
        }
    }
};
