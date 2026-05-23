-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "wantPregnant" BOOLEAN NOT NULL DEFAULT false,
    "cycleLength" INTEGER NOT NULL DEFAULT 28,
    "periodLength" INTEGER NOT NULL DEFAULT 5,
    "hasOnboarded" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "cycleLength", "email", "emailVerified", "id", "image", "name", "periodLength", "updatedAt", "wantPregnant") SELECT "createdAt", "cycleLength", "email", "emailVerified", "id", "image", "name", "periodLength", "updatedAt", "wantPregnant" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
