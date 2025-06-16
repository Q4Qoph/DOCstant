import { z } from "zod";

export const vaccinationSchema = z.object({
  vaccineName: z.string().min(1, "Vaccine name is required"),
});

export const examinationSchema = z.object({
  physicalExamination: z.string().min(1, "Physical examination is required"),
  technique: z.number().min(0, "Technique must be a positive number"),
});

export const diagnosisSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.number().min(0, "Age must be a positive number"),
  sex: z.string().min(1, "Sex is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  chiefComplaint: z.string().min(1, "Chief complaint is required"),
  weight: z.string().min(1, "Weight is required"),
  height: z.string().min(1, "Height is required"),
  temperature: z.string().min(1, "Temperature is required"),
  bloodPresure: z.string().min(1, "Blood pressure is required"),
  respiratoryRate: z.string().min(1, "Respiratory rate is required"),
  heartRate: z.string().min(1, "Heart rate is required"),
  symptoms: z.string().min(1, "Symptoms are required"),
  address: z.string().min(1, "Address is required"),
  idNumber: z.string().min(1, "ID number is required"),
  medicalHistory: z.string().min(1, "Medical history is required"),
  allergies: z.string().min(1, "Allergies information is required"),
  toxicHabits: z.string().min(1, "Toxic habits information is required"),
  isPregnant: z.boolean(),
  vaccinations: z.array(vaccinationSchema),
  examinations: z.array(examinationSchema),
  laboratoryResults: z.string(),
  imageResults: z.string(),
});

export const patientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.number().min(0, "Age must be a positive number"),
  sex: z.string().min(1, "Sex is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  chiefComplaint: z.string().min(1, "Chief complaint is required"),
  symptoms: z.string().min(1, "Symptoms are required"),
  address: z.string().min(1, "Address is required"),
  idNumber: z.string().min(1, "ID number is required"),
  medicalHistory: z.string().min(1, "Medical history is required"),
  allergies: z.string().min(1, "Allergies information is required"),
  toxicHabits: z.string().min(1, "Toxic habits information is required"),
  isPregnant: z.boolean(),
});

export type Patient = z.infer<typeof diagnosisSchema>;