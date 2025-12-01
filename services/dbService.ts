import { JobApplication, InterviewRound, JobStatus } from "../types";

const STORAGE_KEY = 'job_track_ai_db';

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Initial Seed Data
const seedData: JobApplication[] = [
  {
    id: '1',
    company: 'TechCorp Inc.',
    role: 'Senior React Engineer',
    location: 'Remote',
    salary: '$140k - $160k',
    skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
    experience: '5+ years',
    jobLink: 'https://linkedin.com/jobs/example',
    source: 'LinkedIn',
    jobType: 'Full Time',
    summary: 'Leading the frontend team to rebuild the core dashboard using modern React patterns.',
    rawJD: 'Full text would go here...',
    resume: 'My_Resume_Senior_Frontend_v2.pdf',
    status: JobStatus.INTERVIEW,
    appliedDate: new Date(Date.now() - 86400000 * 5).toISOString(),
    rounds: [
      {
        id: 'r1',
        jobId: '1',
        roundNumber: 1,
        roundType: 'HR Screen',
        questions: 'Tell me about yourself. Why TechCorp?',
        feedback: 'Good culture fit.',
        result: 'Pass',
        date: new Date(Date.now() - 86400000 * 4).toISOString()
      }
    ]
  }
];

const loadDB = (): JobApplication[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
    return seedData;
  }
  return JSON.parse(data);
};

const saveDB = (data: JobApplication[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const JobService = {
  getAll: async (): Promise<JobApplication[]> => {
    await delay(300);
    return loadDB();
  },

  getById: async (id: string): Promise<JobApplication | undefined> => {
    await delay(200);
    const jobs = loadDB();
    return jobs.find(j => j.id === id);
  },

  create: async (job: Omit<JobApplication, 'id' | 'appliedDate' | 'rounds'>): Promise<JobApplication> => {
    await delay(400);
    const jobs = loadDB();
    const newJob: JobApplication = {
      ...job,
      id: Math.random().toString(36).substr(2, 9),
      appliedDate: new Date().toISOString(),
      rounds: []
    };
    jobs.unshift(newJob); // Add to top
    saveDB(jobs);
    return newJob;
  },

  updateStatus: async (id: string, status: JobStatus): Promise<void> => {
    await delay(200);
    const jobs = loadDB();
    const index = jobs.findIndex(j => j.id === id);
    if (index !== -1) {
      jobs[index].status = status;
      saveDB(jobs);
    }
  },

  addRound: async (jobId: string, round: Omit<InterviewRound, 'id' | 'jobId'>): Promise<InterviewRound> => {
    await delay(300);
    const jobs = loadDB();
    const index = jobs.findIndex(j => j.id === jobId);
    if (index !== -1) {
      const newRound: InterviewRound = {
        ...round,
        id: Math.random().toString(36).substr(2, 9),
        jobId
      };
      // Ensure rounds array exists
      if (!jobs[index].rounds) jobs[index].rounds = [];
      jobs[index].rounds.push(newRound);
      saveDB(jobs);
      return newRound;
    }
    throw new Error("Job not found");
  }
};