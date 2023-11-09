import { Router } from "express";

import { accountRouter } from "./account/account.router";
import { provinceRouter } from "./province/province.router";

export const apiRouter = Router();

apiRouter.use(accountRouter);
apiRouter.use(provinceRouter);
