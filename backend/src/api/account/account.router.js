import { Router } from "express";

import {
    requireAuth,
    requireAtLeastManager,
    paginationValidator,
} from "../../middlewares";
import * as accountController from "./account.controller";
import * as accountValidator from "./account.validator";


export const accountRouter = Router();


accountRouter.get("/account/me", requireAuth, accountController.me);

accountRouter.put(
    "/account/me",
    requireAuth,
    requireAtLeastManager,
    accountValidator.updateMe,
    accountController.updateMe
);


// ------------------------------------------------------


accountRouter.post(
    "/sign-in",
    accountValidator.signIn,
    accountController.signIn,
);

accountRouter.post(
    "/sign-up",
    accountValidator.signUp,
    accountController.signUp,
);

accountRouter.post(
    "/change-password",
    requireAuth,
    requireAtLeastManager,
    accountValidator.changePassword,
    accountController.changePassword,
);

accountRouter.post(
    "/log-out",
    requireAuth,
    accountController.logOut,
);


// ------------------------------------------------------


accountRouter.get(
    "/account/staff",
    requireAuth,
    requireAtLeastManager,
    paginationValidator,
    accountController.staff,
);

accountRouter.post(
    "/account/staff",
    requireAuth,
    requireAtLeastManager,
    accountValidator.createStaff,
    accountController.createStaff,
);

accountRouter.put(
    "/account/staff/:accountId",
    requireAuth,
    requireAtLeastManager,
    accountValidator.updateStaff,
    accountController.updateStaff,
);

accountRouter.delete(
    "/account/staff",
    requireAuth,
    requireAtLeastManager,
    accountValidator.deleteStaff,
    accountController.deleteStaff,
);
