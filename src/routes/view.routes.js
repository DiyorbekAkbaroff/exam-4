import { Router } from "express";
import viewController from "../controller/view.controller.js";

export const viewRouter = Router();

viewRouter.get("/", viewController.MAIN_PAGE);
viewRouter.get("/register", viewController.REGISTER_PAGE);
viewRouter.get("/login", viewController.LOGIN_PAGE);