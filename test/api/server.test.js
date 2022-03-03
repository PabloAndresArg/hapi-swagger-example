import Lab from '@hapi/lab';
import { expect } from '@hapi/code';
import server from '~/app';
const { describe, it, before } = exports.lab = Lab.script();

// Server test
describe('Ensure that the server exists', () => {
    before(() => {
        // Prevent ratelimiter errors and set countdown
        expect(server.info.host).to.equal('localhost');
        // Plugins loaded
        expect(Boolean(server.registrations['hapi-swagger']))
            .to.equal(true);
        expect(Boolean(server.registrations.ratelimiter))
            .to.equal(true);
        expect(Boolean(server.registrations['hapi-i18n']))
            .to.equal(true);
    });
    it('Try to get Server information', () => {
        expect(server).to.exist();
    });
});

// Root route
describe('GET /', () => {
    it('Response with 404', async () => {
        // Request
        const { statusCode, result } = await server.inject({
            url: '/'
        });
        // Expectations
        expect(result).to.be.instanceof(Object);
        expect(statusCode).to.equal(404);
        // Payload
        expect(result.error).to.equal('Not Found');
        expect(result.message).to.equal('Not Found');
    });
});

// Initial test route
describe('GET /test', () => {
    it('Response with 200', async () => {
        // Request
        const { statusCode, result } = await server.inject({
            url: '/test'
        });
        // Expectations
        expect(result).to.be.instanceof(Object);
        expect(statusCode).to.equal(200);

        // Payload
        expect(result.status).to.equal('live');
    });
});

