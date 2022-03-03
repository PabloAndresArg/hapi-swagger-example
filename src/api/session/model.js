import Joi from 'joi';
import mongoose, { Schema } from 'mongoose';
import { Joigoose } from '~/services/mongoose';
import { checkPermissions } from '~/plugins/auth/mongoose';
import { jwt } from '~/config';
import acl from './acl';
import sessionStatics from './statics';

export const validationSchema = Joi.object({
    jti: Joi.string()
        .required()
        .description('The jti of the jwt session object'),
    ip: Joi.string()
        .required()
        .description('The ip of the session'),
    author: Joi.string().meta({
        _mongoose: { type: 'ObjectId', ref: 'User' }
    }),
    location: Joi.object({
        country: Joi.string(),
        region: Joi.string(),
        city: Joi.string(),
        timezone: Joi.string()
    }),
    device: Joi.object()
        .description('The device informations'),
    createdAt: Joi.date()
        .meta({
            _mongoose: { expires: jwt.expiresIn }
        })

}).label('Message');


export const sessionSchema = new Schema(
    Joigoose.convert(validationSchema),
    {
        toObject: { virtuals: true },
        timestamps: true,
        versionKey: false
    }
);

// Plugins
sessionSchema.plugin(checkPermissions, acl);
sessionSchema.plugin(sessionStatics);

const model = mongoose.model('Session', sessionSchema);
export default model;
