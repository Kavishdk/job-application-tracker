// Equivalent to Mongoose Schemas

export enum JobStatus {
  APPLIED = 'Applied',
  ONLINE_TEST = 'Online Test',
  INTERVIEW = 'Interview',
  OFFER = 'Offer',
  REJECTED = 'Rejected',
  NO_RESPONSE = 'No Response'
}

export enum RoundType {
  TECHNICAL = 'Technical',
  HR = 'HR',
  MANAGERIAL = 'Managerial',
  SYSTEM_DESIGN = 'System Design',
  BEHAVIORAL = 'Behavioral'
}

export enum RoundResult {
  PASS = 'Pass',
  FAIL = 'Fail',
  PENDING = 'Pending'
}

export type JobType = 'Full Time' | 'Intern' | 'Intern + Full Time' | '';

export interface InterviewRound {
  id: string;
  jobId: string;
  roundNumber: number;
  roundType: RoundType | string;
  questions: string;
  feedback: string;
  result: RoundResult | string;
  date: string;
}

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  location: string;
  salary: string;
  skills: string[];
  experience: string;
  jobLink: string;
  source: string; // e.g., LinkedIn, Indeed, Referral
  jobType: string; // Intern, Full Time, etc.
  summary: string;
  rawJD: string; // The full text
  resume?: string; // Filename of the uploaded resume
  status: JobStatus;
  appliedDate: string; // ISO Date string
  rounds: InterviewRound[];
}

export interface ParsedJDResponse {
  company: string;
  role: string;
  location: string;
  salary: string;
  skills: string[];
  experience: string;
  jobLink: string;
  source?: string;
  jobType?: string;
  summary: string;
}