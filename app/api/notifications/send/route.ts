import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { calculatePhase } from "@/lib/cycle/phases";
import { startOfDay, differenceInDays } from "date-fns";

webpush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

// This route can be called by a cron job (e.g. cron-job.org hitting /api/notifications/send)
// It checks every subscribed user and sends period/ovulation alerts as needed.
export async function GET(req: NextRequest) {
  // Simple cron secret check
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.AUTH_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    where: { pushSubscription: { not: null } },
    select: {
      id: true, cycleLength: true, periodLength: true,
      notifyPeriod: true, notifyOvulation: true,
      notificationTime: true, pushSubscription: true,
      dailyLogs: {
        where: { flowIntensity: { not: "NONE" } },
        orderBy: { date: "desc" },
        take: 30,
        select: { date: true },
      },
    },
  });

  let sent = 0;

  for (const user of users) {
    if (!user.pushSubscription) continue;
    let subscription: webpush.PushSubscription;
    try { subscription = JSON.parse(user.pushSubscription); } catch { continue; }

    // Find last period start
    const flowLogs = user.dailyLogs.sort((a, b) => b.date.getTime() - a.date.getTime());
    if (!flowLogs.length) continue;

    let periodStart = startOfDay(flowLogs[0].date);
    for (let i = 1; i < flowLogs.length; i++) {
      const diff = differenceInDays(startOfDay(flowLogs[i - 1].date), startOfDay(flowLogs[i].date));
      if (diff <= 1) periodStart = startOfDay(flowLogs[i].date);
      else break;
    }

    const phase = calculatePhase(periodStart, user.cycleLength, user.periodLength);
    if (!phase) continue;

    const notifications: { title: string; body: string; tag: string }[] = [];

    // Period in 2 days
    if (user.notifyPeriod && phase.daysUntilNextPeriod === 2) {
      notifications.push({
        title: "🩸 Your period is coming",
        body: "Heads up — your period is expected in about 2 days. Time to stock up on your essentials 🌸",
        tag: "period-soon",
      });
    }

    // Fertile window start
    if (user.notifyOvulation && phase.dayOfCycle === phase.fertileWindow.start) {
      notifications.push({
        title: "🌟 Fertile window starting",
        body: "Your estimated fertile window begins today. Check Luna for more details.",
        tag: "fertile-window",
      });
    }

    for (const notif of notifications) {
      try {
        await webpush.sendNotification(subscription, JSON.stringify(notif));
        sent++;
      } catch (err) {
        // If subscription is invalid, remove it
        if ((err as { statusCode?: number }).statusCode === 410) {
          await prisma.user.update({ where: { id: user.id }, data: { pushSubscription: null } });
        }
      }
    }
  }

  return NextResponse.json({ ok: true, sent });
}
