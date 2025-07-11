import { Router } from "express";
import { authRouter } from "./auth.routes.js";

export const mainRouter = Router();

mainRouter.use("/auth", authRouter)