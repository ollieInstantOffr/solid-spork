import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfDay } from "date-fns";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const today = startOfDay(new Date());

  const data = {
    flowIntensity: body.flowIntensity ?? "NONE",
    symptoms: JSON.stringify(body.symptoms ?? []),
    mood: body.mood ?? null,
    energyLevel: body.energyLevel ?? null,
    bbt: body.bbt ?? null,
    cervicalMucus: body.cervicalMucus ?? null,
    hadSex: body.hadSex ?? false,
    notes: body.notes ?? null,
  };

  await prisma.dailyLog.upsert({
    where: { userId_date: { userId: session.user.id, date: today } },
    create: { userId: session.user.id, date: today, ...data },
    update: data,
  });

  return NextResponse.json({ ok: true });
}
