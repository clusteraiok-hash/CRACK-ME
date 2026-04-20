import { memo, useMemo, useCallback } from 'react';
import { useApp } from '@/context';
import { TaskCard } from './TaskCard';
import { Button, ProgressBar } from '@/components';

export const DailyRoutine = memo(function DailyRoutine() {
  const {
    liveDate,
    liveClock,
    dailyTasks,
    setDailyTasks,
    setEditingTask,
    setIsAddTaskOpen,
    addToast,
    logActivity,
  } = useApp();

  const totalUnits = useMemo(() => dailyTasks.reduce((acc, task) => {
    return acc + Math.max(1, task.subtasks.length);
  }, 0), [dailyTasks]);

  const completedUnits = useMemo(() => dailyTasks.reduce((acc, task) => {
    if (task.subtasks.length > 0) {
      return acc + task.subtasks.filter(s => s.done).length;
    }
    return acc + (task.done ? 1 : 0);
  }, 0), [dailyTasks]);

  const percentage = totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0;
  const doneCount = dailyTasks.filter((t) => t.done).length;
  
  const totalSubs = useMemo(() => dailyTasks.reduce((a, t) => a + t.subtasks.length, 0), [dailyTasks]);
  const doneSubs = useMemo(
    () => dailyTasks.reduce((a, t) => a + t.subtasks.filter((s) => s.done).length, 0),
    [dailyTasks]
  );

  const toggleTask = useCallback(
    (id: string) => {
      const task = dailyTasks.find(t => t.id === id);
      if (!task) return;

      // GATE: Cannot mark done if subtasks exist and not all completed
      if (!task.done) {
        const hasSubtasks = task.subtasks.length > 0;
        const allSubsDone = task.subtasks.every(s => s.done);
        if (hasSubtasks && !allSubsDone) {
          addToast('warning', 'Complete all subtasks before marking the task as done.');
          return;
        }
      }

      const newDone = !task.done;
      setDailyTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: newDone } : t)));
      if (newDone) {
        addToast('success', `Task "${task.title}" completed! ✅`);
        logActivity('task_completed', `Completed task: ${task.title}`, task.linkedGoalId, task.id);
      }
    },
    [dailyTasks, setDailyTasks, addToast, logActivity]
  );

  const toggleSubtask = useCallback(
    (taskId: string, subIdx: number) => {
      setDailyTasks((prev) =>
        prev.map((t) => {
          if (t.id !== taskId) return t;
          const newSubs = t.subtasks.map((s, i) => (i === subIdx ? { ...s, done: !s.done } : s));
          // If a subtask is being unchecked and the main task is done, un-complete the main task
          const subNowDone = !t.subtasks[subIdx].done;
          const allSubsDone = newSubs.every(s => s.done);

          let newDone = t.done;
          if (!subNowDone && t.done) {
            // Unchecking a subtask should un-complete the main task
            newDone = false;
          }
          // Auto-complete main task when all subtasks are done
          if (allSubsDone && newSubs.length > 0 && !t.done) {
            newDone = true;
            addToast('success', `All subtasks done — "${t.title}" completed! ✅`);
            logActivity('task_completed', `Completed task: ${t.title}`, t.linkedGoalId, t.id);
          }

          return { ...t, subtasks: newSubs, done: newDone };
        })
      );
    },
    [setDailyTasks, addToast, logActivity]
  );

  const handleEditTask = useCallback(
    (task: typeof dailyTasks[0]) => {
      setEditingTask({ ...task, subtasks: task.subtasks.map((s) => ({ ...s })) });
    },
    [setEditingTask]
  );

  return (
    <>
      <div className="flex justify-between items-center px-12 py-10 border-b border-[#dcfce7] bg-white shadow-sm">
        <div>
          <h1 className="text-4xl tracking-tighter font-black uppercase text-[#022c22]">Daily Routine</h1>
          <p className="text-sm text-slate-500 mt-1">
            {liveDate} · <span className="text-[#022c22] font-black">{liveClock} IST</span>
          </p>
          <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 uppercase tracking-widest font-bold">
            <iconify-icon icon="solar:refresh-linear" width="12" height="12" className="text-[#022c22]" />
            Tasks reset daily at midnight
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">Progress</div>
            <div className="text-xl font-black text-[#022c22]">
              {doneCount}
              <span className="text-slate-300"> / {dailyTasks.length}</span>
            </div>
          </div>
          <div className="w-16 h-16 rounded-premium border-2 border-[#bef264] flex flex-col items-center justify-center bg-[#bef264]/10 shadow-soft">
            <span className="text-sm font-black text-[#022c22] leading-none">{percentage}%</span>
            <span className="text-[8px] uppercase tracking-tighter text-[#022c22]/60 mt-0.5 font-bold">LOAD</span>
          </div>
          <Button onClick={() => setIsAddTaskOpen(true)}>
            <span className="text-lg leading-none">+</span>
            <span>Add Task</span>
          </Button>
        </div>
      </div>

      <div className="px-12 pt-6 pb-2">
        <div className="flex justify-between text-xs text-slate-400 mb-2">
          <span>Progress</span>
          <span>
            {percentage}% · {doneSubs}/{totalSubs} subtasks
          </span>
        </div>
        <ProgressBar percentage={percentage} />
      </div>

      <div className="px-12 pt-6 pb-20 space-y-2">
        {dailyTasks.length === 0 ? (
          <div className="py-20 text-center text-slate-500 border border-dashed border-[#dcfce7] rounded-premium bg-white shadow-soft">
            <iconify-icon icon="solar:sun-2-linear" width="48" height="48" className="text-[#022c22]/10 mb-4" />
            <p className="text-sm font-bold uppercase tracking-widest text-[#022c22]/40">Zero active tasks detected</p>
          </div>
        ) : (
          dailyTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={() => toggleTask(task.id)}
              onToggleSubtask={(idx) => toggleSubtask(task.id, idx)}
              onEdit={() => handleEditTask(task)}
            />
          ))
        )}
      </div>
    </>
  );
});
