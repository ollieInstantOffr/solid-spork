import { NextResponse } from "next/server";
import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Deleting the user cascades to:
  //   Account, Session, DailyLog, PartnerInvite (as owner)
  await prisma.user.delete({ where: { id: session.user.id } });

  return NextResponse.json({ ok: true });
}
