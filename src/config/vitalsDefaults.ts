export const VITAL_DEFAULTS = {
  tempC: 36.5,
  hr: 80,
  spo2: 90,
  bpSys: 120,
  bpDia: 80,
  rr: 25,
} as const;

export const VITAL_LIMITS = {
  tempC: { min: 30.0, max: 45.0, step: 0.1 },
  hr:    { min: 0,    max: 250,  step: 1   },
  spo2:  { min: 50,   max: 100,  step: 1   },
  bpSys: { min: 50,   max: 250,  step: 1   },
  bpDia: { min: 30,   max: 150,  step: 1   },
  rr:    { min: 5,    max: 60,   step: 1   },
} as const;
