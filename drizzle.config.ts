import type { Config } from "drizzle-kit";
import { env } from "@/lib/env.mjs";

export default {
  schema: "./lib/db/schema",
  dialect: "postgresql",
  out: "./lib/db/migrations",
  dbCredentials: {
    url: env.POSTGRES_URL,
  },
} satisfies Config;
