import { Client } from 'postmark';
import { mail } from '~/config';

const client = new Client(mail.token);

export const sendWelcome = ({ To }) =>
    client.sendEmailWithTemplate({
        From: 'no-reply@sobmit.com',
        To,
        TemplateModel: {
            product_name: 'cirkuz',
            login_url: `google.de/auth/login`,
            username: To,
            support_email: 'support@cirkuz.com'
        },
        TemplateId: 20176245
    });

const plugin = {
    name: 'email',
    version: '1.0.0',
    register: (server) => {
        server.events.on('start', async () => {
            // const { info } = server;
            // console.log('email service');
            // await sendWelcome({ To: 'tayfunmobile@googlemail.com' });
        });
    }
};

export default plugin;
