import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const dbUrl = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
  const dbFilePath = dbUrl.replace("file:", "");
  const resolvedPath = path.isAbsolute(dbFilePath)
    ? dbFilePath
    : path.join(process.cwd(), dbFilePath);

  const adapter = new PrismaBetterSqlite3({ url: resolvedPath });
  return new PrismaClient({ adapter } as never);
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
