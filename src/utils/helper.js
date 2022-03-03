import { last, get, set, isArray, forEach } from 'lodash';
import { badRequest } from '@hapi/boom';
import Joi from 'joi';

/*
 * flatPick uses the pick function
 * and distinguishes between array and object.
 * @param {object} json Object
 * @param {paths} selected keys
 * @return {object} - filtered object
 * */
const pick = (object, paths) => {
    const item = {};

    paths.forEach((path) => set(
        item,
        last(path.split('.')),
        get(object, path)
    ));

    return item;
};

export const params = Joi.object({
    _id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/, 'ObjectId')
});

export const flatPick = (object, paths) => {
    if (isArray(object)) {
        forEach(object, (item, key) => {
            object[key] = pick(item, paths);
        });
    }
    else {
        object = pick(object, paths);
    }

    return object;
};

// Global validation fail function
export const failAction = ({ i18n }, h, err) => {
    const { output, details } = err;


    // Turn to i18n payload
    if (output?.payload) {
        output.payload.message =
            i18n.__(`validation.${output.payload.message}`);
    }

    if (details) {
        h.logger({ content: details });
        return badRequest('response validation');
    }

    return err;
};

export const pagination = Joi.object({
    page: Joi.number().integer().min(1).max(100).default(1),
    limit: Joi.number().integer().min(1).max(10).default(5),
    sort: Joi.string().default('-createdAt')
}).options({ stripUnknown: true });

// Add author to payload middleware
export const addAuthor = {
    method: ({ auth: { credentials }, payload }, h) => {
        // Ignore middleware if no credential set
        if (!credentials) {
            return h.continue;
        }

        // Add author to payload
        payload.author = credentials._id;
        return h.continue;
    }
};
