import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LogForm } from "@/components/log/LogForm";
import { startOfDay, differenceInDays } from "date-fns";
import { calculatePhase } from "@/lib/cycle/phases";

export default async function LogPage() {
  const session = await auth();
  const userId = session!.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { cycleLength: true, periodLength: true },
  });

  const todayStart = startOfDay(new Date());
  const todayLog = await prisma.dailyLog.findUnique({
    where: { userId_date: { userId, date: todayStart } },
  });

  // Find last period start for cycle correction
  const flowLogs = await prisma.dailyLog.findMany({
    where: { userId, flowIntensity: { not: "NONE" } },
    orderBy: { date: "desc" },
    take: 30,
    select: { date: true },
  });

  let lastPeriodStart: Date | null = null;
  if (flowLogs.length > 0) {
    let ps = startOfDay(flowLogs[0].date);
    for (let i = 1; i < flowLogs.length; i++) {
      const diff = differenceInDays(startOfDay(flowLogs[i - 1].date), startOfDay(flowLogs[i].date));
      if (diff <= 1) ps = startOfDay(flowLogs[i].date);
      else break;
    }
    lastPeriodStart = ps;
  }

  const phaseInfo = calculatePhase(lastPeriodStart, user?.cycleLength ?? 28, user?.periodLength ?? 5);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
          Daily log
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
          Track how you feel today
        </p>
      </div>

      <LogForm
        existingLog={
          todayLog
            ? {
                flowIntensity: todayLog.flowIntensity,
                symptoms: JSON.parse(todayLog.symptoms),
                mood: todayLog.mood ?? undefined,
                energyLevel: todayLog.energyLevel ?? undefined,
                bbt: todayLog.bbt ?? undefined,
                cervicalMucus: todayLog.cervicalMucus ?? undefined,
                hadSex: todayLog.hadSex,
                notes: todayLog.notes ?? undefined,
              }
            : undefined
        }
        currentCycleLength={user?.cycleLength ?? 28}
        predictedNextPeriod={phaseInfo?.nextPeriodDate?.toISOString() ?? null}
      />
    </div>
  );
}
