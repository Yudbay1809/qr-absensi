import { prisma } from "@/lib/prisma";

export async function getSettings() {
  const existing = await prisma.settings.findFirst();
  if (existing) return existing;

  return prisma.settings.create({ data: {} });
}

export async function updateSettings(data: {
  workStart: string;
  breakStart: string;
  breakEnd: string;
  workEnd: string;
}) {
  const existing = await prisma.settings.findFirst();
  if (!existing) {
    return prisma.settings.create({ data });
  }

  return prisma.settings.update({
    where: { id: existing.id },
    data,
  });
}
