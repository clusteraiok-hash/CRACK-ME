import React, { createContext, useContext, useCallback, useMemo } from 'react';
import type { AppContextType, Goal, DailyTask, StrategyPlan, PageType, TimeframeType, Toast, ActivityLogEntry, ScheduledEvent } from '@/types';
import { useLocalStorage, useClock } from '@/hooks';
import {
  GOAL_ICONS,
  DEFAULT_SETTINGS,
  DEFAULT_NEW_GOAL_FORM,
  DEFAULT_NEW_TASK_FORM,
  STORAGE_KEYS,
} from '@/constants';
import {
  INITIAL_DAILY_TASKS,
  INITIAL_ON_PROGRESS_GOALS,
  INITIAL_DONE_GOALS,
  INITIAL_STRATEGY_PLANS,
} from '@/constants/initialData';
import { getISTTime } from '@/utils/dateUtils';

const AppContext = createContext<AppContextType | null>(null);

interface AppProviderProps {
  children: React.ReactNode;
}

/** Get today's date as YYYY-MM-DD in IST */
function getTodayIST(): string {
  const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function AppProvider({ children }: AppProviderProps) {
  const { time: liveClock, date: liveDate } = useClock();

  const [activePage, setActivePageState] = React.useState<PageType>('Goal Timeline');
  const [selectedGoal, setSelectedGoal] = React.useState<Goal | null>(null);
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [newGoalForm, setNewGoalForm] = React.useState(DEFAULT_NEW_GOAL_FORM);

  const [calMonth, setCalMonth] = React.useState(() => new Date().getMonth());
  const [calYear, setCalYear] = React.useState(() => new Date().getFullYear());

  const [dailyTasks, setDailyTasks] = useLocalStorage<DailyTask[]>(
    STORAGE_KEYS.DAILY_TASKS,
    INITIAL_DAILY_TASKS
  );
  const [editingTask, setEditingTask] = React.useState<DailyTask | null>(null);
  const [isAddTaskOpen, setIsAddTaskOpen] = React.useState(false);
  const [newTaskForm, setNewTaskForm] = React.useState(DEFAULT_NEW_TASK_FORM);

  const [planningGoal, setPlanningGoal] = React.useState<StrategyPlan | null>(null);
  const [strategyPlans, setStrategyPlans] = useLocalStorage<StrategyPlan[]>(
    STORAGE_KEYS.STRATEGY_PLANS,
    INITIAL_STRATEGY_PLANS
  );

  const [openFaq, setOpenFaq] = React.useState<number | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [settingsForm, setSettingsForm] = useLocalStorage(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  );

  const [onProgressGoals, setOnProgressGoals] = useLocalStorage<Goal[]>(
    STORAGE_KEYS.ON_PROGRESS_GOALS,
    INITIAL_ON_PROGRESS_GOALS
  );
  const [doneGoals, setDoneGoals] = useLocalStorage<Goal[]>(
    STORAGE_KEYS.DONE_GOALS,
    INITIAL_DONE_GOALS
  );
  const [reportTimeframe, setReportTimeframe] = React.useState<TimeframeType>('Weekly');

  // Toast notifications
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  // Activity log for reports
  const [activityLog, setActivityLog] = useLocalStorage<ActivityLogEntry[]>(
    STORAGE_KEYS.ACTIVITY_LOG,
    []
  );

  // Scheduled events
  const [scheduledEvents, setScheduledEvents] = useLocalStorage<ScheduledEvent[]>(
    STORAGE_KEYS.SCHEDULED_EVENTS,
    []
  );

  // Daily reset: persist last reset date to localStorage
  const [lastResetDate, setLastResetDate] = useLocalStorage<string>(
    STORAGE_KEYS.LAST_RESET_DATE,
    getTodayIST()
  );

  // ─── Daily Reset Effect ──────────────────────────────────────────
  // Every day at midnight (IST), reset all daily tasks and subtasks to unchecked
  React.useEffect(() => {
    const todayIST = getTodayIST();
    if (todayIST !== lastResetDate) {
      setDailyTasks((prev) =>
        prev.map((task) => ({
          ...task,
          done: false,
          subtasks: task.subtasks.map((sub) => ({ ...sub, done: false })),
        }))
      );
      setLastResetDate(todayIST);
    }
  }, [lastResetDate, setDailyTasks, setLastResetDate]);

  // Check every 30 seconds for date change
  React.useEffect(() => {
    const interval = setInterval(() => {
      const todayIST = getTodayIST();
      if (todayIST !== lastResetDate) {
        setDailyTasks((prev) =>
          prev.map((task) => ({
            ...task,
            done: false,
            subtasks: task.subtasks.map((sub) => ({ ...sub, done: false })),
          }))
        );
        setLastResetDate(todayIST);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [lastResetDate, setDailyTasks, setLastResetDate]);

  // ─── Dark mode effect — FORCE LIGHT ──────────────────────────────
  React.useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  // ─── Toast helpers ───────────────────────────────────────────────
  const addToast = useCallback((type: Toast['type'], message: string) => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
    const toast: Toast = { id, type, message, duration: 3500 };
    setToasts(prev => [...prev, toast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, toast.duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // ─── Activity log helper ─────────────────────────────────────────
  const logActivity = useCallback(
    (type: ActivityLogEntry['type'], message: string, goalId?: number, taskId?: string) => {
      const entry: ActivityLogEntry = {
        id: 'log_' + Date.now(),
        type,
        goalId,
        taskId,
        timestamp: Date.now(),
        message,
        date: getTodayIST(),
      };
      setActivityLog(prev => [entry, ...prev]);
    },
    [setActivityLog]
  );

  // ─── Get goal by ID ──────────────────────────────────────────────
  const getGoalById = useCallback(
    (id: number): Goal | undefined => {
      return onProgressGoals.find(g => g.id === id) || doneGoals.find(g => g.id === id);
    },
    [onProgressGoals, doneGoals]
  );

  // ─── Compute goal progress from milestones + linked tasks ────────
  const computeGoalProgress = useCallback(
    (goalId: number): number => {
      const plan = strategyPlans.find(sp => sp.goalId === goalId);
      const linkedTasks = dailyTasks.filter(t => t.linkedGoalId === goalId);

      let totalItems = 0;
      let doneItems = 0;

      // Count milestones
      if (plan) {
        plan.phases.forEach(phase => {
          phase.milestones.forEach(m => {
            totalItems++;
            if (m.done) doneItems++;
          });
        });
      }

      // Count linked tasks
      linkedTasks.forEach(task => {
        totalItems++;
        if (task.done) doneItems++;
      });

      if (totalItems === 0) return 0;
      return Math.round((doneItems / totalItems) * 100);
    },
    [strategyPlans, dailyTasks]
  );

  // ─── Navigation ──────────────────────────────────────────────────
  const setActivePage = useCallback((page: PageType) => {
    setActivePageState(page);
    setSelectedGoal(null);
    setSearchQuery('');
  }, []);

  // ─── Add Goal ────────────────────────────────────────────────────
  const handleAddGoalSubmit = useCallback(
    (openPlanner: boolean) => {
      const newEntry: Goal = {
        id: Date.now(),
        time: getISTTime(),
        icon: GOAL_ICONS[Math.floor(Math.random() * GOAL_ICONS.length)],
        title: newGoalForm.name || 'Untitled Goal',
        category: 'Custom',
        startDate: newGoalForm.startDate || 'N/A',
        dueDate: newGoalForm.dueDate || 'N/A',
        target: newGoalForm.target || 'N/A',
        status: 'Active',
        progress: '0%',
        createdAt: Date.now(),
        description: newGoalForm.description || '',
      };

      setOnProgressGoals((prev) => [newEntry, ...prev]);
      setIsAddGoalModalOpen(false);
      setNewGoalForm(DEFAULT_NEW_GOAL_FORM);
      addToast('success', `Goal "${newEntry.title}" created successfully!`);
      logActivity('goal_created', `Created goal: ${newEntry.title}`, newEntry.id);

      if (openPlanner) {
        const newPlan: StrategyPlan = {
          goalId: newEntry.id,
          goalTitle: newEntry.title,
          phases: [
            {
              id: 'np1',
              name: 'Phase 1 — Research & Planning',
              timeframe: 'Week 1',
              status: 'active',
              milestones: [
                { text: 'Define clear objectives', done: false },
                { text: 'Research best approaches', done: false },
              ],
              keyActions: 'Brainstorm, gather resources',
              risks: 'Unclear requirements',
            },
            {
              id: 'np2',
              name: 'Phase 2 — Execution',
              timeframe: 'Week 2-3',
              status: 'upcoming',
              milestones: [
                { text: 'Start core work', done: false },
                { text: 'Track daily progress', done: false },
              ],
              keyActions: 'Daily focused work sessions',
              risks: 'Losing momentum',
            },
            {
              id: 'np3',
              name: 'Phase 3 — Review & Complete',
              timeframe: 'Week 4',
              status: 'upcoming',
              milestones: [
                { text: 'Review results', done: false },
                { text: 'Final adjustments', done: false },
              ],
              keyActions: 'Evaluate and iterate',
              risks: 'Last-minute changes',
            },
          ],
        };
        setStrategyPlans((prev) => [...prev, newPlan]);
        setPlanningGoal(newPlan);
        setActivePage('Strategy Planner');
      }
    },
    [newGoalForm, setOnProgressGoals, setStrategyPlans, setActivePage, addToast, logActivity]
  );

  // ─── Mark Goal Done ──────────────────────────────────────────────
  const handleMarkDone = useCallback(
    (goalId: number) => {
      const goal = onProgressGoals.find((g) => g.id === goalId);
      if (!goal) return;

      setOnProgressGoals((prev) => prev.filter((g) => g.id !== goalId));
      setDoneGoals((prev) => [{ ...goal, status: 'Done', progress: '100%', completedAt: Date.now() }, ...prev]);
      if (selectedGoal?.id === goalId) setSelectedGoal(null);
      addToast('success', `Goal "${goal.title}" marked as done! 🎉`);
      logActivity('goal_completed', `Completed goal: ${goal.title}`, goalId);
    },
    [onProgressGoals, selectedGoal, setOnProgressGoals, setDoneGoals, addToast, logActivity]
  );

  // ─── Delete Goal ─────────────────────────────────────────────────
  const handleDeleteGoal = useCallback(
    (goalId: number) => {
      const goal = onProgressGoals.find(g => g.id === goalId) || doneGoals.find(g => g.id === goalId);
      setOnProgressGoals((prev) => prev.filter((g) => g.id !== goalId));
      setDoneGoals((prev) => prev.filter((g) => g.id !== goalId));
      setStrategyPlans((prev) => prev.filter((sp) => sp.goalId !== goalId));
      if (selectedGoal?.id === goalId) setSelectedGoal(null);
      addToast('info', `Goal "${goal?.title || 'Unknown'}" deleted.`);
      logActivity('goal_deleted', `Deleted goal: ${goal?.title || 'Unknown'}`, goalId);
    },
    [selectedGoal, setOnProgressGoals, setDoneGoals, setStrategyPlans, onProgressGoals, doneGoals, addToast, logActivity]
  );

  // ─── Edit Goal ───────────────────────────────────────────────────
  const handleEditGoal = useCallback(
    (goalId: number, updates: Partial<Goal>) => {
      setOnProgressGoals((prev) =>
        prev.map((g) => (g.id === goalId ? { ...g, ...updates } : g))
      );
      setDoneGoals((prev) =>
        prev.map((g) => (g.id === goalId ? { ...g, ...updates } : g))
      );
      // Update selected goal if it's the one being edited
      if (selectedGoal?.id === goalId) {
        setSelectedGoal({ ...selectedGoal, ...updates } as Goal);
      }
      addToast('success', 'Goal updated successfully!');
    },
    [selectedGoal, setOnProgressGoals, setDoneGoals, addToast]
  );

  // ─── Save Edited Task (FIXED: immutable update) ──────────────────
  const handleSaveEditTask = useCallback(() => {
    if (!editingTask) return;
    setDailyTasks((prev) =>
      prev.map((t) => (t.id === editingTask.id ? { ...editingTask } : t))
    );
    setEditingTask(null);
    addToast('success', 'Task updated successfully!');
  }, [editingTask, setDailyTasks, addToast]);

  // ─── Delete Task ─────────────────────────────────────────────────
  const handleDeleteTask = useCallback(
    (id: string) => {
      setDailyTasks((prev) => prev.filter((t) => t.id !== id));
      setEditingTask(null);
      addToast('info', 'Task deleted.');
    },
    [setDailyTasks, addToast]
  );

  // ─── Add New Task ────────────────────────────────────────────────
  const handleAddNewTask = useCallback(() => {
    const newTask: DailyTask = {
      id: 'dt' + Date.now(),
      startTime: newTaskForm.startTime || '09:00',
      endTime: newTaskForm.endTime || '10:00',
      title: newTaskForm.title || 'New Task',
      category: newTaskForm.category,
      note: newTaskForm.note || '',
      subtasks: [],
      done: false,
      linkedGoalId: newTaskForm.linkedGoalId,
      assignedDate: getTodayIST(),
    };
    setDailyTasks((prev) => [...prev, newTask]);
    setIsAddTaskOpen(false);
    setNewTaskForm(DEFAULT_NEW_TASK_FORM);
    addToast('success', `Task "${newTask.title}" added!`);
    logActivity('task_created', `Created task: ${newTask.title}`, newTask.linkedGoalId, newTask.id);
  }, [newTaskForm, setDailyTasks, addToast, logActivity]);

  // ─── Scheduled Events ────────────────────────────────────────────
  const handleAddEvent = useCallback(
    (event: Omit<ScheduledEvent, 'id'>) => {
      const newEvent: ScheduledEvent = {
        ...event,
        id: 'evt_' + Date.now(),
      };
      setScheduledEvents(prev => [...prev, newEvent]);
      addToast('success', `Event "${newEvent.title}" scheduled!`);
    },
    [setScheduledEvents, addToast]
  );

  const handleDeleteEvent = useCallback(
    (id: string) => {
      setScheduledEvents(prev => prev.filter(e => e.id !== id));
      addToast('info', 'Event removed.');
    },
    [setScheduledEvents, addToast]
  );

  // ─── Sync goal progress whenever milestones/tasks change ─────────
  React.useEffect(() => {
    setOnProgressGoals(prev =>
      prev.map(goal => {
        const newPct = computeGoalProgress(goal.id);
        const newProgress = `${newPct}%`;
        if (goal.progress !== newProgress) {
          return { ...goal, progress: newProgress };
        }
        return goal;
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strategyPlans, dailyTasks]);

  const value = useMemo<AppContextType>(
    () => ({
      activePage,
      selectedGoal,
      isAddGoalModalOpen,
      searchQuery,
      newGoalForm,
      liveClock,
      liveDate,
      calMonth,
      calYear,
      dailyTasks,
      editingTask,
      isAddTaskOpen,
      newTaskForm,
      planningGoal,
      strategyPlans,
      openFaq,
      isSettingsOpen,
      settingsForm,
      onProgressGoals,
      doneGoals,
      lastResetDate,
      setActivePage,
      setSelectedGoal,
      setIsAddGoalModalOpen,
      setSearchQuery,
      setNewGoalForm,
      setCalMonth,
      setCalYear,
      setDailyTasks,
      setEditingTask,
      setIsAddTaskOpen,
      setNewTaskForm,
      setPlanningGoal,
      setStrategyPlans,
      setOpenFaq,
      setIsSettingsOpen,
      setSettingsForm,
      setOnProgressGoals,
      setDoneGoals,
      setLastResetDate,
      handleAddGoalSubmit,
      handleMarkDone,
      handleDeleteGoal,
      handleSaveEditTask,
      handleDeleteTask,
      handleAddNewTask,
      handleEditGoal,
      setReportTimeframe,
      reportTimeframe,
      toasts,
      addToast,
      removeToast,
      activityLog,
      setActivityLog,
      logActivity,
      computeGoalProgress,
      scheduledEvents,
      setScheduledEvents,
      handleAddEvent,
      handleDeleteEvent,
      getGoalById,
    }),
    [
      activePage,
      selectedGoal,
      isAddGoalModalOpen,
      searchQuery,
      newGoalForm,
      liveClock,
      liveDate,
      calMonth,
      calYear,
      dailyTasks,
      editingTask,
      isAddTaskOpen,
      newTaskForm,
      planningGoal,
      strategyPlans,
      openFaq,
      isSettingsOpen,
      settingsForm,
      onProgressGoals,
      doneGoals,
      lastResetDate,
      reportTimeframe,
      toasts,
      activityLog,
      scheduledEvents,
      setActivePage,
      handleAddGoalSubmit,
      handleMarkDone,
      handleDeleteGoal,
      handleSaveEditTask,
      handleDeleteTask,
      handleAddNewTask,
      handleEditGoal,
      addToast,
      removeToast,
      logActivity,
      computeGoalProgress,
      handleAddEvent,
      handleDeleteEvent,
      getGoalById,
      setDailyTasks,
      setDoneGoals,
      setOnProgressGoals,
      setSettingsForm,
      setStrategyPlans,
      setActivityLog,
      setScheduledEvents,
      setLastResetDate,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
