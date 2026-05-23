import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Luna",
  description: "Privacy Policy for the Luna cycle tracking application.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2
        className="text-xl mb-4 pb-2"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 400,
          color: "var(--foreground)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        {title}
      </h2>
      <div className="space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
        {children}
      </div>
    </section>
  );
}

function Callout({ children, variant = "pink" }: { children: React.ReactNode; variant?: "pink" | "green" }) {
  const styles =
    variant === "green"
      ? { background: "rgba(76,175,136,0.08)", border: "1px solid rgba(76,175,136,0.25)", color: "var(--foreground)" }
      : { background: "rgba(212,96,122,0.08)", border: "1px solid rgba(212,96,122,0.20)", color: "var(--foreground)" };

  return (
    <div className="rounded-2xl p-4 my-4 text-sm leading-relaxed" style={styles}>
      {children}
    </div>
  );
}

function DataTable({ rows }: { rows: { data: string; purpose: string; retention: string }[] }) {
  return (
    <div className="rounded-2xl overflow-hidden my-4" style={{ border: "1px solid var(--border)" }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: "var(--secondary)", color: "var(--foreground)" }}>
            <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide">Data</th>
            <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide">Why we hold it</th>
            <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide">Retention</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={i}
              style={{
                background: i % 2 === 0 ? "var(--card)" : "var(--background)",
                borderTop: "1px solid var(--border)",
              }}
            >
              <td className="px-4 py-3 font-medium" style={{ color: "var(--foreground)" }}>{r.data}</td>
              <td className="px-4 py-3">{r.purpose}</td>
              <td className="px-4 py-3">{r.retention}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PrivacyPage() {
  const lastUpdated = "23 May 2026";

  return (
    <main className="py-16 px-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4 uppercase tracking-widest"
            style={{ background: "rgba(196,96,122,0.10)", border: "1px solid rgba(196,96,122,0.20)", color: "var(--primary)" }}>
            ✦ Legal
          </div>
          <h1
            className="mb-3"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 400 }}
          >
            Privacy Policy
          </h1>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            Last updated: {lastUpdated}
          </p>
        </div>

        <Callout variant="green">
          <strong>🔒 Privacy-first by design.</strong> Luna does not sell your data, does not show you
          ads, and does not share your personal information with third parties for marketing purposes.
          Your health data is yours alone.
        </Callout>

        <Section title="1. Who We Are">
          <p>
            Luna ("the App", "we", "us") is a personal menstrual cycle tracking application operated by
            an individual developer. If you have questions about how we handle your data, please contact
            us using the information provided in the App.
          </p>
          <p>
            This Privacy Policy explains what data we collect, how we use it, and what rights you have
            in relation to it. It applies to all users of the Luna application.
          </p>
        </Section>

        <Section title="2. What Data We Collect">
          <p>
            We collect only the minimum data necessary for the App to function. We do{" "}
            <strong>not</strong> collect analytics, behavioural tracking data, advertising identifiers, or
            any data we don't need.
          </p>
          <DataTable
            rows={[
              {
                data: "Email address",
                purpose: "Authentication via magic link. We need this to send you a sign-in link.",
                retention: "Until you delete your account.",
              },
              {
                data: "Name",
                purpose: "Personalising your in-app experience (e.g. greeting).",
                retention: "Until you delete your account.",
              },
              {
                data: "Date of birth",
                purpose: "Displaying your zodiac sign in the App. Optional.",
                retention: "Until you delete your account.",
              },
              {
                data: "Cycle & period length settings",
                purpose: "Calculating and predicting your cycle phases.",
                retention: "Until you delete your account.",
              },
              {
                data: "Daily logs (flow, mood, symptoms, energy, sexual activity)",
                purpose: "Providing phase-aware insights and recommendations.",
                retention: "Until you delete your account.",
              },
              {
                data: "Phase preferences (partner needs)",
                purpose: "Populating your optional partner view with your preferences.",
                retention: "Until you delete your account.",
              },
              {
                data: "Partner invite tokens & access codes",
                purpose: "Enabling the optional partner view feature.",
                retention: "Until you revoke the invite or delete your account.",
              },
              {
                data: "Authentication session tokens",
                purpose: "Keeping you signed in across visits.",
                retention: "Expires automatically or when you sign out.",
              },
            ]}
          />
          <p>
            We do <strong>not</strong> collect: IP addresses (beyond what your hosting provider may log),
            device identifiers, location data, or any information about your contacts.
          </p>
        </Section>

        <Section title="3. How We Use Your Data">
          <p>We use your data only for the following purposes:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>To authenticate you and maintain your session</li>
            <li>To calculate your cycle phase and generate personalised recommendations</li>
            <li>To display your preferences in the partner view (only if you choose to enable it)</li>
            <li>To send transactional emails (magic links and, optionally, partner invites) via Resend</li>
            <li>To allow you to review, edit, and delete your data at any time</li>
          </ul>
          <p>
            We do <strong>not</strong> use your data for advertising, profiling, automated
            decision-making that affects you legally, or any purpose beyond providing the App's features.
          </p>
        </Section>

        <Section title="4. Health Data">
          <Callout>
            <strong>Your cycle and health data is sensitive.</strong> Menstrual and reproductive health
            information is treated with the highest level of care. We never sell it, never share it with
            third parties for any commercial purpose, and never use it for advertising of any kind.
          </Callout>
          <p>
            Your daily logs (flow, mood, symptoms, sexual activity, energy levels) are stored in a
            database accessible only to you. They are never shared with any third party without your
            explicit action (i.e., you choosing to generate and share a partner view link).
          </p>
          <p>
            The partner view deliberately exposes only a limited subset of information (current phase,
            phase preferences you set, phase timeline). It never exposes raw logs, sexual activity data,
            or any other sensitive health information.
          </p>
        </Section>

        <Section title="5. How We Share Your Data">
          <p>
            We share your data in only the following limited, necessary circumstances:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>
              <strong>Resend</strong> — We use Resend to send authentication emails (magic links) and
              optional partner invite emails on your behalf. Resend receives your email address for the
              purpose of delivering these emails only. Resend's privacy policy applies to their handling
              of your email address.
            </li>
            <li>
              <strong>Your hosting provider</strong> — If Luna is self-hosted, the operator of the server
              may have access to server logs. If Luna is hosted on a third-party platform, that platform's
              terms and privacy policy apply to infrastructure-level data (e.g., server logs).
            </li>
            <li>
              <strong>People you choose to share with</strong> — If you generate and share a partner view
              link, the recipient can view the limited information displayed on that page. You control this
              entirely and can revoke access at any time.
            </li>
          </ul>
          <p>
            We do <strong>not</strong> sell, rent, trade, or otherwise transfer your data to any other
            third parties.
          </p>
        </Section>

        <Section title="6. Cookies & Local Storage">
          <p>
            Luna uses session cookies solely for authentication (to keep you signed in). We do not use
            advertising cookies, tracking pixels, or any third-party analytics cookies.
          </p>
          <p>
            The App may store minimal state in your browser's local storage (e.g. theme preferences) for
            performance reasons. This data never leaves your device.
          </p>
        </Section>

        <Section title="7. Data Security">
          <p>
            We take reasonable technical and organisational measures to protect your data against
            unauthorised access, alteration, disclosure, or destruction. These include:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Authentication via cryptographically signed magic links (no passwords stored)</li>
            <li>Partner view access protected by a one-time 6-digit code</li>
            <li>HTTPS encryption in transit</li>
          </ul>
          <p>
            However, no method of transmission over the internet or electronic storage is 100% secure.
            We cannot guarantee absolute security of your data and accept no liability for unauthorised
            access resulting from circumstances beyond our reasonable control.
          </p>
        </Section>

        <Section title="8. Data Retention">
          <p>
            We retain your personal data for as long as your account is active. When you delete your
            account, all associated data — including your profile, cycle logs, preferences, and partner
            invites — is permanently and irreversibly deleted from our systems.
          </p>
          <p>
            Backup copies (if any) are purged within 30 days of account deletion.
          </p>
        </Section>

        <Section title="9. Your Rights">
          <p>
            Depending on your jurisdiction, you may have the following rights regarding your personal data:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li><strong>Access</strong> — You can view all your data within the App at any time.</li>
            <li><strong>Rectification</strong> — You can update or correct your data from your profile settings.</li>
            <li><strong>Erasure</strong> — You can permanently delete your account and all data from Profile → Delete my account. This is immediate and irreversible.</li>
            <li><strong>Portability</strong> — Contact us to request a machine-readable export of your data.</li>
            <li><strong>Restriction / Objection</strong> — You may contact us to restrict or object to specific processing activities.</li>
          </ul>
          <p>
            If you are located in the European Economic Area (EEA), you have rights under the General Data
            Protection Regulation (GDPR). Our lawful basis for processing your data is your consent (given
            when you register and use the App) and the performance of a contract (providing the App's
            features to you).
          </p>
          <p>
            You have the right to lodge a complaint with your local data protection authority at any time.
          </p>
        </Section>

        <Section title="10. Children's Privacy">
          <p>
            Luna is not intended for children under 16. We do not knowingly collect personal data from
            anyone under 16. If you believe a child under 16 has provided us with personal data, please
            contact us and we will delete it promptly.
          </p>
        </Section>

        <Section title="11. International Transfers">
          <p>
            Your data is stored on servers in the region where the App is hosted. If you access the App
            from outside that region, your data may be transferred internationally. We take steps to
            ensure any such transfers comply with applicable data protection laws.
          </p>
          <p>
            Resend, our email provider, may process your email address in the United States. They are
            certified under applicable cross-border data transfer frameworks.
          </p>
        </Section>

        <Section title="12. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. When we do, we will update the "Last
            updated" date at the top. For significant changes, we will make reasonable efforts to notify
            you (e.g. via email). Your continued use of the App after changes take effect constitutes
            your acceptance of the updated policy.
          </p>
        </Section>

        <Section title="13. Contact Us">
          <p>
            If you have questions, concerns, or requests relating to this Privacy Policy or your data,
            please contact us via the contact information provided within the App. We aim to respond
            within 30 days.
          </p>
        </Section>

      </div>
    </main>
  );
}
