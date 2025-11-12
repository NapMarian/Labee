export enum UserType {
  CANDIDATE = 'CANDIDATE',
  RECRUITER = 'RECRUITER',
}

export enum WorkType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  FREELANCE = 'FREELANCE',
  INTERNSHIP = 'INTERNSHIP',
}

export enum JobCategory {
  TECHNOLOGY = 'TECHNOLOGY',
  SALES = 'SALES',
  ADMINISTRATION = 'ADMINISTRATION',
  MARKETING = 'MARKETING',
  DESIGN = 'DESIGN',
  FINANCE = 'FINANCE',
  HR = 'HR',
  OPERATIONS = 'OPERATIONS',
  HEALTHCARE = 'HEALTHCARE',
  EDUCATION = 'EDUCATION',
  CONSTRUCTION = 'CONSTRUCTION',
  HOSPITALITY = 'HOSPITALITY',
  MANUFACTURING = 'MANUFACTURING',
  LOGISTICS = 'LOGISTICS',
  LEGAL = 'LEGAL',
  MEDIA = 'MEDIA',
  OTHER = 'OTHER',
}

export interface User {
  id: string;
  email: string;
  userType: UserType;
  verified: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  profile?: Profile;
}

export interface Profile {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  bio?: string;
  location?: string;
  phone?: string;
  skills: string[];
  experience?: Experience[];
  education?: Education[];
  resume?: string;
  workTypes: WorkType[];
  categories: JobCategory[];
  yearsExperience?: number;
  companyName?: string;
  companyLogo?: string;
  companyWebsite?: string;
  position?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  company: string;
  position: string;
  years?: number;
  period?: string;
  description?: string;
}

export interface Education {
  degree: string;
  institution: string;
  year?: string;
}

export interface JobOffer {
  id: string;
  recruiterId: string;
  title: string;
  description: string;
  requirements: string[];
  workType: WorkType;
  category: JobCategory;
  location?: string;
  remote: boolean;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  salaryRange?: string;
  requiredSkills?: string[];
  benefits?: string[];
  companyName?: string;
  companyVisible: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  recruiter?: User;
}

export interface Match {
  id: string;
  user1Id: string;
  user2Id: string;
  jobOfferId?: string;
  active: boolean;
  createdAt: string;
  user1?: User;
  user2?: User;
  jobOffer?: JobOffer;
  messages?: Message[];
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  read: boolean;
  createdAt: string;
  sender?: User;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}
