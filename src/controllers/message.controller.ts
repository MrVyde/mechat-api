import { Request, Response } from "express";
import * as messageService from "../services/message.service";
import { GetMessagesParams, DeleteMessageParams } from "../types/message.types";

export async function sendMessage(req: Request, res: Response) {
  try {
    const io = req.app.get("io");

    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const message = await messageService.sendMessage(
        {
      ...req.body,
      senderId: userId,
    },
      io
    );

    return res.status(201).json(message);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
}

export async function getMessages(req: Request, res: Response) {
  try {
    const { conversationId } = req.params as unknown as GetMessagesParams;

    const messages = await messageService.getMessages(conversationId);

    return res.json(messages);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
}

export async function deleteMessage(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { messageId } = req.params as unknown as DeleteMessageParams;

    const result = await messageService.deleteMessage(messageId, userId);

    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
}