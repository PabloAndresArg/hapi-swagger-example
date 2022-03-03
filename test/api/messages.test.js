import Lab from '@hapi/lab';
import { expect } from '@hapi/code';
import server from '~/app';

const { describe, it } = exports.lab = Lab.script();

describe('GET /messages', () => {
    it('Response with 400', async () => {
        // Request
        const { statusCode, result } = await server.inject({
            url: '/messages'
        });
        // Expectations
        expect(statusCode).to.equal(400);
    });
});

/*
describe('GET /messages', () => {
    it('Response with 400', async () => {
        // Request
        const { statusCode, result } = await server.inject({
            url: '/messages'
        });
        // Expectations
        expect(result).to.be.instanceof(Array);
        expect(statusCode).to.equal(200);

        // Payload
        expect(result[0].content).to.equal('message');
    });
});
*/
