import { prisma } from "../lib/prisma";

export async function setOnline(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      isOnline: true,
    },
  });
}

export async function setOffline(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      isOnline: false,
      lastSeenAt: new Date(),
    },
  });
}