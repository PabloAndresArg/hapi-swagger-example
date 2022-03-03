import Joi from 'joi';
import slugify from 'slugify';
import argon2 from 'argon2';
import mongoose, { Schema } from 'mongoose';
import mongooseKeywords from 'mongoose-keywords';
import { badRequest } from '@hapi/boom';

import { Joigoose } from '~/services/mongoose';
import { checkPermissions } from '~/plugins/auth/mongoose';
import acl from './acl';
import userStatics from './statics';

export const validationSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),
    email: Joi.string()
        .email()
        .meta({
            _mongoose: { unique: true }
        }),
    picture: Joi.string()
        .meta({
            _mongoose: { trim: true }
        }),
    role: Joi.string()
        .default('user'),
    lang: Joi.string()
        .default('en'),
    active: Joi.boolean()
        .default(true),
    verified: Joi.boolean()
        .default(false),
    services: Joi.object({
        facebook: Joi.string(),
        github: Joi.string(),
        google: Joi.string()
    })
}).label('User');

export const userSchema = new Schema(
    Joigoose.convert(validationSchema),
    { timestamps: true,
        toObject: {
            virtuals: true
        },
        versionKey: false
    }
);

userSchema.path('email').set(function (email) {
    // Set Name
    if (!this.name) {
        this.name = email.replace(/^(.+)@.+$/, '$1');
    }

    // Set Username
    if (!this.username) {
        this.username = slugify(
            this.name, {
                lower: true, remove: /[*+~.()'"!:@]/g
            });
    }

    if (!this.picture) {
        this.picture = `https://avatars.dicebear.com/api/human/${this.name}.svg`;
    }

    return email;
});

// Create Password Hash
userSchema.pre(
    'save',
    async function (next) {
        if (!this.isModified('password')) {
            next();
        }

        this.password = await argon2.hash(this.password);
        next();
    }
);

// Create unique username
userSchema.pre(
    'save',
    async function (next) {
        if (!this.isModified('username')) {
            next();
        }

        // Username
        let n = null;
        while (await model.exists({
            username: n ? this.username + n : this.username
        })) {
            n++;
        }

        this.username = n ? this.username + n : this.username;
        next();
    }
);

userSchema.methods.comparePassword = function (hashedPassword, next) {
    argon2.verify(hashedPassword, this.password, (err, isMatch) => {
        if (err) {
            return next(err);
        }

        next(null, isMatch);
    });
};

userSchema.plugin(checkPermissions, acl);
userSchema.plugin(userStatics);
userSchema.plugin(mongooseKeywords, {
    paths: ['username', 'email'] });

// Build Mpdel
const model = mongoose.model('User', userSchema);

export const mailLookup = async (email) => {
    const user = await model.exists({ email });
    if (user) {
        throw badRequest('MAIL_EXISTS');
    }
};

export default model;
