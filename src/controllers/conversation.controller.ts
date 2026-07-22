import { Request, Response } from "express";
import * as conversationService from "../services/conversation.service";

type ConversationParams = {
  id: string;
};

export async function createConversation(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const conversation = await conversationService.createConversation({
      ...req.body,
      userId,
    });

    return res.status(201).json(conversation);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
}

export async function getUserConversations(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const conversations =
      await conversationService.getUserConversations(userId);

    return res.json(conversations);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
}

export async function getConversationById(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params as ConversationParams;

    const conversation =
      await conversationService.getConversationById(id, userId);

    return res.json(conversation);
  } catch (err: any) {
    return res.status(404).json({ message: err.message });
  }
}