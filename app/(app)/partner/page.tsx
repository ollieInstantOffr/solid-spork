import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PartnerManager } from "@/components/partner/PartnerManager";

export default async function PartnerPage() {
  const session = await auth();
  const userId = session!.user.id;

  const invite = await prisma.partnerInvite.findFirst({
    where: { ownerId: userId, status: { not: "REVOKED" } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
          Partner view
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
          Share a private link with your partner so they can understand your cycle too
        </p>
      </div>

      <PartnerManager
        invite={
          invite
            ? {
                token: invite.token,
                status: invite.status,
                createdAt: invite.createdAt.toISOString(),
                accessCode: invite.accessCode,
              }
            : null
        }
      />
    </div>
  );
}
