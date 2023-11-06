import { format } from "sql-formatter";


export class QueryBuilder {
    #query = {
        where: {},
        order: [],
    };

    constructor(model, as) {
        if (model) {
            this.#query.model = model
            if (as) this.#query.as = as
        }
    }

    toQuery(options) {
        return {
            ...this.#query,
            ...options,
        };
    }

    select(options) {
        this.#query.attributes = options
        return this
    }

    include(options) {
        this.#query.include = options.filter(o => o)
        return this
    }

    where(field, op, value) {
        if (value !== undefined) {
            this.#query.where[field] = {[op]: value}
        } else if (op !== undefined) {
            this.#query.where[field] = op;
        }
        return this;
    }

    order(field, value) {
        if (value) this.#query.order.push([field, value])
        return this;
    }

    paginate({page, limit}) {
        this.#query.offset = page * limit
        this.#query.limit = limit
        return this
    }

    log() {
        this.#query.logging = logSql
        return this
    }
}


// ---------------------------------------------------


export function logSql(msg) {
    console.log(format(msg.split(':').at(1), {
        language: 'sql',
        tabWidth: 4,
        logicalOperatorNewline: 'before',
        linesBetweenQueries: 2,
    }));
}
