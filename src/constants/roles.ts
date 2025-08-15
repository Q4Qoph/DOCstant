// /constants/roles.ts
export enum Roles {
  RECEPTIONIST = 0,
  GP = 1, // General Practitioner
  SPECIALIST = 2,
  PHARMACIST = 3,
  LAB_TECH = 4,
  ADMIN = 5,
  SUPER_ADMIN = 6,
}

export function getRoleName(roleId: Roles): string {
  switch (roleId) {
    case Roles.RECEPTIONIST: return 'Receptionist/Nurse';
    case Roles.GP: return 'General Practitioner';
    case Roles.SPECIALIST: return 'Specialist';
    case Roles.PHARMACIST: return 'Pharmacist';
    case Roles.LAB_TECH: return 'Lab Technician';
    case Roles.ADMIN: return 'Administrator';
    case Roles.SUPER_ADMIN: return 'Super Admin';
    default: return String(roleId);
  }
}
