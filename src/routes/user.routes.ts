import { Router } from "express";

import * as userController from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get(
  "/search",
  authMiddleware,
  userController.searchUsers
);

export default router;