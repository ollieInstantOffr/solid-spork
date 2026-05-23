"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Props {
  defaultMode: "signin" | "register";
  error?: string;
  signInAction: (formData: FormData) => Promise<void>;
}

export function LoginCard({ defaultMode, error, signInAction }: Props) {
  const [mode, setMode] = useState<"signin" | "register">(defaultMode);

  return (
    <div className="pink-card-glow overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b" style={{ borderColor: "var(--border)" }}>
        {(["signin", "register"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setMode(tab)}
            className={cn(
              "flex-1 py-3.5 text-sm font-semibold transition-all duration-200",
              mode === tab ? "border-b-2 -mb-px" : "hover:bg-[var(--secondary)]"
            )}
            style={{
              borderColor: mode === tab ? "var(--primary)" : "transparent",
              color: mode === tab ? "var(--primary)" : "var(--muted-foreground)",
            }}
          >
            {tab === "signin" ? "Sign in ✨" : "Create account 🌸"}
          </button>
        ))}
      </div>

      <div className="p-8">
        <div className="mb-6">
          {mode === "signin" ? (
            <>
              <h2 className="text-2xl mb-1" style={{ fontFamily: "var(--font-display)" }}>
                Welcome back ✦
              </h2>
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                Enter your email and we&#39;ll send a magic link
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl mb-1" style={{ fontFamily: "var(--font-display)" }}>
                Join Luna 🌸
              </h2>
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                Create your account — no password required
              </p>
            </>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: "#FFE4EC", color: "var(--destructive)" }}>
            Something went wrong. Please try again.
          </div>
        )}

        <form action={signInAction} className="space-y-4">
          <input type="hidden" name="redirectTo" value={mode === "register" ? "/onboarding" : "/dashboard"} />
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="btn-pink-gradient w-full h-11 rounded-[var(--radius-md)] text-sm font-semibold text-white shadow-md"
            style={{ boxShadow: "0 4px 16px rgba(196,96,122,0.35)" }}
          >
            {mode === "signin" ? "✨ Send magic link" : "🌸 Create account"}
          </button>
        </form>

        <p className="text-center text-xs mt-5" style={{ color: "var(--muted-foreground)" }}>
          {mode === "signin" ? (
            <>
              Don&#39;t have an account?{" "}
              <button type="button" onClick={() => setMode("register")}
                className="font-semibold underline" style={{ color: "var(--primary)" }}>
                Create one
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button type="button" onClick={() => setMode("signin")}
                className="font-semibold underline" style={{ color: "var(--primary)" }}>
                Sign in
              </button>
            </>
          )}
        </p>

        {mode === "register" && (
          <div className="mt-5 p-4 rounded-xl text-xs leading-relaxed"
            style={{ background: "var(--secondary)", color: "var(--muted-foreground)" }}>
            <strong className="block mb-1" style={{ color: "var(--secondary-foreground)" }}>
              ✦ How it works
            </strong>
            Enter your email → we send a one-click link → you&#39;re in. No passwords, ever.
          </div>
        )}
      </div>
    </div>
  );
}
