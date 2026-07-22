import { prisma } from "../lib/prisma";


const safeUserSelect = {
  id: true,
  username: true,
  profile: {
    select: {
      displayName: true,
      avatarId: true,
    },
  },
} as const;

/**
 * SEND MESSAGE
 */
export async function sendMessage(
  data: {
    conversationId: string;
    senderId: string;
    content?: string;
    mediaIds?: string[];
  },
  io?: any
) {
  const message = await prisma.message.create({
    data: {
      conversation: {
        connect: { id: data.conversationId },
      },
      sender: {
        connect: { id: data.senderId },
      },
      content: data.content,

      media: data.mediaIds?.length
        ? {
            create: data.mediaIds.map((id) => ({
              mediaId: id,
            })),
          }
        : undefined,
    },

    select: {
      id: true,
      content: true,
      createdAt: true,
      conversationId: true,
      senderId: true,

      sender: {
        select: safeUserSelect,
      },

      media: {
        select: {
          id: true,
          media: {
            select: {
              id: true,
              url: true,
              type: true,
            },
          },
        },
      },
    },
  });

  io?.to(data.conversationId).emit("message:new", message);

  return message;
}

/**
 * GET MESSAGES
 */
export async function getMessages(conversationId: string) {
  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },

    select: {
      id: true,
      content: true,
      createdAt: true,
      conversationId: true,
      senderId: true,
      deleted: true,

      sender: {
        select: safeUserSelect,
      },

      media: {
        select: {
          id: true,
          media: {
            select: {
              id: true,
              url: true,
              type: true,
            },
          },
        },
      },

      reactions: {
        select: {
          id: true,
          emoji: true,
          userId: true,
        },
      },

      readReceipts: {
        select: {
          id: true,
          userId: true,
          readAt: true,
        },
      },
    },
  });
}

/**
 * DELETE MESSAGE (soft delete)
 */
export async function deleteMessage(messageId: string, userId: string) {
  const message = await prisma.message.findUnique({
    where: { id: messageId },
    select: {
      id: true,
      senderId: true,
    },
  });

  if (!message) {
    throw new Error("Message not found");
  }

  if (message.senderId !== userId) {
    throw new Error("Not allowed");
  }

  return prisma.message.update({
    where: { id: messageId },
    data: {
      deleted: true,
    },
    select: {
      id: true,
      deleted: true,
    },
  });
}