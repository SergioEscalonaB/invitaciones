import "dotenv/config";
// Prisma loads this module after dependencies are installed; this comment also
// keeps Next's application typecheck independent from the optional CLI package.
// @ts-expect-error Prisma CLI provides this export at migration time.
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: env("DATABASE_URL") },
});
