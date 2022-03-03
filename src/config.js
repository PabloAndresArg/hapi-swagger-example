import 'dotenv/config';
import { requireEnv } from '~/utils';

const config = {
    all: {
        env: process.env.NODE_ENV || 'development',
        host: process.env.HOST || 'localhost',
        port: process.env.PORT || 3000,
        jwt: {
            secret: requireEnv('JWT_SECRET'),
            expiresIn: '8d',
            maxSessionCount: 5
        },
        i18n: {
            locales: ['en', 'de'],
            directory: __dirname + '/locales',
            languageHeaderField: 'accept-language',
            objectNotation: true
        },
        mail: {
            token: process.env.MAILER_TOKEN || 'mailerToken'
        },
        // Doc: https://github.com/glennjones/hapi-swagger/blob/master/usageguide.md
        swagger: {
            info: {
                title: 'Test API Documentation',
                contact: {
                    name: 'Tayfun Gülcan',
                    email: 'mail@tayfunguelcan.de'
                }
            },
            tags: [
                {
                    name: 'auth',
                    description: 'JWT based authentication functionality.'
                }
            ]
        },
        pagination: {
            customLabels: {
                docs: 'rows',
                limit: false,
                pagingCounter: false,
                meta: false,
                hasPrevPage: false,
                hasNextPage: false
            }
        },
        mongodb: {
            uri: process.env.MONGO_URI || 'mongodb://localhost:27017/myhapi',
            options: {
                useCreateIndex: true,
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: true
            }
        }
    },
    test: {
        rateLimiter: {
            points: 50,
            duration: 2 // Per second(s)
        }
    },
    development: {
        rateLimiter: {
            points: 50,
            duration: 5 // Per second(s)
        }
    },
    production: {
        rateLimiter: {
            points: 50,
            duration: 60 // Per second(s)
        }
    }
};

// Export part
const mergedConf = Object.assign(config.all, config[config.all.env]);
for (const [key, value] of Object.entries(mergedConf)) {
    module.exports[key] = value;
}

export default mergedConf;

