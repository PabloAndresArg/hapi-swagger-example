import { generatePassword, sendWelcome } from '~/plugins/auth';
import { appUrl } from '~/config';

const userStatics = (schema) => {
    schema.statics.createFromService =
        async function ({ service, id, email, name, picture, lang }) {
            const user = await this.findOne({
                $or: [{ [`services.${service}`]: id }, { email }]
            });

            if (user) {
                user.services[service] = id;
                // user.name = name
                // user.picture = picture
                // user.verified = true
                return user.save();
            }

            const password = generatePassword();
            return await this.create({
                services: { [service]: id },
                email,
                password,
                name,
                picture,
                lang,
                verified: true
            });

            // Send welcome mail
            /*
            await sendWelcome({
                To: email,
                TemplateModel: {
                    action_url: `${appUrl}/auth/login`, name
                }
            });
            */
        };
};

export default userStatics;
