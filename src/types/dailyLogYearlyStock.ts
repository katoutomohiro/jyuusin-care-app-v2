export type MonthlySummary = { month:number; total:number; seizure?:number; water?:number; posture?:number };
export type YearlyStock = { year:number; months:MonthlySummary[] };
