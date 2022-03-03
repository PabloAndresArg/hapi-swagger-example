import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { throwIfEmpty } from './plugins';

import { mongodb, pagination } from '~/config';

Object.keys(mongodb.options).forEach((key) => {
    mongoose.set(key, mongodb.options[key]);
});

mongoose.connection.on('error', (err) => {
    console.warn('MongoDB connection error: ' + err);
    process.exit(-1);
});

mongoose.connection.on('open', () => {
    console.log(
        `\x1b[32m[database] connected\x1b[0m`
    );
});

// Global plugins
// Set default pagination settings
mongoosePaginate.paginate.options = pagination;
mongoose.plugin(mongoosePaginate);
mongoose.plugin(throwIfEmpty);

export const Joigoose = require('joigoose')(mongoose, { convert: false });
export default mongoose;
