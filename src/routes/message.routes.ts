import { Router } from "express";
import * as messageController from "../controllers/message.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, messageController.sendMessage);

router.get("/:conversationId", authMiddleware, messageController.getMessages);

router.delete("/:messageId", authMiddleware, messageController.deleteMessage);

export default router;