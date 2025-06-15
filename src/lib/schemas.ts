import { z } from "zod";

export const vaccinationSchema = z.object({
  vaccineName: z.string().min(1, "Vaccine name is required"),
});

export const examinationSchema = z.object({
  physicalExamination: z.string().min(1, "Physical examination is required"),
  technique: z.number().min(0, "Technique must be a positive number"),
});

export const patientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.number().min(0, "Age must be a positive number"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  idNumber: z.string().min(1, "ID number is required"),
  medicalHistory: z.string().min(1, "Medical history is required"),
  allergies: z.string().min(1, "Allergies information is required"),
  toxicHabits: z.string().min(1, "Toxic habits information is required"),
  vaccinations: z.array(vaccinationSchema).min(1, "At least one vaccination is required"),
  isPregnant: z.boolean(),
  examinations: z.array(examinationSchema).min(1, "At least one examination is required"),
  laboratoryResults: z.string().min(1, "Laboratory results are required"),
  imageResults: z.string().min(1, "Image results are required"),
  aiResponse: z.string().min(1, "AI response is required"),
});

export type Patient = z.infer<typeof patientSchema>;