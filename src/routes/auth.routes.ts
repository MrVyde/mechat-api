import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { registerValidator, loginValidator } from "../middlewares/auth.validator";
import { validate } from "../middlewares/validate.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register",registerValidator,validate,authController.register);

router.post("/login",loginValidator,validate,authController.login);

router.post("/demo", authController.demoLogin);

router.get("/me", authMiddleware, authController.me);

router.post("/logout", authController.logout);

export default router;