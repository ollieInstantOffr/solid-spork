import {
  Html, Head, Body, Container, Section, Text, Link, Preview, Heading, Hr,
} from "@react-email/components";

interface Props {
  userName?: string;
  phaseName: string;
}

const PHASE_EMOJIS: Record<string, string> = {
  "Menstrual Phase": "🌑",
  "Follicular Phase": "🌒",
  "Ovulation Phase": "🌕",
  "Luteal Phase": "🌘",
};

const PHASE_DESCRIPTIONS: Record<string, string> = {
  "Menstrual Phase": "Time to slow down, rest, and restore. Your body is doing important work.",
  "Follicular Phase": "Energy is rising. A great time for new ideas and gentle movement.",
  "Ovulation Phase": "Peak energy and confidence. You may feel your most social and vibrant.",
  "Luteal Phase": "A time to turn inward. Honour your need for quiet and comfort.",
};

export function PhaseChangeEmail({ userName, phaseName }: Props) {
  const greeting = userName ? `Hi ${userName},` : "Hi there,";
  const emoji = PHASE_EMOJIS[phaseName] ?? "🌙";
  const description = PHASE_DESCRIPTIONS[phaseName] ?? "";

  return (
    <Html>
      <Head />
      <Preview>You&#39;ve entered a new phase: {phaseName}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>🌙 Luna</Text>
          </Section>
          <Section style={content}>
            <Text style={emojiStyle}>{emoji}</Text>
            <Heading style={h1}>New phase: {phaseName}</Heading>
            <Text style={text}>{greeting}</Text>
            <Text style={text}>{description}</Text>
            <Text style={text}>
              Open Luna to see your personalised recommendations for this phase.
            </Text>
            <Link href={process.env.NEXTAUTH_URL ?? "http://localhost:3000"} style={button}>
              See my recommendations →
            </Link>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>Luna Cycle Tracker · Your cycle, understood</Text>
        </Container>
      </Body>
    </Html>
  );
}

const body: React.CSSProperties = { backgroundColor: "#FDF8F5", fontFamily: "'DM Sans', Arial, sans-serif" };
const container: React.CSSProperties = { margin: "0 auto", padding: "20px 0 48px", maxWidth: "560px" };
const header: React.CSSProperties = { padding: "24px 40px" };
const logo: React.CSSProperties = { fontSize: "24px", fontWeight: "500", color: "#8B2252", margin: "0" };
const content: React.CSSProperties = { background: "#FFFFFF", borderRadius: "16px", padding: "40px", border: "1px solid #E8D5CC" };
const emojiStyle: React.CSSProperties = { fontSize: "48px", margin: "0 0 8px" };
const h1: React.CSSProperties = { fontSize: "28px", fontWeight: "400", color: "#2C1810", margin: "0 0 16px" };
const text: React.CSSProperties = { fontSize: "15px", color: "#8B6B5A", lineHeight: "1.6", margin: "0 0 16px" };
const button: React.CSSProperties = { display: "inline-block", background: "#8B2252", color: "#FDF8F5", padding: "14px 28px", borderRadius: "12px", textDecoration: "none", fontSize: "15px", fontWeight: "500" };
const hr: React.CSSProperties = { borderColor: "#E8D5CC", margin: "24px 40px" };
const footer: React.CSSProperties = { fontSize: "12px", color: "#8B6B5A", textAlign: "center", padding: "0 40px" };
