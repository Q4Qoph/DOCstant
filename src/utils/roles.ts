// utils/roles.ts
import { Roles } from "@/constants/roles"

export function normalizeRole(role: string | number | null | undefined): Roles | null {
  if (role === null || role === undefined) return null

  switch (role) {
    case "Receptionist":
    case 0:
      return Roles.RECEPTIONIST

    case "GeneralPracticioner":
    case 1:
      return Roles.GP

    case "Specialist":
    case 2:
      return Roles.SPECIALIST

    case "Pharmacist":
    case 3:
      return Roles.PHARMACIST

    case "LabTech":
    case 4:
      return Roles.LAB_TECH

    case "Admin":
    case 5:
      return Roles.ADMIN

    case "Super Admin":
      return Roles.SUPER_ADMIN

    default:
      return null
  }
}
