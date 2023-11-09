import express from "express";
import "express-async-errors";
import cors from "cors";
import { resolve } from "path";

import { apiRouter } from "./api";
import { errorHandler } from "./middlewares";


const app = express().disable("x-powered-by");

// app.set("trust proxy", 1);

// Common Middlewares
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/resources", express.static(resolve("public")));

// Custom Middlewares
app.use("/api/v1", apiRouter);
app.use(errorHandler);

export { app };
