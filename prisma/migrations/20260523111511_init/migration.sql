-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "wantPregnant" BOOLEAN NOT NULL DEFAULT false,
    "cycleLength" INTEGER NOT NULL DEFAULT 28,
    "periodLength" INTEGER NOT NULL DEFAULT 5,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DailyLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "flowIntensity" TEXT NOT NULL DEFAULT 'NONE',
    "symptoms" TEXT NOT NULL DEFAULT '[]',
    "mood" TEXT,
    "energyLevel" INTEGER,
    "bbt" REAL,
    "cervicalMucus" TEXT,
    "hadSex" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DailyLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PartnerInvite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ownerId" TEXT NOT NULL,
    "partnerId" TEXT,
    "token" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PartnerInvite_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PartnerInvite_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "DailyLog_userId_date_key" ON "DailyLog"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "PartnerInvite_token_key" ON "PartnerInvite"("token");
