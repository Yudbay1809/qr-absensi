import { prisma } from "@/lib/public/prisma";
import type { Shift } from "@prisma/client";

let cachedShift: Shift | null = null;
let cachedAt = 0;

export async function getDefaultShift() {
  const now = Date.now();
  if (cachedShift && now - cachedAt < 60_000) {
    return cachedShift;
  }

  const settings = await prisma.settings.findFirst({
    include: { defaultShift: true },
  });

  if (settings?.defaultShift) {
    cachedShift = settings.defaultShift;
    cachedAt = now;
    return cachedShift;
  }

  const fallback = await prisma.shift.findFirst({ where: { isActive: true } });
  cachedShift = fallback ?? null;
  cachedAt = now;
  return fallback;
}

export function timeToMinutes(value: string) {
  const [hour, minute] = value.split(":").map(Number);
  return hour * 60 + (minute || 0);
}

export function validateShiftTimes({
  workStart,
  breakStart,
  breakEnd,
  workEnd,
}: {
  workStart: string;
  breakStart: string;
  breakEnd: string;
  workEnd: string;
}) {
  const workStartMin = timeToMinutes(workStart);
  const breakStartMin = timeToMinutes(breakStart);
  const breakEndMin = timeToMinutes(breakEnd);
  const workEndMin = timeToMinutes(workEnd);

  if (workStartMin >= workEndMin) {
    return "Jam pulang harus lebih besar dari jam masuk.";
  }
  if (breakStartMin <= workStartMin || breakStartMin >= workEndMin) {
    return "Jam istirahat mulai harus di antara jam masuk dan jam pulang.";
  }
  if (breakEndMin <= breakStartMin || breakEndMin >= workEndMin) {
    return "Jam istirahat selesai harus di antara jam istirahat mulai dan jam pulang.";
  }

  return null;
}

