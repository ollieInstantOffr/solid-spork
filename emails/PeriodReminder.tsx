import {
  Html, Head, Body, Container, Section, Text, Link, Preview, Heading, Hr,
} from "@react-email/components";

interface Props {
  daysAway: number;
  userName?: string;
}

export function PeriodReminderEmail({ daysAway, userName }: Props) {
  const greeting = userName ? `Hi ${userName},` : "Hi there,";

  return (
    <Html>
      <Head />
      <Preview>{`Your period is coming in ${daysAway} day${daysAway !== 1 ? "s" : ""}`}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>🌙 Luna</Text>
          </Section>
          <Section style={content}>
            <Text style={phase}>🌘 Luteal Phase</Text>
            <Heading style={h1}>
              Your period is {daysAway === 1 ? "tomorrow" : `in ${daysAway} days`}
            </Heading>
            <Text style={text}>{greeting}</Text>
            <Text style={text}>
              Your period is predicted to start{" "}
              {daysAway === 1 ? "tomorrow" : `in about ${daysAway} days`}. Now is a good time to prepare your supplies and plan for some extra self-care.
            </Text>
            <Section style={tipBox}>
              <Text style={tipTitle}>Prepare ahead</Text>
              <Text style={tipText}>Stock up on pads, tampons, or your menstrual cup. Consider preparing some comforting meals in advance and clearing your schedule for rest.</Text>
            </Section>
            <Link href={process.env.NEXTAUTH_URL ?? "http://localhost:3000"} style={button}>
              Open Luna →
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
const phase: React.CSSProperties = { fontSize: "13px", color: "#7C5C9E", fontWeight: "600", letterSpacing: "0.05em", textTransform: "uppercase", margin: "0 0 8px" };
const h1: React.CSSProperties = { fontSize: "28px", fontWeight: "400", color: "#2C1810", margin: "0 0 16px" };
const text: React.CSSProperties = { fontSize: "15px", color: "#8B6B5A", lineHeight: "1.6", margin: "0 0 16px" };
const tipBox: React.CSSProperties = { background: "#F5EDE8", borderRadius: "12px", padding: "16px 20px", margin: "0 0 24px" };
const tipTitle: React.CSSProperties = { fontSize: "13px", fontWeight: "600", color: "#5C3428", margin: "0 0 4px" };
const tipText: React.CSSProperties = { fontSize: "13px", color: "#8B6B5A", lineHeight: "1.6", margin: "0" };
const button: React.CSSProperties = { display: "inline-block", background: "#8B2252", color: "#FDF8F5", padding: "14px 28px", borderRadius: "12px", textDecoration: "none", fontSize: "15px", fontWeight: "500" };
const hr: React.CSSProperties = { borderColor: "#E8D5CC", margin: "24px 40px" };
const footer: React.CSSProperties = { fontSize: "12px", color: "#8B6B5A", textAlign: "center", padding: "0 40px" };
