import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Revoke existing invites
  await prisma.partnerInvite.updateMany({
    where: { ownerId: session.user.id, status: { not: "REVOKED" } },
    data: { status: "REVOKED" },
  });

  // Generate a random 6-digit access code
  const accessCode = String(Math.floor(100000 + Math.random() * 900000));

  // Create new invite
  const invite = await prisma.partnerInvite.create({
    data: { ownerId: session.user.id, accessCode },
  });

  return NextResponse.json({ token: invite.token, accessCode });
}
