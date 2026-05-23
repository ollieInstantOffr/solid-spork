import { redirect } from "next/navigation";
import { auth, signIn } from "@/lib/auth";
import { LoginCard } from "@/components/auth/LoginCard";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ verify?: string; error?: string; mode?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  const { verify, error, mode } = await searchParams;

  return (
    <main
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "var(--background)" }}
    >
      {/* Sparkle decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute top-[8%] left-[12%] text-2xl animate-twinkle" style={{ color: "var(--sparkle-color, var(--gold))", animationDelay: "0s" }}>✦</div>
        <div className="absolute top-[15%] right-[18%] text-lg animate-twinkle" style={{ color: "var(--primary)", animationDelay: "0.7s" }}>✧</div>
        <div className="absolute top-[40%] left-[6%] text-sm animate-twinkle" style={{ color: "var(--sparkle-color, var(--gold))", animationDelay: "1.4s" }}>✦</div>
        <div className="absolute top-[60%] right-[8%] text-xl animate-twinkle" style={{ color: "var(--accent)", animationDelay: "0.3s" }}>✦</div>
        <div className="absolute bottom-[20%] left-[20%] text-sm animate-twinkle" style={{ color: "var(--sparkle-color, var(--gold))", animationDelay: "1s" }}>✧</div>
        <div className="absolute bottom-[12%] right-[24%] text-lg animate-twinkle" style={{ color: "var(--primary)", animationDelay: "1.8s" }}>✦</div>
        <div className="absolute top-[75%] left-[45%] text-xs animate-twinkle" style={{ color: "var(--sparkle-color, var(--gold-dark))", animationDelay: "0.5s" }}>✧</div>

        {/* Soft glow blobs */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-40"
          style={{ background: "radial-gradient(circle, #F4B0C8, transparent 70%)" }} />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, #DDA0CC, transparent 70%)" }} />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #E8C88A, transparent 70%)" }} />
      </div>

      <div className="w-full max-w-sm relative z-10 animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="relative inline-block">
            <div className="text-6xl mb-1 animate-float inline-block">🌸</div>
            <span className="absolute -top-1 -right-3 text-sm animate-twinkle" style={{ color: "var(--gold)" }}>✦</span>
          </div>
          <h1
            className="text-5xl mb-1 shimmer-text"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Luna
          </h1>
          <p className="text-sm font-medium" style={{ color: "var(--muted-foreground)" }}>
            Your cycle, understood ✨
          </p>
        </div>

        {verify ? (
          <div className="pink-card-glow p-8 text-center">
            <div className="text-4xl mb-3">💌</div>
            <h2 className="text-2xl mb-2" style={{ fontFamily: "var(--font-display)" }}>
              Check your email
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
              We&#39;ve sent a magic link to your inbox. Click it to{" "}
              {mode === "register" ? "create your account" : "sign in"} — no password needed.
            </p>
            <p className="text-xs mt-4" style={{ color: "var(--muted-foreground)" }}>
              Didn&#39;t get it? Check your spam or{" "}
              <a href="/login" className="font-semibold underline" style={{ color: "var(--primary)" }}>
                try again
              </a>
              .
            </p>
          </div>
        ) : (
          <LoginCard
            defaultMode={(mode as "signin" | "register") ?? "signin"}
            error={error}
            signInAction={async (formData: FormData) => {
              "use server";
              await signIn("resend", formData);
            }}
          />
        )}

        <p className="text-center text-xs mt-6" style={{ color: "var(--muted-foreground)" }}>
          By continuing you agree to our{" "}
          <Link href="/terms" className="underline underline-offset-2 font-medium hover:opacity-80 transition-opacity"
            style={{ color: "var(--primary)" }}>
            Terms
          </Link>
          {" & "}
          <Link href="/privacy" className="underline underline-offset-2 font-medium hover:opacity-80 transition-opacity"
            style={{ color: "var(--primary)" }}>
            Privacy Policy
          </Link>
        </p>
      </div>
    </main>
  );
}
