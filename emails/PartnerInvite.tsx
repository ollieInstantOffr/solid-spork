import {
  Html, Head, Body, Container, Section,
  Text, Link, Preview, Heading, Hr,
} from "@react-email/components";

interface Props {
  ownerName: string;
  partnerLink: string;
  accessCode: string;
}

export function PartnerInviteEmail({ ownerName, partnerLink, accessCode }: Props) {
  const digits = accessCode.split("");

  return (
    <Html>
      <Head />
      <Preview>{ownerName} invited you to their Luna cycle view 🌸</Preview>
      <Body style={body}>
        <Container style={container}>

          {/* Logo */}
          <Section style={header}>
            <Text style={logo}>🌸 Luna</Text>
          </Section>

          {/* Main card */}
          <Section style={card}>
            <Text style={tagline}>You&apos;re invited</Text>
            <Heading style={h1}>
              {ownerName} wants you to understand her cycle
            </Heading>
            <Text style={text}>
              She&apos;s shared her Luna cycle view with you so you can better
              understand how she&apos;s feeling and how to support her throughout
              the month.
            </Text>

            {/* Access code block */}
            <Section style={codeBox}>
              <Text style={codeLabel}>Your one-time access code</Text>
              <Section style={digitRow}>
                {digits.map((d, i) => (
                  <Text key={i} style={digitBox}>{d}</Text>
                ))}
              </Section>
              <Text style={codeHint}>
                Enter this code the first time you open the link below.
                You won&apos;t need it again after that.
              </Text>
            </Section>

            {/* CTA */}
            <Link href={partnerLink} style={button}>
              Open {ownerName}&apos;s cycle view →
            </Link>

            <Text style={linkFallback}>
              Or paste this link into your browser:{" "}
              <Link href={partnerLink} style={{ color: "#C4607A" }}>
                {partnerLink}
              </Link>
            </Text>
          </Section>

          <Hr style={hr} />

          {/* What they'll see */}
          <Section style={infoSection}>
            <Text style={infoTitle}>What you&apos;ll see</Text>
            {[
              "🌕  Her current cycle phase in plain language",
              "💡  Simple tips on how to support her",
              "📅  What's coming up in the next phase",
              "🔒  No detailed health data — only what she chose to share",
            ].map((item) => (
              <Text key={item} style={infoItem}>{item}</Text>
            ))}
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            Luna Cycle Tracker · This email was sent on behalf of {ownerName}.
            If you don&apos;t know them, you can safely ignore this.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────

const body: React.CSSProperties = {
  backgroundColor: "#FFF0F5",
  fontFamily: "Arial, sans-serif",
};

const container: React.CSSProperties = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
};

const header: React.CSSProperties = { padding: "24px 40px 0" };

const logo: React.CSSProperties = {
  fontSize: "22px",
  fontWeight: "600",
  color: "#C4607A",
  margin: "0",
};

const card: React.CSSProperties = {
  background: "#FFFFFF",
  borderRadius: "20px",
  padding: "36px 40px",
  margin: "16px 0",
  border: "1px solid #F2CCDA",
};

const tagline: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#C4607A",
  margin: "0 0 8px",
};

const h1: React.CSSProperties = {
  fontSize: "26px",
  fontWeight: "400",
  color: "#3D1A2E",
  margin: "0 0 16px",
  lineHeight: "1.3",
};

const text: React.CSSProperties = {
  fontSize: "15px",
  color: "#A0607A",
  lineHeight: "1.65",
  margin: "0 0 28px",
};

const codeBox: React.CSSProperties = {
  background: "#FFF0F5",
  borderRadius: "14px",
  padding: "20px 24px",
  margin: "0 0 28px",
  border: "1.5px solid #F2CCDA",
};

const codeLabel: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#C4607A",
  margin: "0 0 14px",
  textAlign: "center",
};

const digitRow: React.CSSProperties = {
  display: "flex" as const,
  gap: "8px",
  justifyContent: "center",
  marginBottom: "14px",
};

const digitBox: React.CSSProperties = {
  display: "inline-block",
  width: "40px",
  height: "48px",
  lineHeight: "48px",
  background: "#FFFFFF",
  borderRadius: "10px",
  border: "2px solid #C4607A",
  textAlign: "center",
  fontSize: "22px",
  fontWeight: "700",
  color: "#C4607A",
  margin: "0 4px",
  fontFamily: "monospace",
};

const codeHint: React.CSSProperties = {
  fontSize: "12px",
  color: "#A0607A",
  margin: "0",
  textAlign: "center",
  lineHeight: "1.5",
};

const button: React.CSSProperties = {
  display: "inline-block",
  background: "linear-gradient(135deg, #C4607A 0%, #D47090 100%)",
  color: "#FFFFFF",
  padding: "14px 32px",
  borderRadius: "12px",
  textDecoration: "none",
  fontSize: "15px",
  fontWeight: "600",
  marginBottom: "16px",
};

const linkFallback: React.CSSProperties = {
  fontSize: "12px",
  color: "#A0607A",
  margin: "0",
  wordBreak: "break-all",
};

const infoSection: React.CSSProperties = { padding: "4px 40px 16px" };

const infoTitle: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: "700",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#C4607A",
  margin: "0 0 10px",
};

const infoItem: React.CSSProperties = {
  fontSize: "13px",
  color: "#7A4060",
  margin: "0 0 6px",
  lineHeight: "1.5",
};

const hr: React.CSSProperties = { borderColor: "#F2CCDA", margin: "8px 40px" };

const footer: React.CSSProperties = {
  fontSize: "11px",
  color: "#A0607A",
  textAlign: "center",
  padding: "0 40px",
  lineHeight: "1.6",
};
