export const NAV_ICONS: Record<string, string> = {
  'Goal Timeline': 'solar:chart-2-linear',
  'Daily Routine': 'solar:sun-2-linear',
  'Scheduling': 'solar:calendar-date-linear',
  'Strategy Planner': 'solar:routing-2-linear',
  'Report': 'solar:document-text-linear',
  'Help center': 'solar:question-circle-linear',
};

export const CATEGORY_ICONS: Record<string, string> = {
  'Wellness': 'solar:heart-pulse-linear',
  'Fitness': 'solar:running-2-linear',
  'Work': 'solar:case-linear',
  'Development': 'solar:code-linear',
  'Health': 'solar:heart-pulse-linear',
  'Learning': 'solar:book-2-linear',
  'Social media': 'simple-icons:instagram',
  'Finance': 'solar:wallet-money-linear',
  'Personal': 'solar:user-circle-linear',
  'Design': 'solar:palette-2-linear',
  'Marketing': 'solar:letter-linear',
  'Meeting': 'solar:users-group-rounded-linear',
  'Food': 'solar:cup-hot-linear',
  'Creative': 'solar:pen-new-square-linear',
  'Sports': 'solar:running-2-linear',
  'Music': 'solar:music-note-2-linear',
  'Travel': 'solar:globe-linear',
  'Shopping': 'solar:bag-2-linear',
  'Home': 'solar:home-2-linear',
  'Family': 'solar:users-group-rounded-linear',
  'Hobbies': 'solar:gamepad-linear',
  'Cleaning': 'solar:bath-linear',
  'Focus': 'solar:target-linear',
  'Rest': 'solar:sleeping-linear',
  'Planning': 'solar:notes-linear',
  'Reading': 'solar:book-linear',
  'Custom': 'solar:target-linear',
};

export const CATEGORY_LIST = Object.keys(CATEGORY_ICONS);

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export const NAV_LINKS = ['Goal Timeline', 'Daily Routine', 'Scheduling', 'Strategy Planner', 'Report', 'Help center'] as const;

export const GOAL_ICONS = [
  'solar:target-linear',
  'solar:star-linear',
  'solar:flag-linear',
  'solar:rocket-2-linear',
  'solar:cup-star-linear',
];

export const STATUS_COLORS = {
  done: 'bg-[#bef445] text-gray-900',
  active: 'bg-[#1b1b1b] text-white',
  upcoming: 'bg-gray-100 text-gray-500',
};

export const DEFAULT_SETTINGS = {
  name: 'Arriva Elma',
  email: 'arriva@keepsgoal.com',
  notifications: true,
  darkMode: false,
  language: 'English',
};

export const DEFAULT_NEW_GOAL_FORM = {
  name: '',
  startDate: '',
  dueDate: '',
  target: '',
  description: '',
};

export const DEFAULT_NEW_TASK_FORM: { title: string; startTime: string; endTime: string; category: string; note: string; linkedGoalId?: number } = {
  title: '',
  startTime: '',
  endTime: '',
  category: 'Work',
  note: '',
};

export const STORAGE_KEYS = {
  DAILY_TASKS: 'sgoal_daily_tasks',
  ON_PROGRESS_GOALS: 'sgoal_on_progress_goals',
  DONE_GOALS: 'sgoal_done_goals',
  STRATEGY_PLANS: 'sgoal_strategy_plans',
  SETTINGS: 'sgoal_settings',
  ACTIVITY_LOG: 'sgoal_activity_log',
  SCHEDULED_EVENTS: 'sgoal_scheduled_events',
  LAST_RESET_DATE: 'sgoal_last_reset_date',
} as const;
