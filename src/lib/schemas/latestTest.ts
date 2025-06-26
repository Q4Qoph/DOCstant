import { z } from "zod";

export const latestTestSchema = z.object({
  testName: z.string().min(1, "Test name is required"),
  cost: z.number().min(0, "Cost must be 0 or more"),
  testDate: z.string().datetime("Invalid date"),
  diagnosisId: z.string().uuid("Invalid diagnosis ID"),
});
