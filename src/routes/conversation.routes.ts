import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import * as conversationController from "../controllers/conversation.controller";

const router = Router();

router.use(authMiddleware);

// Create conversation (DM or group)
router.post("/", conversationController.createConversation);

// Get all conversations of user
router.get("/", conversationController.getUserConversations);

// Get single conversation + messages
router.get("/:id", conversationController.getConversationById);

export default router;