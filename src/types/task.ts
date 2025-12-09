export type TaskCategory = 
  | 'evangelism'
  | 'prayer'
  | 'bible_study'
  | 'meditation'
  | 'literature'
  | 'fellowship'
  | 'other';

export interface EvangelismDetails {
  tractsShared: number;
  peoplePrayed: number;
  repentances: number;
  invitations: number;
  location: string;
}

export interface PrayerDetails {
  prayerType: 'personal' | 'group' | 'intercession';
  prayerPoints: string[];
}

export interface BibleStudyDetails {
  chaptersRead: number;
  book: string;
  notes: string;
}

export interface MeditationDetails {
  scripture: string;
  revelation: string;
}

export interface LiteratureDetails {
  title: string;
  author: string;
  pagesRead: number;
}

export interface TaskSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in seconds
}

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  description?: string;
  location?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  sessions: TaskSession[];
  totalTime: number; // in seconds
  isActive: boolean;
  currentSessionStart?: Date;
  
  // Category-specific details
  evangelismDetails?: EvangelismDetails;
  prayerDetails?: PrayerDetails;
  bibleStudyDetails?: BibleStudyDetails;
  meditationDetails?: MeditationDetails;
  literatureDetails?: LiteratureDetails;
}

export interface DailySummary {
  date: Date;
  tasks: Task[];
  totalTime: number;
  categoryBreakdown: Record<TaskCategory, number>;
}

export interface WeeklySummary {
  weekStart: Date;
  weekEnd: Date;
  dailySummaries: DailySummary[];
  totalTime: number;
  categoryBreakdown: Record<TaskCategory, number>;
}
