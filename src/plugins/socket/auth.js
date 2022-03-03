import JWT from 'jsonwebtoken';
import { validate } from '~/plugins/auth/handler';
import { jwt } from '~/config';

/*
* Put token to query socket
* { "query":{ "token":"jwt token" } }
* */
const jwtAuth = async (socket, callback) => {
    try {
        const { _query } = socket;
        // TODO: Should get header thoken from client
        const decode = JWT.decode(_query?.token, jwt.secret);
        // Validate User
        await validate(decode);
        /*
        * pass auth information's to socket
        * instance and call it with "socket.request.auth"
        * */
        socket.auth = decode;
        callback(null, true);
    }
    catch (e) {
        callback(null, false);
        return e;
    }
};

export default jwtAuth;
