import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { token, code } = await req.json();

  if (!token || !code) {
    return NextResponse.json({ error: "Missing token or code" }, { status: 400 });
  }

  const invite = await prisma.partnerInvite.findUnique({ where: { token } });

  if (!invite || invite.status === "REVOKED") {
    return NextResponse.json({ error: "Invalid link" }, { status: 404 });
  }

  if (invite.accessCode !== String(code).trim()) {
    return NextResponse.json({ error: "Incorrect code" }, { status: 401 });
  }

  // Mark as accepted on successful code entry
  await prisma.partnerInvite.update({
    where: { token },
    data: { status: "ACCEPTED" },
  });

  return NextResponse.json({ ok: true });
}
