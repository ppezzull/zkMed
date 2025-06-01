// lib/constants.ts - Shared constants for zkMed

export const Role = {
  None: 0,
  Patient: 1,
  Hospital: 2,
  Insurer: 3,
  Admin: 4,
} as const;

export const RoleLabels = {
  [Role.None]: "None",
  [Role.Patient]: "Patient",
  [Role.Hospital]: "Hospital",
  [Role.Insurer]: "Insurance Company",
  [Role.Admin]: "Admin",
} as const;

export type RoleType = typeof Role[keyof typeof Role]; 