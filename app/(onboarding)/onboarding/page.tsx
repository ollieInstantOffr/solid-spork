import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OnboardingForm } from "@/components/auth/OnboardingForm";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { hasOnboarded: true, email: true },
  });

  // Already onboarded → go to dashboard
  if (user?.hasOnboarded) redirect("/dashboard");

  return (
    <main
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "var(--background)" }}
    >
      {/* Decorative blobs + sparkles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-35"
          style={{ background: "radial-gradient(circle, #F4B0C8, transparent 70%)" }} />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full opacity-25"
          style={{ background: "radial-gradient(circle, #E8C88A, transparent 70%)" }} />
        <div className="absolute top-[10%] left-[8%] text-xl animate-twinkle" style={{ color: "var(--gold)", animationDelay: "0s" }}>✦</div>
        <div className="absolute top-[20%] right-[12%] text-sm animate-twinkle" style={{ color: "var(--primary)", animationDelay: "1s" }}>✧</div>
        <div className="absolute bottom-[25%] right-[6%] text-lg animate-twinkle" style={{ color: "var(--gold)", animationDelay: "0.5s" }}>✦</div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-up">
        <div className="text-center mb-8">
          <div className="relative inline-block mb-2">
            <span className="text-5xl animate-float inline-block">🌸</span>
            <span className="absolute -top-1 -right-2 text-sm animate-twinkle" style={{ color: "var(--gold)" }}>✦</span>
          </div>
          <h1
            className="text-4xl mb-2 shimmer-text"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Welcome to Luna ✨
          </h1>
          <p className="text-sm font-medium" style={{ color: "var(--muted-foreground)" }}>
            Let&#39;s set up your profile to personalise your experience
          </p>
        </div>

        <OnboardingForm email={user?.email ?? ""} />
      </div>
    </main>
  );
}
