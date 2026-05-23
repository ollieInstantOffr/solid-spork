import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { cycleLength } = await req.json();
  const len = Number(cycleLength);
  if (!len || len < 18 || len > 60) {
    return NextResponse.json({ error: "Invalid cycle length" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { cycleLength: len },
  });

  return NextResponse.json({ ok: true });
}
