import jwt from "jsonwebtoken";

import { Account } from "../../models";

export function sign(account) {
    return jwt.sign(account, process.env.JWT_KEY );
}


export async function getCurrentAccountAccessToken(accountId) {
    return await Account.findByPk(accountId, { attributes: ["accessToken"] });
}
