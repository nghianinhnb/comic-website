import axios from "axios";
import jwt from "jsonwebtoken";

import { Account, Company } from "../../models";
import {UnauthorizedError, ERROR_WRONG_PASSWORD, BadRequestError, ConflictError, ERROR_ACCOUNT_EXIST} from "../../errors";
import {extractAccountAndCompanyInfo, extractAccountInfo} from '../../helpers';


export function sign(account) {
    return jwt.sign(account, process.env.JWT_KEY );
}


export async function getCurrentAccountAccessToken(accountId) {
    return await Account.findByPk(accountId, { attributes: ["accessToken"] });
}


export async function getMyAccount(accessToken) {
    const response = await axios.get(`${process.env.AUTH_SERVER_API_URL}/account/profile`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return extractAccountAndCompanyInfo(response.data.account);
}


export async function getStaffAccounts({accessToken, companyId, page, limit}) {
    const response = await axios.get(`${process.env.AUTH_SERVER_API_URL}/account/find`, {
        params: { companyId, page, limit },
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    return {
        ...response.data,
        accounts: response.data.accounts.map((account) => extractAccountInfo(account)),
    };
}


export async function singleSignIn({email, username, taxCode, password}) {
    try {
        const response = await axios.post(
            `${process.env.AUTH_SERVER_API_URL}/account/login`,
            { email, username, taxCode, password }
        );
        const { account } = response.data;

        account.companyId && await Company.upsert({ companyId: account.companyId });
        await Account.upsert({
            accountId: account.accountId,
            accessToken: account.accessToken,
            companyId: account.companyId,
        });

        return extractAccountAndCompanyInfo(account);
    } catch (error) {
        if (error.response?.status === 400)
            throw new UnauthorizedError(ERROR_WRONG_PASSWORD);
        throw error;
    }
}


export async function singleSignUp({email, password, taxCode, fullname, phone}) {
    try {
        await axios.post(`${process.env.AUTH_SERVER_API_URL}/account/register`,
            {email, password, taxCode, fullname, phone}
        );
    } catch (error) {
        if (error.response?.status === 400)
            throw new ConflictError(ERROR_ACCOUNT_EXIST);
        throw error;
    }
}


export async function createStaffAccount({email, username, password, taxCode, fullname, phone, accessToken}) {
    try {
        const response = await axios.post(`${process.env.AUTH_SERVER_API_URL}/account/create`,
            {email, companyUsername: username, password, taxCode, fullname, phone},
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        return extractAccountInfo(response.data.account);
    } catch (error) {
        if (error.response?.status === 400)
            throw new ConflictError(error.response?.data?.reason);
        throw error;
    }
}


export async function updateMyAccount({companyName, address, fullname, contactPersonEmail, contactPersonPhone, contactPersonPosition, personalIdentificationNumber, website, phone, accountNumber, bankName, contactPerson, accessToken}) {
    const response = await axios.put(`${process.env.AUTH_SERVER_API_URL}/account/update`,
        {   
            companyName, address, fullname, website, phone, accountNumber, bankName, contactPerson,
            contactPersonEmail, contactPersonPhone, contactPersonPosition, personalIdentificationNumber
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    return extractAccountAndCompanyInfo(response.data.account);
}


export async function updateStaffAccount({taxCode, username, password, fullname, accountId, accessToken}) {
    try {
        const response = await axios.put(
            `${process.env.AUTH_SERVER_API_URL}/account/update/${accountId}`,
            {taxCode, companyUsername: username, password, fullname, accessToken},
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        return extractAccountInfo(response.data.account);
    } catch (error) {
        const { status, data } = error.response;
        console.log({ status, data });
    }
}


export async function deleteStaffAccount({ accountIds, accessToken }) {
    await axios.post(`${process.env.AUTH_SERVER_API_URL}/account/remove-employees`,
        { accountIds },
        { headers: { Authorization: `Bearer ${accessToken}` } }
    );
}


export async function changeMyPassword({oldPassword, newPassword, accessToken}) {
    try {
        await axios.post(`${process.env.AUTH_SERVER_API_URL}/account/change-password`,
            { oldPassword, newPassword },
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
    } catch (error) {
        throw new BadRequestError([{ msg: error.response?.data?.reason }]);
    }
}


export async function logOut({ accessToken }) {
    try {
        await axios.post(
            `${process.env.AUTH_SERVER_API_URL}/account/logout`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        )
    } catch (error) {}
}
