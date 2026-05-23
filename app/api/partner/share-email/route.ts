import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendPartnerInviteEmail } from "@/lib/email/send";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { recipientEmail, token } = await req.json();

  if (!recipientEmail || !token) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const invite = await prisma.partnerInvite.findUnique({
    where: { token, ownerId: session.user.id },
    include: { owner: { select: { name: true } } },
  });

  if (!invite || invite.status === "REVOKED" || !invite.accessCode) {
    return NextResponse.json({ error: "Invalid invite" }, { status: 404 });
  }

  const origin = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const partnerLink = `${origin}/partner-view/${token}`;
  const ownerName = invite.owner.name?.split(" ")[0] ?? "Your partner";

  await sendPartnerInviteEmail({
    to: recipientEmail,
    ownerName,
    partnerLink,
    accessCode: invite.accessCode,
  });

  return NextResponse.json({ ok: true });
}
