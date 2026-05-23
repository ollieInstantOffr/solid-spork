import { Resend } from "resend";
import { render } from "@react-email/render";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM ?? "Cycle Tracker <noreply@resend.dev>";

export async function sendMagicLinkEmail({
  to,
  url,
}: {
  to: string;
  url: string;
}) {
  const { MagicLinkEmail } = await import("@/emails/MagicLink");
  const html = await render(MagicLinkEmail({ url }));

  const result = await resend.emails.send({
    from: FROM,
    to,
    subject: "Your sign-in link for Luna",
    html,
  });

  if (result.error) {
    console.error("[Luna] Failed to send magic link email:", result.error);
    throw new Error(`Email send failed: ${result.error.message}`);
  }
}

export async function sendPeriodReminder({
  to,
  daysAway,
  userName,
}: {
  to: string;
  daysAway: number;
  userName?: string;
}) {
  const { PeriodReminderEmail } = await import("@/emails/PeriodReminder");
  const html = await render(PeriodReminderEmail({ daysAway, userName }));

  await resend.emails.send({
    from: FROM,
    to,
    subject: `Your period is ${daysAway === 1 ? "tomorrow" : `in ${daysAway} days`}`,
    html,
  });
}

export async function sendFertileReminder({
  to,
  userName,
  wantPregnant,
}: {
  to: string;
  userName?: string;
  wantPregnant: boolean;
}) {
  const { FertileReminderEmail } = await import("@/emails/FertileReminder");
  const html = await render(FertileReminderEmail({ userName, wantPregnant }));

  await resend.emails.send({
    from: FROM,
    to,
    subject: "Your fertile window is here",
    html,
  });
}

export async function sendPhaseChangeEmail({
  to,
  userName,
  phaseName,
}: {
  to: string;
  userName?: string;
  phaseName: string;
}) {
  const { PhaseChangeEmail } = await import("@/emails/PhaseChange");
  const html = await render(PhaseChangeEmail({ userName, phaseName }));

  await resend.emails.send({
    from: FROM,
    to,
    subject: `New phase: ${phaseName}`,
    html,
  });
}

export async function sendPartnerInviteEmail({
  to,
  ownerName,
  partnerLink,
  accessCode,
}: {
  to: string;
  ownerName: string;
  partnerLink: string;
  accessCode: string;
}) {
  const { PartnerInviteEmail } = await import("@/emails/PartnerInvite");
  const html = await render(PartnerInviteEmail({ ownerName, partnerLink, accessCode }));

  const result = await resend.emails.send({
    from: FROM,
    to,
    subject: `${ownerName} invited you to her Luna cycle view 🌸`,
    html,
  });

  if (result.error) {
    console.error("[Luna] Failed to send partner invite email:", result.error);
    throw new Error(`Email send failed: ${result.error.message}`);
  }
}

export async function sendDailyLogReminder({
  to,
  userName,
}: {
  to: string;
  userName?: string;
}) {
  const { DailyLogReminderEmail } = await import("@/emails/DailyLogReminder");
  const html = await render(DailyLogReminderEmail({ userName }));

  await resend.emails.send({
    from: FROM,
    to,
    subject: "Don't forget to log today",
    html,
  });
}
