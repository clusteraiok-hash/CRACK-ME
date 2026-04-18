import React, { createContext, useContext, useCallback, useMemo, useEffect } from 'react';
import type { AppContextType, Goal, DailyTask, StrategyPlan, PageType, TimeframeType, Toast, ActivityLogEntry, ScheduledEvent, NewTaskForm } from '@/types';
import { useLocalStorage, useClock } from '@/hooks';
import { supabase } from '@/lib/supabase';
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

function getTodayIST(): string {
  const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Safe wrapper for Supabase calls — logs errors and optionally shows a toast */
function handleSupabaseError(
  promise: PromiseLike<{ error: unknown }>,
  toastFn?: (type: Toast['type'], msg: string) => void
) {
  Promise.resolve(promise).then(({ error }) => {
    if (error) {
      console.error('Supabase sync error:', error);
      toastFn?.('error', 'Sync failed — changes saved locally only.');
    }
  }).catch((err) => {
    console.error('Supabase network error:', err);
  });
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

  const [dailyTasks, setDailyTasks] = useLocalStorage<DailyTask[]>(STORAGE_KEYS.DAILY_TASKS, INITIAL_DAILY_TASKS);
  const [editingTask, setEditingTask] = React.useState<DailyTask | null>(null);
  const [isAddTaskOpen, setIsAddTaskOpen] = React.useState(false);
  const [newTaskForm, setNewTaskForm] = React.useState(DEFAULT_NEW_TASK_FORM);

  const [planningGoal, setPlanningGoal] = React.useState<StrategyPlan | null>(null);
  const [strategyPlans, setStrategyPlans] = useLocalStorage<StrategyPlan[]>(STORAGE_KEYS.STRATEGY_PLANS, INITIAL_STRATEGY_PLANS);

  const [openFaq, setOpenFaq] = React.useState<number | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [settingsForm, setSettingsForm] = useLocalStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);

  const [onProgressGoals, setOnProgressGoals] = useLocalStorage<Goal[]>(STORAGE_KEYS.ON_PROGRESS_GOALS, INITIAL_ON_PROGRESS_GOALS);
  const [doneGoals, setDoneGoals] = useLocalStorage<Goal[]>(STORAGE_KEYS.DONE_GOALS, INITIAL_DONE_GOALS);
  const [reportTimeframe, setReportTimeframe] = React.useState<TimeframeType>('Weekly');

  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const [activityLog, setActivityLog] = useLocalStorage<ActivityLogEntry[]>(STORAGE_KEYS.ACTIVITY_LOG, []);
  const [scheduledEvents, setScheduledEvents] = useLocalStorage<ScheduledEvent[]>(STORAGE_KEYS.SCHEDULED_EVENTS, []);

  const [lastResetDate, setLastResetDate] = useLocalStorage<string>(STORAGE_KEYS.LAST_RESET_DATE, getTodayIST());

  const addToast = useCallback((type: Toast['type'], message: string) => {
    const id = crypto.randomUUID();
    const toast: Toast = { id, type, message, duration: 3500 };
    setToasts(prev => [...prev, toast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, toast.duration);
  }, []);

  // Supabase Hydration Effect
  useEffect(() => {
    const fetchSupabaseData = async () => {
      try {
        const today = getTodayIST();
        
        const [goalsRes, tasksRes, plansRes, logsRes, eventsRes, templatesRes] = await Promise.all([
          supabase.from('goals').select('*'),
          supabase.from('daily_tasks').select('*'),
          supabase.from('strategy_plans').select('*'),
          supabase.from('activity_log').select('*'),
          supabase.from('scheduled_events').select('*'),
          supabase.from('daily_routine_templates').select('*')
        ]);

        if (goalsRes.data) {
          setOnProgressGoals(goalsRes.data.filter(g => g.status === 'Active'));
          setDoneGoals(goalsRes.data.filter(g => g.status === 'Done'));
        }
        
        if (plansRes.data) setStrategyPlans(plansRes.data);
        if (logsRes.data) setActivityLog(logsRes.data.sort((a,b) => b.timestamp - a.timestamp));
        if (eventsRes.data) setScheduledEvents(eventsRes.data);

        // DAILY RESET / SEEDING LOGIC
        if (tasksRes.data && tasksRes.data.length > 0) {
          setDailyTasks(tasksRes.data);
        } else if (templatesRes.data && templatesRes.data.length > 0) {
          const newTasks = templatesRes.data.map(t => ({
            ...t,
            id: crypto.randomUUID(),
            done: false,
            assignedDate: today,
            subtasks: t.subtasks?.map((s: any) => ({ ...s, done: false })) || []
          }));
          
          setDailyTasks(newTasks);
          handleSupabaseError(supabase.from('daily_tasks').insert(newTasks), addToast);
          addToast('info', 'Your daily routine has been refreshed for today!');
        }
        
        setLastResetDate(today);

      } catch (err) {
        console.error("Error fetching data from Supabase", err);
      }
    };

    fetchSupabaseData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Daily Check Effect — re-hydrate without page reload
  useEffect(() => {
    const checkDate = async () => {
      const today = getTodayIST();
      if (today !== lastResetDate) {
        setLastResetDate(today);
        // Re-fetch tasks for the new day
        try {
          const [tasksRes, templatesRes] = await Promise.all([
            supabase.from('daily_tasks').select('*'),
            supabase.from('daily_routine_templates').select('*')
          ]);

          if (tasksRes.data && tasksRes.data.length > 0) {
            setDailyTasks(tasksRes.data);
          } else if (templatesRes.data && templatesRes.data.length > 0) {
            const newTasks = templatesRes.data.map(t => ({
              ...t,
              id: crypto.randomUUID(),
              done: false,
              assignedDate: today,
              subtasks: t.subtasks?.map((s: any) => ({ ...s, done: false })) || []
            }));
            setDailyTasks(newTasks);
            handleSupabaseError(supabase.from('daily_tasks').insert(newTasks), addToast);
            addToast('info', 'New day! Your daily routine has been refreshed.');
          }
        } catch (err) {
          console.error('Daily reset error:', err);
        }
      }
    };
    const interval = setInterval(checkDate, 60000);
    return () => clearInterval(interval);
  }, [lastResetDate, setLastResetDate, setDailyTasks, addToast]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const logActivity = useCallback(
    async (type: ActivityLogEntry['type'], message: string, goalId?: number, taskId?: string) => {
      const entry: ActivityLogEntry = {
        id: crypto.randomUUID(),
        type,
        goalId,
        taskId,
        timestamp: Date.now(),
        message,
        date: getTodayIST(),
      };
      setActivityLog(prev => [entry, ...prev]);
      handleSupabaseError(supabase.from('activity_log').insert(entry), addToast);
    },
    [setActivityLog, addToast]
  );

  const getGoalById = useCallback(
    (id: number): Goal | undefined => {
      return onProgressGoals.find(g => g.id === id) || doneGoals.find(g => g.id === id);
    },
    [onProgressGoals, doneGoals]
  );

  const computeGoalProgress = useCallback(
    (goalId: number): number => {
      const plan = strategyPlans.find(sp => sp.goalId === goalId);
      const linkedTasks = dailyTasks.filter(t => t.linkedGoalId === goalId);

      let totalItems = 0;
      let doneItems = 0;

      if (plan) {
        plan.phases.forEach(phase => {
          phase.milestones.forEach(m => {
            totalItems++;
            if (m.done) doneItems++;
          });
        });
      }

      linkedTasks.forEach(task => {
        totalItems++;
        if (task.done) doneItems++;
      });

      if (totalItems === 0) return 0;
      return Math.round((doneItems / totalItems) * 100);
    },
    [strategyPlans, dailyTasks]
  );

  const setActivePage = useCallback((page: PageType) => {
    setActivePageState(page);
    setSelectedGoal(null);
    setSearchQuery('');
  }, []);

  const handleAddGoalSubmit = useCallback(
    async (openPlanner: boolean) => {
      const newId = Date.now();
      const newEntry: Goal = {
        id: newId,
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
      handleSupabaseError(supabase.from('goals').insert(newEntry), addToast);

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
              id: crypto.randomUUID(),
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
              id: crypto.randomUUID(),
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
          ],
        };
        setStrategyPlans((prev) => [...prev, newPlan]);
        handleSupabaseError(supabase.from('strategy_plans').insert(newPlan), addToast);

        setPlanningGoal(newPlan);
        setActivePage('Strategy Planner');
      }
    },
    [newGoalForm, setOnProgressGoals, setStrategyPlans, setActivePage, addToast, logActivity]
  );

  const handleMarkDone = useCallback(
    async (goalId: number) => {
      const goal = onProgressGoals.find((g) => g.id === goalId);
      if (!goal) return;

      setOnProgressGoals((prev) => prev.filter((g) => g.id !== goalId));
      setDoneGoals((prev) => [{ ...goal, status: 'Done', progress: '100%', completedAt: Date.now() }, ...prev]);
      if (selectedGoal?.id === goalId) setSelectedGoal(null);
      
      addToast('success', `Goal "${goal.title}" marked as done! 🎉`);
      logActivity('goal_completed', `Completed goal: ${goal.title}`, goalId);

      handleSupabaseError(
        supabase.from('goals').update({ status: 'Done', progress: '100%', completedAt: Date.now() }).eq('id', goalId),
        addToast
      );
    },
    [onProgressGoals, selectedGoal, setOnProgressGoals, setDoneGoals, addToast, logActivity]
  );

  const handleDeleteGoal = useCallback(
    async (goalId: number) => {
      const goal = onProgressGoals.find(g => g.id === goalId) || doneGoals.find(g => g.id === goalId);
      setOnProgressGoals((prev) => prev.filter((g) => g.id !== goalId));
      setDoneGoals((prev) => prev.filter((g) => g.id !== goalId));
      setStrategyPlans((prev) => prev.filter((sp) => sp.goalId !== goalId));
      if (selectedGoal?.id === goalId) setSelectedGoal(null);
      addToast('info', `Goal "${goal?.title || 'Unknown'}" deleted.`);
      logActivity('goal_deleted', `Deleted goal: ${goal?.title || 'Unknown'}`, goalId);

      handleSupabaseError(supabase.from('goals').delete().eq('id', goalId), addToast);
    },
    [selectedGoal, setOnProgressGoals, setDoneGoals, setStrategyPlans, onProgressGoals, doneGoals, addToast, logActivity]
  );

  const handleEditGoal = useCallback(
    async (goalId: number, updates: Partial<Goal>) => {
      setOnProgressGoals((prev) => prev.map((g) => (g.id === goalId ? { ...g, ...updates } : g)));
      setDoneGoals((prev) => prev.map((g) => (g.id === goalId ? { ...g, ...updates } : g)));
      
      if (selectedGoal?.id === goalId) {
        setSelectedGoal({ ...selectedGoal, ...updates } as Goal);
      }
      addToast('success', 'Goal updated successfully!');

      handleSupabaseError(supabase.from('goals').update(updates).eq('id', goalId), addToast);
    },
    [selectedGoal, setOnProgressGoals, setDoneGoals, addToast]
  );

  // Fixed: accepts task data directly to avoid stale state race condition
  const handleSaveEditTask = useCallback(
    async (taskData: DailyTask) => {
      setDailyTasks((prev) => prev.map((t) => (t.id === taskData.id ? { ...taskData } : t)));
      setEditingTask(null);
      addToast('success', 'Task updated successfully!');

      handleSupabaseError(supabase.from('daily_tasks').update(taskData).eq('id', taskData.id), addToast);
    },
    [setDailyTasks, addToast]
  );

  const handleDeleteTask = useCallback(
    async (id: string) => {
      setDailyTasks((prev) => prev.filter((t) => t.id !== id));
      setEditingTask(null);
      addToast('info', 'Task deleted.');

      handleSupabaseError(supabase.from('daily_tasks').delete().eq('id', id), addToast);
    },
    [setDailyTasks, addToast]
  );

  // Fixed: accepts form data directly to avoid stale state race condition
  const handleAddNewTask = useCallback(
    async (formData: NewTaskForm) => {
      const newTask: DailyTask = {
        id: crypto.randomUUID(),
        startTime: formData.startTime || '09:00',
        endTime: formData.endTime || '10:00',
        title: formData.title || 'New Task',
        category: formData.category,
        note: formData.note || '',
        subtasks: [],
        done: false,
        linkedGoalId: formData.linkedGoalId,
        assignedDate: getTodayIST(),
      };
      setDailyTasks((prev) => [...prev, newTask]);
      setIsAddTaskOpen(false);
      setNewTaskForm(DEFAULT_NEW_TASK_FORM);
      addToast('success', `Task "${newTask.title}" added!`);
      logActivity('task_created', `Created task: ${newTask.title}`, newTask.linkedGoalId, newTask.id);

      handleSupabaseError(supabase.from('daily_tasks').insert(newTask), addToast);
    },
    [setDailyTasks, addToast, logActivity]
  );

  const handleAddEvent = useCallback(
    async (event: Omit<ScheduledEvent, 'id'>) => {
      const newEvent: ScheduledEvent = {
        ...event,
        id: crypto.randomUUID(),
      };
      setScheduledEvents(prev => [...prev, newEvent]);
      addToast('success', `Event "${newEvent.title}" scheduled!`);

      handleSupabaseError(supabase.from('scheduled_events').insert(newEvent), addToast);
    },
    [setScheduledEvents, addToast]
  );

  const handleDeleteEvent = useCallback(
    async (id: string) => {
      setScheduledEvents(prev => prev.filter(e => e.id !== id));
      addToast('info', 'Event removed.');

      handleSupabaseError(supabase.from('scheduled_events').delete().eq('id', id), addToast);
    },
    [setScheduledEvents, addToast]
  );

  useEffect(() => {
    setOnProgressGoals(prev =>
      prev.map(goal => {
        const newPct = computeGoalProgress(goal.id);
        const newProgress = `${newPct}%`;
        if (goal.progress !== newProgress) {
          const upd = { ...goal, progress: newProgress };
          handleSupabaseError(supabase.from('goals').update({ progress: newProgress }).eq('id', goal.id));
          return upd;
        }
        return goal;
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strategyPlans, dailyTasks]);

  const value = useMemo<AppContextType>(() => ({
      activePage, selectedGoal, isAddGoalModalOpen, searchQuery, newGoalForm,
      liveClock, liveDate, calMonth, calYear, dailyTasks, editingTask, isAddTaskOpen,
      newTaskForm, planningGoal, strategyPlans, openFaq, isSettingsOpen, settingsForm,
      onProgressGoals, doneGoals, lastResetDate, setActivePage, setSelectedGoal,
      setIsAddGoalModalOpen, setSearchQuery, setNewGoalForm, setCalMonth, setCalYear,
      setDailyTasks, setEditingTask, setIsAddTaskOpen, setNewTaskForm, setPlanningGoal,
      setStrategyPlans, setOpenFaq, setIsSettingsOpen, setSettingsForm, setOnProgressGoals,
      setDoneGoals, setLastResetDate, handleAddGoalSubmit, handleMarkDone, handleDeleteGoal,
      handleSaveEditTask, handleDeleteTask, handleAddNewTask, handleEditGoal,
      setReportTimeframe, reportTimeframe, toasts, addToast, removeToast, activityLog,
      setActivityLog, logActivity, computeGoalProgress, scheduledEvents, setScheduledEvents,
      handleAddEvent, handleDeleteEvent, getGoalById,
    }),
    [
      activePage, selectedGoal, isAddGoalModalOpen, searchQuery, newGoalForm,
      liveClock, liveDate, calMonth, calYear, dailyTasks, editingTask, isAddTaskOpen,
      newTaskForm, planningGoal, strategyPlans, openFaq, isSettingsOpen, settingsForm,
      onProgressGoals, doneGoals, lastResetDate, reportTimeframe, toasts, activityLog,
      scheduledEvents, setActivePage, handleAddGoalSubmit, handleMarkDone, handleDeleteGoal,
      handleSaveEditTask, handleDeleteTask, handleAddNewTask, handleEditGoal, addToast,
      removeToast, logActivity, computeGoalProgress, handleAddEvent, handleDeleteEvent,
      getGoalById, setDailyTasks, setDoneGoals, setOnProgressGoals, setSettingsForm,
      setStrategyPlans, setActivityLog, setScheduledEvents, setLastResetDate,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) { throw new Error('useApp must be used within an AppProvider'); }
  return context;
}
