import {
  Html, Head, Body, Container, Section, Text, Link, Preview, Heading, Hr,
} from "@react-email/components";

interface Props {
  userName?: string;
}

export function DailyLogReminderEmail({ userName }: Props) {
  const greeting = userName ? `Hi ${userName},` : "Hi there,";

  return (
    <Html>
      <Head />
      <Preview>Don&#39;t forget to log today</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>🌙 Luna</Text>
          </Section>
          <Section style={content}>
            <Text style={emojiStyle}>📓</Text>
            <Heading style={h1}>Log today&#39;s feelings</Heading>
            <Text style={text}>{greeting}</Text>
            <Text style={text}>
              You haven&#39;t logged today yet. It only takes a moment and helps Luna give you better insights and predictions over time.
            </Text>
            <Link href={`${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/log`} style={button}>
              Log now →
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
