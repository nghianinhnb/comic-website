import {ForbiddenError} from '../../errors'


export function requireAdmin(req, res, next) {
    if (!req.user.isAdmin) throw new ForbiddenError();

    next();
}
