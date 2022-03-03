import Inert from '@hapi/inert';
import Vision from '@hapi/vision';
import Scooter from '@hapi/scooter';

import Logger from './logger';
import Auth from './auth';
import Socket from './socket';
import RateLimiter from './ratelimiter';
import Email from './email';
import { swagger, i18n } from '~/config';

export default [
    Inert,
    Vision,
    Logger,
    Scooter,
    RateLimiter,
    Email,
    {
        plugin: require('hapi-swagger'),
        options: swagger
    },
    {
        plugin: require('hapi-i18n'),
        options: i18n
    },
    ...Auth,
    Socket
];
