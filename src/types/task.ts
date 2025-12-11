export type TaskCategory = 
  | 'evangelism'
  | 'prayer'
  | 'bible_study'
  | 'meditation'
  | 'literature'
  | 'fellowship'
  | 'other';

// Sub-categories for each main category
export const SUB_CATEGORIES: Record<TaskCategory, string[]> = {
  evangelism: ['Street Evangelism', 'Door-to-Door', 'Campus Outreach', 'Hospital Visitation', 'Market Evangelism', 'One-on-One', 'Online Evangelism'],
  prayer: ['Personal Prayer', 'Intercession', 'Group Prayer', 'Night Vigil', 'Fasting Prayer', 'Warfare Prayer', 'Thanksgiving'],
  bible_study: ['Personal Study', 'Group Study', 'Bible School', 'Devotional', 'Topical Study', 'Book Study'],
  meditation: ['Scripture Meditation', 'Worship Meditation', 'Silent Meditation', 'Listening Prayer'],
  literature: ['Christian Books', 'Devotionals', 'Theology', 'Biography', 'Ministry Materials'],
  fellowship: ['Cell Meeting', 'Youth Fellowship', 'Sunday Service', 'Bible Study Group', 'Prayer Meeting', 'Outreach Team'],
  other: ['Ministry Work', 'Volunteer Service', 'Training', 'Other']
};

export interface SubCategoryTime {
  subCategory: string;
  duration: number; // in seconds
}

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
  subCategory?: string; // which sub-category this session was for
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
  
  // Sub-category tracking
  currentSubCategory?: string; // currently active sub-category
  customSubCategories?: string[]; // user-created sub-categories for this task
  subCategoryBreakdown?: SubCategoryTime[]; // time spent in each sub-category
  
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
