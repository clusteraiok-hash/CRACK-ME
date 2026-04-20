import React, { createContext, useContext, useCallback, useMemo, useEffect, useState } from 'react';
import type { AppContextType, Goal, DailyTask, StrategyPlan, PageType, TimeframeType, Toast, ActivityLogEntry, ScheduledEvent, NewTaskForm } from '@/types';
import { useLocalStorage, useClock } from '@/hooks';
import { supabase, testSupabaseConnection } from '@/lib/supabase';
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

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'offline' | 'error';

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
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [isHydrated, setIsHydrated] = useState(false);

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
      setSyncStatus('syncing');
      
      const connectionTest = await testSupabaseConnection();
      if (!connectionTest.connected) {
        console.warn('Supabase offline, using local data only');
        setSyncStatus('offline');
        addToast('warning', 'Working offline - data saved locally');
        setIsHydrated(true);
        return;
      }

      try {
        const today = getTodayIST();
        
        const [goalsRes, tasksRes, plansRes, logsRes, eventsRes] = await Promise.all([
          supabase.from('goals').select('*'),
          supabase.from('daily_tasks').select('*'),
          supabase.from('strategy_plans').select('*'),
          supabase.from('activity_log').select('*'),
          supabase.from('scheduled_events').select('*')
        ]);

        const hasGoalsData = goalsRes.data && goalsRes.data.length > 0;
        const hasPlansData = plansRes.data && plansRes.data.length > 0;
        const hasEventsData = eventsRes.data && eventsRes.data.length > 0;

        // Only update from Supabase if there's actual data there
        // Otherwise keep localStorage data (which was already loaded)
        if (hasGoalsData) {
          setOnProgressGoals(goalsRes.data.filter(g => g.status === 'Active'));
          setDoneGoals(goalsRes.data.filter(g => g.status === 'Done'));
        }
        
        if (hasPlansData) setStrategyPlans(plansRes.data);
        if (logsRes.data && logsRes.data.length > 0) {
          setActivityLog(logsRes.data.sort((a,b) => b.timestamp - a.timestamp));
        }
        if (hasEventsData) setScheduledEvents(eventsRes.data);

        // Tasks: only use Supabase tasks if they exist
        // Keep localStorage tasks if Supabase is empty
        const todayTasks = tasksRes.data?.filter(t => t.assignedDate === today) || [];
        if (todayTasks.length > 0) {
          setDailyTasks(todayTasks);
        }
        // If no Supabase tasks, localStorage tasks remain untouched
        
        setLastResetDate(today);
        setSyncStatus('synced');
        setIsHydrated(true);
        console.log('Data synced from Supabase');

      } catch (err) {
        console.error("Error fetching data from Supabase", err);
        setSyncStatus('error');
        addToast('error', 'Sync failed - using local data');
        setIsHydrated(true);
      }
    };

    fetchSupabaseData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Daily Check Effect — only refresh from Supabase if new day AND has data
  useEffect(() => {
    if (!isHydrated) return;
    
    const checkDate = async () => {
      const today = getTodayIST();
      if (today !== lastResetDate) {
        setLastResetDate(today);
        
        if (syncStatus === 'offline' || syncStatus === 'error') {
          addToast('info', 'New day! Using local data.');
          return;
        }
        
        try {
          const tasksRes = await supabase.from('daily_tasks').select('*');
          const todayTasks = tasksRes.data?.filter(t => t.assignedDate === today) || [];
          
          if (todayTasks.length > 0) {
            setDailyTasks(todayTasks);
            addToast('info', 'New day! Your daily routine has been refreshed.');
          }
          // If no tasks in Supabase, keep localStorage data
        } catch (err) {
          console.error('Daily reset error:', err);
        }
      }
    };
    const interval = setInterval(checkDate, 60000);
    return () => clearInterval(interval);
  }, [lastResetDate, setLastResetDate, setDailyTasks, addToast, syncStatus, isHydrated]);

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
      
      if (syncStatus !== 'offline') {
        try {
          await supabase.from('activity_log').insert(entry);
        } catch (err) {
          console.error('Activity log sync error:', err);
        }
      }
    },
    [setActivityLog, addToast, syncStatus]
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
        if (task.subtasks && task.subtasks.length > 0) {
          task.subtasks.forEach(st => {
            totalItems++;
            if (st.done) doneItems++;
          });
        } else {
          totalItems++;
          if (task.done) doneItems++;
        }
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
      
      if (syncStatus !== 'offline') {
        try {
          await supabase.from('goals').insert(newEntry);
        } catch (err) {
          console.error('Goal sync failed:', err);
        }
      }

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
        
        if (syncStatus !== 'offline') {
          try {
            await supabase.from('strategy_plans').insert(newPlan);
          } catch (err) {
            console.error('Strategy plan sync failed:', err);
          }
        }

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

      if (syncStatus !== 'offline') {
        try {
          await supabase.from('goals').update({ status: 'Done', progress: '100%', completedAt: Date.now() }).eq('id', goalId);
        } catch (err) {
          console.error('Goal completion sync failed:', err);
        }
      }
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

      if (syncStatus !== 'offline') {
        try {
          await supabase.from('goals').delete().eq('id', goalId);
        } catch (err) {
          console.error('Goal deletion sync failed:', err);
        }
      }
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

      if (syncStatus !== 'offline') {
        try {
          await supabase.from('goals').update(updates).eq('id', goalId);
        } catch (err) {
          console.error('Goal update sync failed:', err);
        }
      }
    },
    [selectedGoal, setOnProgressGoals, setDoneGoals, addToast]
  );

  // Fixed: accepts task data directly to avoid stale state race condition
  const handleSaveEditTask = useCallback(
    async (taskData: DailyTask) => {
      setDailyTasks((prev) => prev.map((t) => (t.id === taskData.id ? { ...taskData } : t)));
      setEditingTask(null);
      addToast('success', 'Task updated successfully!');

      if (syncStatus !== 'offline') {
        try {
          await supabase.from('daily_tasks').update(taskData).eq('id', taskData.id);
        } catch (err) {
          console.error('Task update sync failed:', err);
        }
      }
    },
    [setDailyTasks, addToast]
  );

  const handleDeleteTask = useCallback(
    async (id: string) => {
      setDailyTasks((prev) => prev.filter((t) => t.id !== id));
      setEditingTask(null);
      addToast('info', 'Task deleted.');

      if (syncStatus !== 'offline') {
        try {
          await supabase.from('daily_tasks').delete().eq('id', id);
        } catch (err) {
          console.error('Task deletion sync failed:', err);
        }
      }
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
        subtasks: formData.subtasks || [],
        done: false,
        linkedGoalId: formData.linkedGoalId,
        assignedDate: getTodayIST(),
      };
      setDailyTasks((prev) => [...prev, newTask]);
      setIsAddTaskOpen(false);
      setNewTaskForm(DEFAULT_NEW_TASK_FORM);
      addToast('success', `Task "${newTask.title}" added!`);
      logActivity('task_created', `Created task: ${newTask.title}`, newTask.linkedGoalId, newTask.id);

      if (syncStatus !== 'offline') {
        try {
          await supabase.from('daily_tasks').insert(newTask);
        } catch (err) {
          console.error('Task creation sync failed:', err);
        }
      }
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

      if (syncStatus !== 'offline') {
        try {
          await supabase.from('scheduled_events').insert(newEvent);
        } catch (err) {
          console.error('Event creation sync failed:', err);
        }
      }
    },
    [setScheduledEvents, addToast, syncStatus]
  );

  const handleDeleteEvent = useCallback(
    async (id: string) => {
      setScheduledEvents(prev => prev.filter(e => e.id !== id));
      addToast('info', 'Event removed.');

      if (syncStatus !== 'offline') {
        try {
          await supabase.from('scheduled_events').delete().eq('id', id);
        } catch (err) {
          console.error('Event deletion sync failed:', err);
        }
      }
    },
    [setScheduledEvents, addToast, syncStatus]
  );

  useEffect(() => {
    setOnProgressGoals(prev =>
      prev.map(goal => {
        const newPct = computeGoalProgress(goal.id);
        const newProgress = `${newPct}%`;
        if (goal.progress !== newProgress) {
          const upd = { ...goal, progress: newProgress };
          if (syncStatus !== 'offline') {
            (async () => {
              try {
                await supabase.from('goals').update({ progress: newProgress }).eq('id', goal.id);
              } catch (err) {
                console.error('Progress sync error:', err);
              }
            })();
          }
          return upd;
        }
        return goal;
      })
    );
  }, [strategyPlans, dailyTasks, syncStatus]);

  const value = useMemo<AppContextType>(() => ({
      syncStatus, activePage, selectedGoal, isAddGoalModalOpen, searchQuery, newGoalForm,
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
      syncStatus, activePage, selectedGoal, isAddGoalModalOpen, searchQuery, newGoalForm,
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
