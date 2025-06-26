import { z } from "zod";

export const admitSchema = z.object({
  diagnosisId: z.string().uuid("Invalid diagnosis ID"),
  ward: z.string().min(1, "Ward is required"),
  room: z.string().min(1, "Room is required"),
  bed: z.string().min(1, "Bed is required"),
});
