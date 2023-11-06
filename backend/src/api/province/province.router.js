import { Router } from "express";

import * as provinceController from "./province.controller";
import { requireAdmin, requireAuth } from "../../middlewares";


export const provinceRouter = Router();


provinceRouter.get("/province",
    provinceController.all,
);


provinceRouter.post("/province",
    requireAuth,
    requireAdmin,
    provinceController.create,
);


provinceRouter.put("/province",
    requireAuth,
    requireAdmin,
    provinceController.update,
);
