import jwt from 'jsonwebtoken';

import {UnauthorizedError} from '../../errors'


export function requireAuth(req, res, next) {
    const token = req.headers.authorization?.split(' ').at(1);

    if (!token) throw new UnauthorizedError();

    try {
        const userPayload = jwt.verify(
            token,
            process.env.JWT_KEY,
            { maxAge: 3600 }
        )

        if (userPayload.iat * 1000 > Date.now()) throw new UnauthorizedError();

        req.user = userPayload;

    } catch (err) {
        throw new UnauthorizedError();
    }

    next();
}
