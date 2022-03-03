const Babel = require('@babel/core');

const internals = {};
internals.transform = function (content, filename) {
    if (/^node_modules/.test(filename)) {
        return content;
    }

    const transformed = Babel.transform(content, {
        filename,
        sourceMap: 'inline',
        sourceFileName: filename,
        auxiliaryCommentBefore: '$lab:coverage:off$',
        auxiliaryCommentAfter: '$lab:coverage:on$'
    });

    return transformed.code;
};

internals.extensions = ['js', 'jsx', 'es', 'es6'];
internals.methods = [];

const il = internals.extensions.length;
for (let i = 0; i < il; ++i) {
    internals.methods.push({
        ext: internals.extensions[i],
        transform: internals.transform
    });
}

module.exports = internals.methods;
