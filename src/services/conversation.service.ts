import { prisma } from "../lib/prisma";

/** Reusable safe user shape (inline concept, not constant) */
const safeUserSelect = {
  id: true,
  username: true,
  profile: {
    select: {
      displayName: true,
      avatarId: true,
      bio: true,
    },
  },
} as const;

/** Safe message sender shape */
const safeSenderSelect = {
  id: true,
  username: true,
  profile: {
    select: {
      displayName: true,
      avatarId: true,
    },
  },
} as const;

/** Shared shape used for conversation creation return */
const conversationSelect = {
  id: true,
  type: true,
  name: true,
  description: true,
  createdAt: true,

  participants: {
    select: {
      role: true,
      user: {
        select: safeUserSelect,
      },
    },
  },
} as const;

/** Create conversation (DIRECT or GROUP) */
export async function createConversation(data: {
  type: "DIRECT" | "GROUP";
  userId: string;
  participantIds: string[];
  name?: string;
  description?: string;
}) {
  const allParticipants = Array.from(
    new Set([data.userId, ...data.participantIds])
  );

  // DIRECT chat rule
  if (data.type === "DIRECT") {
    if (allParticipants.length !== 2) {
      throw new Error("Direct chat must have exactly 2 users");
    }

    const existing = await prisma.conversation.findFirst({
      where: {
        type: "DIRECT",
        participants: {
          every: {
            userId: { in: allParticipants },
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (existing) {
      return prisma.conversation.findUnique({
        where: { id: existing.id },
        select: conversationSelect,
      });
    }
  }

  return prisma.conversation.create({
    data: {
      type: data.type,
      name: data.name,
      description: data.description,
      participants: {
        create: allParticipants.map((id) => ({
          userId: id,
          role: id === data.userId ? "OWNER" : "MEMBER",
        })),
      },
    },
    select: conversationSelect,
  });
}

/** Get all conversations for a user */
export async function getUserConversations(userId: string) {
  return prisma.conversation.findMany({
    where: {
      participants: {
        some: { userId },
      },
    },
    select: {
      id: true,
      type: true,
      name: true,
      description: true,
      createdAt: true,

      participants: {
        select: {
          role: true,
          user: {
            select: safeUserSelect,
          },
        },
      },

      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          id: true,
          content: true,
          createdAt: true,

          sender: {
            select: safeSenderSelect,
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/** Get single conversation by ID (secure) */
export async function getConversationById(
  conversationId: string,
  userId: string
) {
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      participants: {
        some: { userId },
      },
    },
    select: {
      id: true,
      type: true,
      name: true,
      description: true,
      createdAt: true,

      participants: {
        select: {
          role: true,
          user: {
            select: safeUserSelect,
          },
        },
      },

      messages: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          content: true,
          createdAt: true,

          sender: {
            select: safeSenderSelect,
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
      },
    },
  });

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  return conversation;
}

