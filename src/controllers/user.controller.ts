import { Request, Response } from "express";
import * as userService from "../services/user.service";

export async function searchUsers(
  req: Request,
  res: Response
) {
  try {
    const currentUserId = req.user?.userId;

    if (!currentUserId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const query = String(req.query.q ?? "");

    const users = await userService.searchUsers(
      currentUserId,
      query
    );

    return res.json(users);
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
}