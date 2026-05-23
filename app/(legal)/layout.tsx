import Link from "next/link";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Minimal nav */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
        style={{
          background: "rgba(255,240,245,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl">🌸</span>
          <span
            className="text-xl font-semibold shimmer-text"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Luna
          </span>
        </Link>
        <div className="flex items-center gap-3 text-sm" style={{ color: "var(--muted-foreground)" }}>
          <Link href="/terms" className="hover:underline underline-offset-2 transition-colors"
            style={{ color: "var(--muted-foreground)" }}>Terms</Link>
          <Link href="/privacy" className="hover:underline underline-offset-2 transition-colors"
            style={{ color: "var(--muted-foreground)" }}>Privacy</Link>
          <Link
            href="/login"
            className="btn-pink-gradient px-4 py-1.5 rounded-full text-white font-semibold text-xs"
          >
            Get started
          </Link>
        </div>
      </header>

      {children}

      <footer className="py-8 px-6 border-t mt-16" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          style={{ color: "var(--muted-foreground)" }}>
          <span className="shimmer-text font-semibold" style={{ fontFamily: "var(--font-display)", fontSize: "1rem" }}>Luna</span>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/" className="hover:underline">Home</Link>
          </div>
          <span>© {new Date().getFullYear()} Luna. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
