import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppNav } from "@/components/AppNav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { hasOnboarded: true },
  });

  // Send new users to onboarding before they can access the app
  if (!user?.hasOnboarded) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 pb-20 md:pb-0 md:pl-64">
        {children}
      </div>
      <AppNav />
    </div>
  );
}
