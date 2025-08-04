export type User = {
  id: string;
  name: string;
  initials: string;
  age: number;
  gender: string;
  serviceType: string[];
  birthDate?: string;
  admissionDate?: string;
  disabilityLevel?: string;
  underlyingConditions?: string[];
  medicalCare?: string[];
  handbooks?: string[];
  assistanceLevel?: string;
  seizureTypes?: string[];
  seizureFrequency?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
    emergencyPhone?: string;
  };
  status?: string;
  underlyingDiseases?: string;
  certificates?: string;
  careLevel?: string;
  school?: string;
  medicalCareDetails?: Record<string, any>;
};
