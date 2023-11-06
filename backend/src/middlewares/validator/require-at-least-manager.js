import {ForbiddenError} from '../../errors'


export function requireAtLeastManager(req, res, next) {
    if (!req.user.isManager && !req.user.isAdmin) throw new ForbiddenError();

    next();
}
