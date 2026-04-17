export interface Subtask {
  text: string;
  done: boolean;
}

export interface DailyTask {
  id: string;
  startTime: string;
  endTime: string;
  title: string;
  category: string;
  note: string;
  subtasks: Subtask[];
  done: boolean;
  linkedGoalId?: number;
  /** ISO date string for which day this task is assigned */
  assignedDate?: string;
}

export interface Goal {
  id: number;
  time: string;
  icon: string;
  title: string;
  category: string;
  startDate: string;
  dueDate: string;
  target: string;
  status: 'Active' | 'Done';
  progress: string;
  createdAt: number;
  completedAt?: number;
  description?: string;
}

export interface Milestone {
  text: string;
  done: boolean;
}

export interface Phase {
  id: string;
  name: string;
  timeframe: string;
  status: 'done' | 'active' | 'upcoming';
  milestones: Milestone[];
  keyActions: string;
  risks: string;
}

export interface StrategyPlan {
  goalId: number;
  goalTitle: string;
  phases: Phase[];
}

export interface HelpItem {
  q: string;
  a: string;
}

export interface SettingsForm {
  name: string;
  email: string;
  notifications: boolean;
  darkMode: boolean;
  language: string;
}

export interface NewGoalForm {
  name: string;
  startDate: string;
  dueDate: string;
  target: string;
  description: string;
}

export interface NewTaskForm {
  title: string;
  startTime: string;
  endTime: string;
  category: string;
  note: string;
  linkedGoalId?: number;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export interface ActivityLogEntry {
  id: string;
  type: 'goal_created' | 'goal_completed' | 'goal_deleted' | 'task_completed' | 'task_created' | 'milestone_completed' | 'subtask_completed';
  goalId?: number;
  taskId?: string;
  timestamp: number;
  message: string;
  /** ISO date string YYYY-MM-DD */
  date: string;
}

export interface ScheduledEvent {
  id: string;
  title: string;
  date: string; // ISO date string YYYY-MM-DD
  startTime: string;
  endTime: string;
  color: string;
  description?: string;
  linkedGoalId?: number;
}

export type PageType = 'Goal Timeline' | 'Daily Routine' | 'Report' | 'Help center' | 'Strategy Planner' | 'Scheduling';
export type TimeframeType = 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';

export interface AppState {
  activePage: PageType;
  selectedGoal: Goal | null;
  isAddGoalModalOpen: boolean;
  searchQuery: string;
  newGoalForm: NewGoalForm;
  liveClock: string;
  liveDate: string;
  calMonth: number;
  calYear: number;
  dailyTasks: DailyTask[];
  editingTask: DailyTask | null;
  isAddTaskOpen: boolean;
  newTaskForm: NewTaskForm;
  planningGoal: StrategyPlan | null;
  strategyPlans: StrategyPlan[];
  openFaq: number | null;
  isSettingsOpen: boolean;
  settingsForm: SettingsForm;
  onProgressGoals: Goal[];
  doneGoals: Goal[];
  lastResetDate: string;
  reportTimeframe: TimeframeType;
  toasts: Toast[];
  activityLog: ActivityLogEntry[];
  scheduledEvents: ScheduledEvent[];
}

export interface AppContextType extends AppState {
  setActivePage: (page: PageType) => void;
  setSelectedGoal: (goal: Goal | null) => void;
  setIsAddGoalModalOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setNewGoalForm: React.Dispatch<React.SetStateAction<NewGoalForm>>;
  setCalMonth: (month: number) => void;
  setCalYear: (year: number) => void;
  setDailyTasks: React.Dispatch<React.SetStateAction<DailyTask[]>>;
  setEditingTask: (task: DailyTask | null) => void;
  setIsAddTaskOpen: (open: boolean) => void;
  setNewTaskForm: React.Dispatch<React.SetStateAction<NewTaskForm>>;
  setPlanningGoal: (plan: StrategyPlan | null) => void;
  setStrategyPlans: React.Dispatch<React.SetStateAction<StrategyPlan[]>>;
  setOpenFaq: (index: number | null) => void;
  setIsSettingsOpen: (open: boolean) => void;
  setSettingsForm: React.Dispatch<React.SetStateAction<SettingsForm>>;
  setOnProgressGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
  setDoneGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
  setLastResetDate: (date: string) => void;
  setReportTimeframe: (timeframe: TimeframeType) => void;
  handleAddGoalSubmit: (openPlanner: boolean) => void;
  handleMarkDone: (goalId: number) => void;
  handleDeleteGoal: (goalId: number) => void;
  handleSaveEditTask: () => void;
  handleDeleteTask: (id: string) => void;
  handleAddNewTask: () => void;
  handleEditGoal: (goalId: number, updates: Partial<Goal>) => void;
  addToast: (type: Toast['type'], message: string) => void;
  removeToast: (id: string) => void;
  computeGoalProgress: (goalId: number) => number;
  setActivityLog: React.Dispatch<React.SetStateAction<ActivityLogEntry[]>>;
  logActivity: (type: ActivityLogEntry['type'], message: string, goalId?: number, taskId?: string) => void;
  scheduledEvents: ScheduledEvent[];
  setScheduledEvents: React.Dispatch<React.SetStateAction<ScheduledEvent[]>>;
  handleAddEvent: (event: Omit<ScheduledEvent, 'id'>) => void;
  handleDeleteEvent: (id: string) => void;
  getGoalById: (id: number) => Goal | undefined;
}
