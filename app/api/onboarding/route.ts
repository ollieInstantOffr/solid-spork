import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, birthDate, goal, wantPregnant, cycleLength, periodLength } = await req.json();

  const VALID_GOALS = ["avoid", "ttc", "track"];
  const safeGoal    = VALID_GOALS.includes(goal) ? goal : (wantPregnant ? "ttc" : "avoid");

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: name?.trim() || null,
      birthDate: birthDate ? new Date(birthDate) : null,
      goal: safeGoal,
      wantPregnant: safeGoal === "ttc",
      cycleLength: Math.max(21, Math.min(45, parseInt(cycleLength) || 28)),
      periodLength: Math.max(2, Math.min(10, parseInt(periodLength) || 5)),
      hasOnboarded: true,
    },
  });

  return NextResponse.json({ ok: true });
}
