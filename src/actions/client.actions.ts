"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAppUser } from "@/lib/auth-user";
import { clientSchema } from "@/lib/validations";

async function getVerifiedUserId() {
  const user = await requireAppUser();
  return user.id;
}

export async function createClient(raw: unknown) {
  const userId = await getVerifiedUserId();
  const data = clientSchema.parse(raw);

  const client = await prisma.client.create({
    data: {
      ...data,
      userId,
    },
  });

  revalidatePath("/clients");
  return { success: true, client };
}

export async function updateClient(clientId: string, raw: unknown) {
  const userId = await getVerifiedUserId();
  const data = clientSchema.parse(raw);

  const existing = await prisma.client.findFirst({
    where: { id: clientId, userId },
  });
  if (!existing) {
    throw new Error("Client not found or access denied");
  }

  const client = await prisma.client.update({
    where: { id: clientId },
    data,
  });

  revalidatePath("/clients");
  return { success: true, client };
}

export async function deleteClient(clientId: string) {
  const userId = await getVerifiedUserId();

  const existing = await prisma.client.findFirst({
    where: { id: clientId, userId },
  });
  if (!existing) {
    throw new Error("Client not found or access denied");
  }

  await prisma.client.delete({ where: { id: clientId } });
  revalidatePath("/clients");
  return { success: true };
}

export async function getClients() {
  const userId = await getVerifiedUserId();
  return prisma.client.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });
}
