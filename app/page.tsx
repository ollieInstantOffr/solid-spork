import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LandingPage } from "@/components/LandingPage";

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { hasOnboarded: true },
    });
    redirect(user?.hasOnboarded ? "/dashboard" : "/onboarding");
  }

  return <LandingPage />;
}
