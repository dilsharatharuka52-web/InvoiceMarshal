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

  return prisma.user.upsert({
    where: { clerkId },
    create: {
      clerkId,
      email,
      firstName,
      lastName,
      imageUrl,
      businessEmail: email,
    },
    update: {
      email,
      firstName,
      lastName,
      imageUrl,
    },
  });
}
