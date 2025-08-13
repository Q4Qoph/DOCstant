import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export const getRoleDisplayName = (role: number) => {
        switch (role) {
            case 0: return 'Receptionist/Nurse';
            case 1: return 'General Practitioner';
            case 2: return 'Specialist';
            case 3: return 'Pharmacist';
            case 4: return 'Lab Technician';
            case 5: return 'Administrator';
            case 6: return 'Super Admin';
            default: return role;
        }
    };