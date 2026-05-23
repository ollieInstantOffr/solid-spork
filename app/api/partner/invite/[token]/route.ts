import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { token } = await params;

  await prisma.partnerInvite.updateMany({
    where: { token, ownerId: session.user.id },
    data: { status: "REVOKED" },
  });

  return NextResponse.json({ ok: true });
}
