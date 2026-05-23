import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { PhasePreferencesEditor } from "@/components/profile/PhasePreferencesEditor";
import { DeleteAccountDialog } from "@/components/profile/DeleteAccountDialog";
import { NotificationSettings } from "@/components/profile/NotificationSettings";
import { PhaseOverridePicker } from "@/components/profile/PhaseOverridePicker";
import { Button } from "@/components/ui/button";
import { parsePreferences } from "@/lib/phasePreferences";
import { calculatePhase } from "@/lib/cycle/phases";
import { startOfDay, differenceInDays } from "date-fns";

export default async function ProfilePage() {
  const session = await auth();
  const userId = session!.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true, email: true, birthDate: true,
      goal: true, wantPregnant: true, cycleLength: true, periodLength: true,
      phasePreferences: true, pronouns: true,
      notificationTime: true, notifyPeriod: true, notifyOvulation: true,
      phaseOverride: true, phaseOverrideAt: true,
    },
  });

  const preferences = parsePreferences(user?.phasePreferences ?? "{}");

  // Compute calculated phase for override picker
  const flowLogs = await prisma.dailyLog.findMany({
    where: { userId, flowIntensity: { not: "NONE" } },
    orderBy: { date: "desc" }, take: 30, select: { date: true },
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
  const calculatedPhase = calculatePhase(lastPeriodStart, user?.cycleLength ?? 28, user?.periodLength ?? 5);
  const activeOverride = (() => {
    if (!user?.phaseOverride || !user?.phaseOverrideAt) return null;
    const age = differenceInDays(new Date(), user.phaseOverrideAt);
    return age <= 3 ? user.phaseOverride : null;
  })();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl shimmer-text" style={{ fontFamily: "var(--font-display)" }}>
          Your profile ✦
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
          Personalise your cycle tracking experience
        </p>
      </div>

      {/* Account avatar */}
      <div
        className="rounded-2xl p-5 mb-5"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold shrink-0 animate-pulse-ring"
            style={{ background: "linear-gradient(135deg, var(--primary), #D46090)", color: "white" }}
          >
            {(user?.name ?? user?.email ?? "?")[0].toUpperCase()}
          </div>
          <div>
            <p className="font-semibold">{user?.name ?? "No name set"}</p>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Profile settings */}
      <ProfileForm
        initialData={{
          name: user?.name ?? "",
          birthDate: user?.birthDate ? user.birthDate.toISOString().split("T")[0] : "",
          goal: user?.goal ?? "avoid",
          wantPregnant: user?.wantPregnant ?? false,
          cycleLength: user?.cycleLength ?? 28,
          periodLength: user?.periodLength ?? 5,
          pronouns: user?.pronouns ?? "she/her",
        }}
      />

      {/* Phase preferences */}
      <div className="mt-5">
        <PhasePreferencesEditor initialPreferences={preferences} />
      </div>

      {/* Phase override */}
      <div className="mt-5 rounded-2xl p-5"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">🔮</span>
          <h3 className="font-semibold text-sm">Phase override</h3>
        </div>
        <p className="text-xs mb-4" style={{ color: "var(--muted-foreground)" }}>
          Manually set your phase if the calculation doesn&apos;t feel right today.
        </p>
        <PhaseOverridePicker
          currentOverride={activeOverride}
          calculatedPhase={calculatedPhase?.phase ?? null}
        />
      </div>

      {/* Notification settings */}
      <div className="mt-5">
        <div className="mb-3">
          <h3 className="font-semibold text-sm mb-0.5">Reminders</h3>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            Get notified before your period and when your fertile window starts.
          </p>
        </div>
        <NotificationSettings
          notificationTime={user?.notificationTime ?? "20:00"}
          notifyPeriod={user?.notifyPeriod ?? true}
          notifyOvulation={user?.notifyOvulation ?? true}
        />
      </div>

      {/* Sign out */}
      <div className="mt-8 pt-6 border-t" style={{ borderColor: "var(--border)" }}>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <Button variant="outline" type="submit" className="w-full">
            Sign out
          </Button>
        </form>
      </div>

      {/* Delete account */}
      <div className="pt-3 pb-10">
        <DeleteAccountDialog />
      </div>
    </div>
  );
}
