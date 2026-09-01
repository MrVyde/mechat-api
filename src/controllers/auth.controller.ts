import { Request, Response } from "express";
import * as authService from "../services/auth.service";

export async function register(req: Request, res: Response) {
  try {
    const result = await authService.register(req.body);
    res.cookie("accessToken", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      user: result.user,
    });

  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const result = await authService.login(req.body);

    res.cookie("accessToken", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      user: result.user,
    });

  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
}

export async function demoLogin(req: Request, res: Response ) {
  try {
    const result = await authService.demoLogin();

    res.cookie("accessToken", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      user: result.user,
    });
  } catch (err: any) {
    return res.status(500).json({
      message: err.message,
    });
  }
}

export async function me(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await authService.getUserById(userId);

    return res.json(user);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
}

export async function logout(req: Request, res: Response) {

    res.clearCookie("accessToken");

    return res.json({
        message: "Logged out",
    });

}