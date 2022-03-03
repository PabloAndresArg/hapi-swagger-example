import JWT from 'jsonwebtoken';
import requestIp from 'request-ip';
import geoip from 'geoip-lite';
import Joi from 'joi';
import argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import { badRequest, unauthorized } from '@hapi/boom';

import { jwt } from '~/config';
import User from '~/api/user/model';
import Session from '~/api/session/model';

export const verifyPassword = (hashedPw, pw) =>
    new Promise(async (resolve, reject) => {
        await argon2.verify(hashedPw, pw) ?
            resolve() :
            reject(new Error('Password wrong'));
    });

const sign = (obj) => JWT.sign(obj, jwt.secret, {
    expiresIn: jwt.expiresIn,
    jwtid: uuidv4()
});

// Validate user - (decoded, request, h)
export const validate = async function ({ _id, jti }) {
    try {
        return {
            isValid:
                await User.exists({ _id }) &&
                await Session.exists({ jti })
        };
    }
    catch (e) {
        throw unauthorized();
    }
};

// Controller
export const auth = {
    validate: {
        payload: Joi.object({
            email: Joi
                .string()
                .email()
                .required()
                .description('Users E-Mail address'),
            password: Joi
                .string()
                .regex(/^[a-zA-Z0-9]{3,30}$/)
                .required()
                .error(new Error('Password based on RegExp pattern ' +
                    'and must comply with the password guidelines'))
                .description('Password based on RegExp pattern')
        }).label('LocalAuth'),
        failAction: (request, h, err) => {
            throw err;
        }
    },
    handler: async (request, h) => {
        const { payload, plugins: { scooter } } = request;
        const ip = requestIp.getClientIp(request);
        const location = await geoip.lookup('79.239.195.209');
        const device = scooter.toAgent();
        try {
            const {
                _id,
                role,
                password
            } = await User.findOne({ email: payload.email } );
            await verifyPassword(password, payload.password);
            const token = await sign({ _id, role });
            const tokenInformation = await JWT.decode(token);
            // Create and delete old sessions
            await Session.create({
                jti: tokenInformation.jti,
                author: _id,
                ip,
                device,
                location
            });
            await Session.truncateSessions({
                author: _id,
                maxSessionCount: jwt.maxSessionCount
            });

            return { _id, token, role };
        }
        catch (err) {
            console.log(err);
            return badRequest('invalid credentials');
        }
    },
    response: {
        status: {
            200: Joi.object({
                token: Joi.string().required(),
                role: Joi.string().required(),
                _id: Joi.any().required()
            }).label('LocalAuth response'),
            400: Joi.any()
        }
    }
};
