import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

function getPrimaryEmail(
  user: Awaited<ReturnType<typeof currentUser>>,
  clerkId: string,
) {
  if (!user) {
    return `${clerkId}@placeholder.local`;
  }

  return (
    user.emailAddresses.find(
      (email) => email.id === user.primaryEmailAddressId,
    )?.emailAddress ??
    user.emailAddresses[0]?.emailAddress ??
    `${clerkId}@placeholder.local`
  );
}

export async function requireClerkId() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    throw new Error("Unauthorized");
  }

  return clerkId;
}

export async function requireAppUser() {
  const clerkId = await requireClerkId();
  const clerkUser = await currentUser();

  const email = getPrimaryEmail(clerkUser, clerkId);
  const firstName = clerkUser?.firstName ?? "";
  const lastName = clerkUser?.lastName ?? "";
  const imageUrl = clerkUser?.imageUrl ?? "";
  const userByClerkId = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (userByClerkId) {
    return prisma.user.update({
      where: { id: userByClerkId.id },
      data: {
        email,
        firstName,
        lastName,
        imageUrl,
      },
    });
  }

  const userByEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (userByEmail) {
    return prisma.user.update({
      where: { id: userByEmail.id },
      data: {
        clerkId,
        email,
        firstName,
        lastName,
        imageUrl,
        businessEmail: userByEmail.businessEmail ?? email,
      },
    });
  }

  return prisma.user.create({
    data: {
      clerkId,
      email,
      firstName,
      lastName,
      imageUrl,
      businessEmail: email,
    },
  });
}
