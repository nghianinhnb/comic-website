import { Router } from "express";

import * as companyController from "./company.controller";
import * as companyValidator from "./company.validator";
import { requireAtLeastManager, requireAuth } from "../../middlewares";


export const companyRouter = Router();


companyRouter.get("/company/:companyId",
    requireAuth,
    companyValidator.getById,
    companyController.getById,
);


companyRouter.put("/company",
    requireAuth,
    requireAtLeastManager,
    companyValidator.update,
    companyController.update,
);

companyRouter.post("/company/create-instance",
    companyController.createInstanceTable,
);

