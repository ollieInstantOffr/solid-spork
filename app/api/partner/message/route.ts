import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { token, message } = await req.json();
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  const invite = await prisma.partnerInvite.findUnique({ where: { token } });
  if (!invite || invite.status !== "ACCEPTED") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.partnerInvite.update({
    where: { token },
    data: { partnerMessage: message?.trim()?.slice(0, 280) || null },
  });

  return NextResponse.json({ ok: true });
}
