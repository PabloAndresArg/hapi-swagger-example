import requestIp from 'request-ip';
import { RateLimiterMongo } from 'rate-limiter-flexible';
import { tooManyRequests } from '@hapi/boom';

import mongoose from '~/services/mongoose';

import { rateLimiter } from '~/config';


const opts = {
    storeClient: mongoose?.connection,
    ...rateLimiter
};


const rateLimiterMongo = new RateLimiterMongo(opts);

export default {
    name: 'ratelimiter',
    version: '1.0.0',
    register: (server) => {
        server.ext('onRequest', async (request, h) => {
            try {
                const clientIp = requestIp.getClientIp(request);
                await rateLimiterMongo.consume(clientIp);

                return h.continue;
            }
            catch (e) {
                return tooManyRequests('you have exceeded your request limit');
            }
        });
    }
};

