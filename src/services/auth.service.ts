import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { JWT_SECRET } from "../config/env";



export async function register(data: {
  email: string;
  username: string;
  password: string;
}) {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: data.email },
        { username: data.username },
      ],
    },
    select: {
      id: true,
    },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      username: data.username,
      passwordHash: hashedPassword,
      profile: {
        create: {
          displayName: data.username,
        },
      },
    },
    select: {
      id: true,
      email: true,
      username: true,
      isOnline: true,
      lastSeenAt: true,
      profile: {
        select: {
          id: true,
          displayName: true,
          bio: true,
          avatarId: true,
        },
      },
    },
  });

  const token = jwt.sign(
    { userId: user.id },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    user,
    token,
  };
}

export async function login(data: {
  emailOrUsername: string;
  password: string;
}) {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: data.emailOrUsername },
        { username: data.emailOrUsername },
      ],
    },
    select: {
      id: true,
      email: true,
      username: true,
      passwordHash: true,
      isOnline: true,
      lastSeenAt: true,
      profile: {
        select: {
          id: true,
          displayName: true,
          bio: true,
          avatarId: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValid = await bcrypt.compare(
    data.password,
    user.passwordHash
  );

  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { userId: user.id },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  const { passwordHash, ...safeUser } = user;

  return {
    user: safeUser,
    token,
  };
}

export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      isOnline: true,
      lastSeenAt: true,
      profile: {
        select: {
          id: true,
          displayName: true,
          bio: true,
          avatarId: true,
        },
      },
    },
  });
}