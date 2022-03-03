import Lab from '@hapi/lab';
import { expect } from '@hapi/code';
import server from '~/app';
import { connect } from '../utils/database';

const { describe, it, before, beforeAll } = exports.lab = Lab.script();

describe('GET /users', () => {
    it('Response with 400', async () => {
        // Request
        const { statusCode, result } = await server.inject({
            url: '/users'
        });
        // Expectations
        expect(statusCode).to.equal(401);
    });
});

describe('POST /users', () => {
    before(async () => {
        await connect();
        const { statusCode, result } = await server.inject({
            method: 'POST',
            url: '/users',
            payload: {
                email: 'test3@test.com',
                password: 'Melissa123'
            }
        });
        expect(statusCode).to.equal(200);
    });
    it('Response with 400', () => {
        console.log('yooo');
    });
});
