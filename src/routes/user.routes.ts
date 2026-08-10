import { Router } from "express";

import * as userController from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import {updateProfileValidator} from "../middlewares/user.validator";
import { validate } from "../middlewares/validate.middleware";


const router = Router();

router.get(
  "/search",
  authMiddleware,
  userController.searchUsers
);

router.patch(
  "/profile",
  authMiddleware,
  updateProfileValidator,
  validate,
  userController.updateProfile
);

export default router;