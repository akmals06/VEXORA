import { z } from "zod";

export const skema_kuery_kesehatan = z.object({
  detail: z.enum(["ringkas", "lengkap"]).optional().default("ringkas"),
});

export const skema_respons_kesehatan = z.object({
  status: z.literal("ok"),
  layanan: z.literal("voxera-api"),
  fase: z.literal("phase-0"),
  lingkungan: z.enum(["development", "test", "production"]),
  waktu_server: z.iso.datetime(),
});

export type KueryKesehatan = z.infer<typeof skema_kuery_kesehatan>;
export type ResponsKesehatan = z.infer<typeof skema_respons_kesehatan>;
