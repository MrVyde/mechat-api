import { prisma } from "../lib/prisma";

const safeUserSelect = {
  id: true,
  username: true,
  isOnline: true,
  lastSeenAt: true,

  profile: {
    select: {
      displayName: true,
      avatarId: true,
    },
  },
} as const;

export async function searchUsers(
  currentUserId: string,
  query: string
) {
  const search = query.trim();

  if (!search) {
    return [];
  }

  return prisma.user.findMany({
    where: {
      id: {
        not: currentUserId,
      },

      OR: [
        {
          username: {
            contains: search,
            mode: "insensitive",
          },
        },

        {
          profile: {
            displayName: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      ],
    },

    take: 20,

    orderBy: {
      username: "asc",
    },

    select: safeUserSelect,
  });
}

export async function updateProfile(userId: string, data: {
  displayName?: string;
  bio?: string;
  avatarId?: string;
}) {
  return prisma.profile.update({
    where: { userId },
    data,
  });
}