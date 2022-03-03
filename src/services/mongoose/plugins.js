import { notFound } from '@hapi/boom';
/*
* Example:
* Message.findById(_id)
*        .throwIfEmpty(message)   <---
*        .select('content author')
*        .lean();
* */
export const throwIfEmpty = (schema) => {
    schema.query.throwIfEmpty = function (message = 'Document not found') {
        const originalExec = this.exec;

        this.exec = () => {
            const applied = originalExec.apply(this);
            return applied.then((doc) => {
                if (!doc) {
                    throw notFound(message);
                }

                return doc;
            });
        };

        return this;
    };
};

