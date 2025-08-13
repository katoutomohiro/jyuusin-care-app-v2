/* dev stub */
import * as React from "react";
export function useData() {
  return {
    users: [{
      id: "", name: "", age: 0, disabilityLevel: "", careLevel: "", medicalCare: [], serviceType: [],
      initials: "", gender: "", disabilityType: "", underlyingDiseases: "", familyContact: { name: "", relationship: "", phone: "" }, notes: "", certificates: ""
    }],
    getUserById: (id: string) => ({
      id, name: "", age: 0, disabilityLevel: "", careLevel: "", medicalCare: [], serviceType: [],
      initials: "", gender: "", disabilityType: "", underlyingDiseases: "", familyContact: { name: "", relationship: "", phone: "" }, notes: "", certificates: ""
    }),
    addUser: (user: any) => {},
    removeUser: (id: string) => {},
    updateUser: (id: string, data: any) => {},
  };
}