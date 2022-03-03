import { isEmpty } from 'lodash';
import { flatPick } from '~/utils/helper';
import Joi from 'joi';
export default [
    {
        method: 'GET',
        path: '/test/{message?}',
        options: {
            auth: false,
            description: 'Test api endpoint',
            notes: 'Returns a sign of life',
            tags: ['api'],
            plugins: {
                'hapi-rate-limitor': {
                    max: 5, // a maximum of 5 requests
                    duration: 5 * 1000, // 5 seconds
                    enabled: true
                }
            },
            handler: ({ params, plugins }, h) => {
                // Socket test
                h.socket.emit('test', isEmpty(params) ? 'success' : params);
                // h.socket.to('testroom').emit('room', 'hallo' );
                return {
                    status: 'live',
                    device: plugins.scooter.toAgent(),
                    time: new Date()
                };
            },
            response: {
                status: {
                    200: Joi.object({
                        status: Joi.string().required(),
                        device: Joi.string().required(),
                        time: Joi.date().timestamp().required()
                    }).label('Response Message findOne'),
                    400: Joi.any()
                }
            }
        }
    }
];
