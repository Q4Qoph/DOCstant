export interface User {
  id: string;
  name: string;
  email: string;
  role: any;
  phone: string;
  companyId: string
}


export interface Patient {
  id: string;
  medicalRecordNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  nationalId: string;
  phoneNumber: string;
  emergencyContact: string;
  isPregnant?: boolean;
  pregnancyWeeks?: number;
  department: 0 | 1 | 2 | 3 | 4 | 5;
  assignedDoctor?: string;
  aiResponse:{step: string, response: string }[]
  comments: string
  createdAt: string;
  updatedAt: string;
  name: string
  age: number
  sex: string
  chiefComplaint: string
  weight: string
  height: string
  temperature: string
  bloodPresure: string
  respiratoryRate: string
  heartRate: string
  symptoms: string
  idNumber: string
  medicalHistory: string
  allergies: string
  toxicHabits: string
  vaccinations: Array<{ vaccineName: string }>
  examinations: Array<{ physicalExamination: string; technique: number }>
  laboratoryResults: string
  imageResults: string
}

export interface VitalSigns {
  temperature: number;
  bloodPressure: string;
  respiratoryRate: number;
  heartRate: number;
  weight: number;
  height: number;
  recordedBy: string;
  recordedAt: string;
}

export interface MedicalHistory {
  id: string;
  patientId: string;
  chiefComplaint: string;
  historyOfPresentIllness: string;
  pastMedicalHistory: string;
  familyHistory: string;
  socialHistory: string;
  allergies: string[];
  toxicHabits: string[];
  vaccinations: {
    upToDate: boolean;
    missing?: string[];
  };
  recordedBy: string;
  recordedAt: string;
}

export interface PhysicalExamination {
  id: string;
  patientId: string;
  inspection: string;
  palpation: string;
  percussion: string;
  auscultation: string;
  signsAndSymptoms: string;
  recordedBy: string;
  recordedAt: string;
}

export interface Investigation {
  id: string;
  patientId: string;
  laboratoryResults: string;
  imagingResults: string;
  recordedBy: string;
  recordedAt: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  medications: {
    genericName: string;
    brandName: string;
    dosage: string;
    frequency: string;
    duration: string;
    presentation: 'liquid' | 'tablets' | 'capsules' | 'ointment' | 'suppositories' | 'drops' | 'inhalers' | 'injections' | 'implants' | 'patches';
  }[];
  prescribedBy: string;
  prescribedAt: string;
  status: 'pending' | 'approved' | 'dispensed';
}

export interface InventoryItem {
  id: string;
  genericName: string;
  brandName: string;
  presentation: string;
  quantity: number;
  price: number;
  expiryDate: string;
  supplier: string;
  createdAt: string;
  updatedAt: string;
}

export type FormData = {
  name: string;
  email: string;
  phone: string;
  role: 'RN' | 'GP' | 'C' | 'P' | 'L' | 'admin';
  department: string;
  password: string;
  confirmPassword: string;
};
export interface PrescriptionRecord {
  id: number
  record: {
    id: string
    name: string
    age: number
    sex: string
    phoneNumber: string
    chiefComplaint: string
  }
  diagnosisId: string
  drugName: string
  quantity: number
  medicineDosage: string
  comments: string
  approve: boolean
  createdAt: string
  updatedAt: string
}


export interface NotificationDropdownProps {
  className?: string;
}

export interface Treatment {
  id: number;
  diagnosisRecord: {
    id: string;
    name: string;
    age: number;
    sex: string;
    phoneNumber: string;
    chiefComplaint: string;
    weight: string;
    height: string;
    temperature: string;
    bloodPresure: string;
    respiratoryRate: string;
    heartRate: string;
    symptoms: string;
    address: string;
    idNumber: string;
    medicalHistory: string;
    allergies: string;
    toxicHabits: string;
    vaccinations: any[];
    treatments: string[];
    inpatient: any[];
    expenses: any[];
    payments: any[];
    isPregnant: boolean;
    prescriptions: any[];
    examinations: any[];
    labtests: any[];
    reevaluation: any[];
    laboratoryResults: string;
    department: number;
    imageResults: string;
    aiResponse: {step: string, response: string }[];
    comments: string;
  };
  diagnosisId: string;
  description: string;
}