import Joi from 'joi';

export const headers = Joi.object({
    'authorization': Joi.string().required()
}).unknown();
