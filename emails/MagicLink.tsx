import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Preview,
  Heading,
  Hr,
} from "@react-email/components";

interface Props {
  url: string;
}

export function MagicLinkEmail({ url }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Your sign-in link for Luna Cycle Tracker</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>🌙 Luna</Text>
          </Section>

          <Section style={content}>
            <Heading style={h1}>Sign in to Luna</Heading>
            <Text style={text}>
              Click the button below to securely sign in. This link expires in 24 hours and can only be used once.
            </Text>

            <Link href={url} style={button}>
              Sign in to Luna →
            </Link>

            <Text style={small}>
              If you didn&#39;t request this, you can safely ignore this email.
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            Luna Cycle Tracker · Your cycle, understood
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const body: React.CSSProperties = {
  backgroundColor: "#FDF8F5",
  fontFamily: "'DM Sans', Arial, sans-serif",
};

const container: React.CSSProperties = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
};

const header: React.CSSProperties = {
  padding: "24px 40px",
};

const logo: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: "500",
  color: "#8B2252",
  margin: "0",
};

const content: React.CSSProperties = {
  background: "#FFFFFF",
  borderRadius: "16px",
  padding: "40px",
  border: "1px solid #E8D5CC",
};

const h1: React.CSSProperties = {
  fontSize: "32px",
  fontWeight: "400",
  color: "#2C1810",
  margin: "0 0 16px",
};

const text: React.CSSProperties = {
  fontSize: "15px",
  color: "#8B6B5A",
  lineHeight: "1.6",
  margin: "0 0 24px",
};

const button: React.CSSProperties = {
  display: "inline-block",
  background: "#8B2252",
  color: "#FDF8F5",
  padding: "14px 28px",
  borderRadius: "12px",
  textDecoration: "none",
  fontSize: "15px",
  fontWeight: "500",
};

const small: React.CSSProperties = {
  fontSize: "13px",
  color: "#8B6B5A",
  marginTop: "24px",
};

const hr: React.CSSProperties = {
  borderColor: "#E8D5CC",
  margin: "24px 40px",
};

const footer: React.CSSProperties = {
  fontSize: "12px",
  color: "#8B6B5A",
  textAlign: "center",
  padding: "0 40px",
};
