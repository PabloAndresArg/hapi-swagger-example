import Joi from 'joi';
import mongoose, { Schema } from 'mongoose';
import { Joigoose } from '~/services/mongoose';
import { checkPermissions } from '~/plugins/auth/mongoose';
import acl from './acl';

export const validationSchema = Joi.object({
    content: Joi.string()
        .required()
        .description('The content of the message object'),
    author: Joi.string().meta({
        _mongoose: { type: 'ObjectId', ref: 'User' }
    })
}).label('Message');

export const messageSchema = new Schema(
    Joigoose.convert(validationSchema),
    {
        toObject: { virtuals: true },
        timestamps: true,
        versionKey: false
    }
);

// Plugins
messageSchema.plugin(checkPermissions, acl);
const model = mongoose.model('Message', messageSchema);
export default model;
