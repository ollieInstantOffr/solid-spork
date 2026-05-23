"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Link2, Trash2, Mail, MessageSquare, Send } from "lucide-react";
import { format } from "date-fns";

interface Props {
  invite: {
    token: string;
    status: string;
    createdAt: string;
    accessCode: string | null;
  } | null;
}

export function PartnerManager({ invite: initialInvite }: Props) {
  const [invite, setInvite] = useState(initialInvite);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [origin, setOrigin] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const link = invite ? `${origin}/partner-view/${invite.token}` : null;
  const code = invite?.accessCode ?? null;

  const shareText = link && code
    ? `Hi! I've shared my Luna cycle view with you so you can better understand and support me 💕\n\nOpen this link: ${link}\n\nYour access code: ${code}\n\nLove you 🌸`
    : "";

  async function generateLink() {
    setLoading(true);
    const res = await fetch("/api/partner/invite", { method: "POST" });
    const data = await res.json();
    setInvite({ token: data.token, status: "PENDING", createdAt: new Date().toISOString(), accessCode: data.accessCode });
    setShowCode(true);
    setLoading(false);
  }

  async function revokeLink() {
    if (!invite) return;
    setLoading(true);
    await fetch(`/api/partner/invite/${invite.token}`, { method: "DELETE" });
    setInvite(null);
    setLoading(false);
  }

  async function copyLink() {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function copyCode() {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  }

  async function copyAll() {
    if (!shareText) return;
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function sendEmail() {
    if (!emailInput || !invite) return;
    setEmailSending(true);
    setEmailError("");
    try {
      const res = await fetch("/api/partner/share-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientEmail: emailInput, token: invite.token }),
      });
      if (!res.ok) throw new Error("Failed to send");
      setEmailSent(true);
      setEmailInput("");
      setTimeout(() => setEmailSent(false), 4000);
    } catch {
      setEmailError("Couldn't send the email — please try again.");
    }
    setEmailSending(false);
  }

  const smsHref = shareText
    ? `sms:?body=${encodeURIComponent(shareText)}`
    : "#";

  return (
    <div className="space-y-5">
      {/* What they'll see */}
      <div className="rounded-2xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <h2 className="text-lg mb-1" style={{ fontFamily: "var(--font-display)" }}>
          What your partner sees
        </h2>
        <p className="text-sm mb-4" style={{ color: "var(--muted-foreground)" }}>
          The partner view is designed to be helpful without being too much information.
        </p>
        <div className="space-y-3">
          {[
            { icon: "🌕", text: "Your current phase in plain English" },
            { icon: "💡", text: "Simple tips on how to support you" },
            { icon: "📅", text: "What's coming up in the next phase" },
            { icon: "🔒", text: "No access to your logs, symptoms, or temperature data" },
          ].map((item) => (
            <div key={item.icon} className="flex items-center gap-3 text-sm">
              <span className="text-xl">{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Link management */}
      {invite ? (
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
          {/* Header */}
          <div
            className="px-5 py-4 flex items-center justify-between"
            style={{ background: "var(--secondary)" }}
          >
            <div>
              <h3 className="font-semibold text-sm">Partner link</h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                Created {format(new Date(invite.createdAt), "MMM d, yyyy")}
              </p>
            </div>
            <div
              className="px-2.5 py-1 rounded-full text-[11px] font-bold"
              style={{
                background: invite.status === "ACCEPTED" ? "#DCFCE7" : "#FEF9C3",
                color: invite.status === "ACCEPTED" ? "#15803D" : "#A16207",
              }}
            >
              {invite.status === "ACCEPTED" ? "✓ Connected" : "⏳ Waiting"}
            </div>
          </div>

          <div className="p-5 space-y-4" style={{ background: "var(--card)" }}>

            {/* Link row */}
            <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: "var(--secondary)" }}>
              <Link2 className="w-4 h-4 shrink-0" style={{ color: "var(--muted-foreground)" }} />
              <span className="flex-1 text-xs truncate" style={{ color: "var(--muted-foreground)" }}>
                {link || "…"}
              </span>
            </div>

            {/* Access code */}
            {code && (
              <div className="rounded-xl overflow-hidden" style={{ border: "1.5px solid var(--primary)22" }}>
                <div
                  className="px-4 py-2 flex items-center justify-between"
                  style={{ background: "rgba(196,96,122,0.06)" }}
                >
                  <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "var(--primary)" }}>
                    Access code
                  </span>
                  <button
                    onClick={() => setShowCode((s) => !s)}
                    className="text-[11px] font-semibold"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {showCode ? "Hide" : "Show"}
                  </button>
                </div>
                <div className="px-4 py-3 flex items-center justify-between" style={{ background: "var(--card)" }}>
                  {showCode ? (
                    <div className="flex gap-2">
                      {code.split("").map((d, i) => (
                        <div
                          key={i}
                          className="w-9 h-11 flex items-center justify-center rounded-lg text-lg font-bold"
                          style={{ background: "var(--secondary)", color: "var(--primary)", fontFamily: "monospace" }}
                        >
                          {d}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      {Array(6).fill(null).map((_, i) => (
                        <div
                          key={i}
                          className="w-9 h-11 flex items-center justify-center rounded-lg text-2xl"
                          style={{ background: "var(--secondary)", color: "var(--muted-foreground)" }}
                        >
                          •
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={copyCode}
                    className="text-[11px] font-semibold flex items-center gap-1 ml-3"
                    style={{ color: codeCopied ? "#15803D" : "var(--primary)" }}
                  >
                    {codeCopied ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                  </button>
                </div>
                <p className="px-4 pb-3 text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                  Your partner needs this code the first time they open the link.
                </p>
              </div>
            )}

            {/* Send via email */}
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
              <div className="px-4 py-2.5 flex items-center gap-2" style={{ background: "var(--secondary)" }}>
                <Mail className="w-3.5 h-3.5" style={{ color: "var(--primary)" }} />
                <span className="text-xs font-bold" style={{ color: "var(--foreground)" }}>Send invite by email</span>
              </div>
              <div className="p-3 space-y-2" style={{ background: "var(--card)" }}>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => { setEmailInput(e.target.value); setEmailError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && sendEmail()}
                    placeholder="partner@email.com"
                    className="flex-1 px-3 py-2 rounded-xl text-sm outline-none transition-all"
                    style={{
                      background: "var(--secondary)",
                      border: "1.5px solid var(--border)",
                      color: "var(--foreground)",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "var(--primary)"; e.target.style.boxShadow = "0 0 0 3px rgba(196,96,122,0.12)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
                  />
                  <button
                    onClick={sendEmail}
                    disabled={!emailInput || emailSending}
                    className="px-3 py-2 rounded-xl flex items-center gap-1.5 text-xs font-semibold transition-all"
                    style={{
                      background: emailSent ? "#DCFCE7" : "var(--primary)",
                      color: emailSent ? "#15803D" : "white",
                      opacity: !emailInput || emailSending ? 0.6 : 1,
                      boxShadow: emailInput ? "0 2px 10px rgba(196,96,122,0.25)" : "none",
                    }}
                  >
                    {emailSent ? <><Check className="w-3.5 h-3.5" /> Sent!</> : emailSending ? "…" : <><Send className="w-3.5 h-3.5" /> Send</>}
                  </button>
                </div>
                {emailError && <p className="text-[11px]" style={{ color: "#D4607A" }}>{emailError}</p>}
                {emailSent && <p className="text-[11px]" style={{ color: "#15803D" }}>Invite email sent! The link and code are included ✓</p>}
                <p className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                  Luna will send a beautiful email with the link and access code on your behalf.
                </p>
              </div>
            </div>

            {/* SMS share */}
            <a
              href={smsHref}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: "rgba(196,96,122,0.08)",
                color: "var(--primary)",
                border: "1px solid rgba(196,96,122,0.18)",
              }}
            >
              <MessageSquare className="w-4 h-4" />
              Share via SMS
            </a>

            {/* Copy all + revoke */}
            <div className="flex gap-2">
              <Button onClick={copyAll} className="flex-1" variant="outline" size="sm">
                {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy link & code</>}
              </Button>
              <Button onClick={revokeLink} variant="outline" size="sm" disabled={loading}
                className="text-[var(--destructive)]">
                <Trash2 className="w-3.5 h-3.5" />
                Revoke
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="rounded-2xl p-6 text-center"
          style={{ background: "var(--card)", border: "1px dashed var(--border)" }}
        >
          <div className="text-4xl mb-3">🔗</div>
          <h3 className="text-lg mb-1" style={{ fontFamily: "var(--font-display)" }}>
            No partner link yet
          </h3>
          <p className="text-sm mb-5" style={{ color: "var(--muted-foreground)" }}>
            Generate a private link to share with your partner. A unique 6-digit code keeps it secure.
          </p>
          <Button onClick={generateLink} disabled={loading} size="lg">
            {loading ? "Generating…" : "Generate partner link 🌸"}
          </Button>
        </div>
      )}

      {/* Privacy note */}
      <div className="rounded-xl p-4 flex gap-3 text-xs" style={{ background: "var(--secondary)" }}>
        <span className="text-base">🔒</span>
        <p style={{ color: "var(--muted-foreground)" }}>
          Your detailed health data is never shared. The partner link only shows high-level phase information and curated tips.
        </p>
      </div>
    </div>
  );
}
