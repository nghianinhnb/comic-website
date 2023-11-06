import * as accountService from "./account.service";


export async function me(req, res) {
    const { accessToken } = await accountService.getCurrentAccountAccessToken(req.user.accountId);
    const me = await accountService.getMyAccount(accessToken);
    res.send(me);
}


export async function staff(req, res) {
    const { accessToken } = await accountService.getCurrentAccountAccessToken(req.user.accountId);
    const result = await accountService.getStaffAccounts({ ...req.query, ...req.user, accessToken });
    res.send(result);
}


export async function signIn(req, res) {
    const signInResponse = await accountService.singleSignIn(req.body);
    const accessToken = accountService.sign(signInResponse.account);
    res.send({ ...signInResponse, accessToken });
}


export async function signUp(req, res) {
    await accountService.singleSignUp({ ...req.body });
    res.status(201).end();
}


export async function changePassword(req, res) {
    const { accessToken } = await accountService.getCurrentAccountAccessToken(req.user.accountId);
    await accountService.changeMyPassword({ ...req.body, accessToken });
    res.status(204).end();
}


export async function createStaff(req, res) {
    const { accessToken } = await accountService.getCurrentAccountAccessToken(req.user.accountId);
    const account = await accountService.createStaffAccount({ ...req.body, accessToken });
    res.status(201).send(account);
}


export async function updateMe(req, res) {
    const { accessToken } = await accountService.getCurrentAccountAccessToken(req.user.accountId);
    const account = await accountService.updateMyAccount({ ...req.body, accessToken });
    res.send(account);
}


export async function updateStaff(req, res) {
    const { accessToken } = await accountService.getCurrentAccountAccessToken(req.user.accountId);
    const account = await accountService.updateStaffAccount({ ...req.body, ...req.params, accessToken });
    res.send(account);
}


export async function deleteStaff(req, res) {
    const { accessToken } = await accountService.getCurrentAccountAccessToken(req.user.accountId);
    await accountService.deleteStaffAccount({ ...req.body, accessToken });
    res.status(204).end();
}


export async function logOut(req, res) {
    const { accessToken } = await accountService.getCurrentAccountAccessToken(req.user.accountId);
    await accountService.logOut({ accessToken });
    res.status(204).end();
}
