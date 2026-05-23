import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PhasePreferences } from "@/lib/phasePreferences";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const prefs: PhasePreferences = await req.json();

  // Sanitise — ensure arrays only contain strings, max 20 items each, max 80 chars each
  const sanitise = (arr: unknown) =>
    Array.isArray(arr)
      ? arr
          .filter((i) => typeof i === "string" && i.length <= 80)
          .slice(0, 20)
      : [];

  const clean: PhasePreferences = {
    menstrual: sanitise(prefs.menstrual),
    follicular: sanitise(prefs.follicular),
    ovulation: sanitise(prefs.ovulation),
    luteal: sanitise(prefs.luteal),
  };

  await prisma.user.update({
    where: { id: session.user.id },
    data: { phasePreferences: JSON.stringify(clean) },
  });

  return NextResponse.json({ ok: true });
}
