import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfDay } from "date-fns";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { flow, mood, energy, symptoms } = await req.json();
  const today = startOfDay(new Date());

  const symptomsJson = Array.isArray(symptoms) ? JSON.stringify(symptoms) : "[]";

  await prisma.dailyLog.upsert({
    where: { userId_date: { userId: session.user.id, date: today } },
    create: {
      userId: session.user.id,
      date: today,
      flowIntensity: flow ?? "NONE",
      mood: mood ?? null,
      energyLevel: energy ?? null,
      symptoms: symptomsJson,
    },
    update: {
      flowIntensity: flow ?? "NONE",
      mood: mood ?? null,
      energyLevel: energy ?? null,
      symptoms: symptomsJson,
    },
  });

  return NextResponse.json({ ok: true });
}
