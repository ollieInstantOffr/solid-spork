-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "birthDate" DATETIME,
    "goal" TEXT NOT NULL DEFAULT 'avoid',
    "wantPregnant" BOOLEAN NOT NULL DEFAULT false,
    "cycleLength" INTEGER NOT NULL DEFAULT 28,
    "periodLength" INTEGER NOT NULL DEFAULT 5,
    "hasOnboarded" BOOLEAN NOT NULL DEFAULT false,
    "tutorialSeen" BOOLEAN NOT NULL DEFAULT false,
    "pronouns" TEXT NOT NULL DEFAULT 'she/her',
    "phaseOverride" TEXT,
    "phaseOverrideAt" DATETIME,
    "phasePreferences" TEXT NOT NULL DEFAULT '{}',
    "pushSubscription" TEXT,
    "notificationTime" TEXT NOT NULL DEFAULT '20:00',
    "notifyPeriod" BOOLEAN NOT NULL DEFAULT true,
    "notifyOvulation" BOOLEAN NOT NULL DEFAULT true,
    "lastNotifiedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("birthDate", "createdAt", "cycleLength", "email", "emailVerified", "hasOnboarded", "id", "image", "lastNotifiedAt", "name", "notificationTime", "notifyOvulation", "notifyPeriod", "periodLength", "phaseOverride", "phaseOverrideAt", "phasePreferences", "pronouns", "pushSubscription", "tutorialSeen", "updatedAt", "wantPregnant") SELECT "birthDate", "createdAt", "cycleLength", "email", "emailVerified", "hasOnboarded", "id", "image", "lastNotifiedAt", "name", "notificationTime", "notifyOvulation", "notifyPeriod", "periodLength", "phaseOverride", "phaseOverrideAt", "phasePreferences", "pronouns", "pushSubscription", "tutorialSeen", "updatedAt", "wantPregnant" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
