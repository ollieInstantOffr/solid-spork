import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Luna",
  description: "Terms of Service for the Luna cycle tracking application.",
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

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl p-4 my-4 text-sm leading-relaxed"
      style={{
        background: "rgba(212,96,122,0.08)",
        border: "1px solid rgba(212,96,122,0.20)",
        color: "var(--foreground)",
      }}
    >
      {children}
    </div>
  );
}

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            Last updated: {lastUpdated}
          </p>
        </div>

        <Callout>
          <strong>Please read these Terms carefully.</strong> By accessing or using Luna, you agree to be
          bound by these Terms of Service. If you do not agree, do not use the application.
        </Callout>

        <Section title="1. About Luna">
          <p>
            Luna ("the App", "we", "us") is a personal menstrual cycle tracking tool provided as-is for
            informational and personal organisational purposes only. Luna is operated by an individual
            developer, not a registered medical institution or healthcare provider.
          </p>
          <p>
            Luna is not a medical device, does not provide medical advice, and is not a substitute for
            professional medical guidance, diagnosis, or treatment.
          </p>
        </Section>

        <Section title="2. Not Medical Advice">
          <Callout>
            <strong>⚠️ Important health disclaimer.</strong> All information, predictions, cycle insights,
            phase descriptions, recommendations, fertility estimates, and other content provided by Luna are
            for general informational and personal wellness purposes only. They do <strong>not</strong>{" "}
            constitute medical advice, diagnosis, or treatment of any kind.
          </Callout>
          <p>
            Luna's cycle predictions and recommendations are based on averages and general patterns. They
            are <strong>not accurate enough to be used as a method of contraception</strong> or for the
            purpose of achieving or avoiding pregnancy. Never rely solely on Luna for family planning.
          </p>
          <p>
            Always seek the advice of a qualified healthcare professional for any questions you may have
            regarding a medical condition, your menstrual health, fertility, or any other health matter.
            Never disregard professional medical advice or delay seeking it because of something you have
            read or seen in the App.
          </p>
          <p>
            If you are experiencing a medical emergency, call your local emergency services immediately.
          </p>
        </Section>

        <Section title="3. Eligibility">
          <p>
            You must be at least 16 years old to use Luna. By using the App you represent that you meet
            this age requirement. If you are under 16, please do not use or register for the App.
          </p>
        </Section>

        <Section title="4. Your Account">
          <p>
            You are responsible for maintaining the confidentiality of your account and for all activity
            that occurs under your account. You agree to notify us immediately of any unauthorised access
            to your account.
          </p>
          <p>
            We reserve the right to suspend or terminate accounts at any time, for any reason, including
            but not limited to violations of these Terms.
          </p>
        </Section>

        <Section title="5. Partner View Feature">
          <p>
            Luna allows you to optionally generate a shareable partner link. By creating and sharing this
            link, you acknowledge that anyone with the link and access code can view the information
            displayed in your partner view. You are solely responsible for deciding who to share this
            link with and for revoking access when appropriate.
          </p>
          <p>
            We are not responsible for any consequences arising from you sharing your partner link with
            any individual.
          </p>
        </Section>

        <Section title="6. Acceptable Use">
          <p>You agree not to:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Use the App for any unlawful purpose or in violation of any applicable laws</li>
            <li>Attempt to gain unauthorised access to any part of the App or its infrastructure</li>
            <li>Reverse-engineer, decompile, or otherwise attempt to derive the source code of the App</li>
            <li>Use the App to harass, abuse, or harm another person</li>
            <li>Transmit any viruses, malware, or other malicious code</li>
            <li>Scrape, crawl, or systematically extract data from the App</li>
          </ul>
        </Section>

        <Section title="7. Disclaimer of Warranties">
          <Callout>
            <strong>The App is provided "AS IS" and "AS AVAILABLE" without warranties of any kind</strong>,
            either express or implied, including but not limited to implied warranties of merchantability,
            fitness for a particular purpose, accuracy, completeness, reliability, or non-infringement.
          </Callout>
          <p>
            We do not warrant that: (a) the App will be uninterrupted, error-free, or secure; (b) any
            information or content provided is accurate, complete, or up to date; (c) the App will meet
            your specific requirements; or (d) any defects will be corrected.
          </p>
          <p>
            You use the App entirely at your own risk. We expressly disclaim all liability for any harm
            — physical, emotional, financial, or otherwise — that may result from your use of, or
            inability to use, the App or its content.
          </p>
        </Section>

        <Section title="8. Limitation of Liability">
          <Callout>
            <strong>To the fullest extent permitted by applicable law</strong>, Luna, its developer(s),
            affiliates, licensors, and service providers shall not be liable for any indirect, incidental,
            special, consequential, punitive, or exemplary damages whatsoever, including but not limited
            to: loss of data, loss of profits, personal injury, emotional distress, or any other damages
            arising out of or in connection with your use of — or inability to use — the App, even if
            advised of the possibility of such damages.
          </Callout>
          <p>
            In no event shall our total liability to you for all claims relating to the App exceed the
            greater of (a) the amount you paid to use the App (which, as the App is free, is zero) or
            (b) €10 EUR.
          </p>
          <p>
            Some jurisdictions do not allow the exclusion or limitation of certain warranties or liabilities.
            In such jurisdictions, our liability is limited to the maximum extent permitted by law.
          </p>
        </Section>

        <Section title="9. Indemnification">
          <p>
            You agree to defend, indemnify, and hold harmless Luna and its developer(s) from and against
            any claims, liabilities, damages, losses, and expenses — including reasonable legal fees —
            arising out of or in any way connected with your access to or use of the App, your violation
            of these Terms, or your violation of any rights of any third party.
          </p>
        </Section>

        <Section title="10. Third-Party Services">
          <p>
            Luna uses the following third-party services which are subject to their own terms and privacy
            policies:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li><strong>Resend</strong> — for sending magic-link authentication emails</li>
          </ul>
          <p>
            We are not responsible for the practices, content, or availability of any third-party services.
          </p>
        </Section>

        <Section title="11. Data and Account Deletion">
          <p>
            You may delete your account and all associated data at any time from within the App (Profile →
            Delete my account). Upon deletion, all your personal data, cycle logs, preferences, and partner
            invites will be permanently and irreversibly removed.
          </p>
          <p>
            We are not liable for any loss of data resulting from account deletion, whether initiated by
            you or by us.
          </p>
        </Section>

        <Section title="12. Changes to These Terms">
          <p>
            We may update these Terms at any time. When we do, we will update the "Last updated" date
            above. Your continued use of the App after changes become effective constitutes your acceptance
            of the revised Terms. If you do not agree to the updated Terms, please stop using the App.
          </p>
        </Section>

        <Section title="13. Governing Law">
          <p>
            These Terms shall be governed by and construed in accordance with the laws of Norway, without
            regard to its conflict-of-law principles. Any disputes arising under these Terms shall be
            subject to the exclusive jurisdiction of the courts of Norway.
          </p>
        </Section>

        <Section title="14. Contact">
          <p>
            If you have any questions about these Terms, you can reach us via the contact information
            provided in the App. We will do our best to respond within a reasonable time, but we make
            no guarantees regarding response times.
          </p>
        </Section>

      </div>
    </main>
  );
}
