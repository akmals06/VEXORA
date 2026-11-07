import "dotenv/config";
import { defineConfig } from "prisma/config";

const url_fallback_validasi =
  "postgresql://YOUR_DB_USER:YOUR_DB_PASSWORD@localhost:5432/voxera_dev?schema=public";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? url_fallback_validasi,
  },
});
