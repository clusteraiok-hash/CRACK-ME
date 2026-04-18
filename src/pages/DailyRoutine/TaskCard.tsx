import { memo } from 'react';
import type { DailyTask } from '@/types';
import { CATEGORY_ICONS } from '@/constants';
import { useApp } from '@/context';

interface TaskCardProps {
  task: DailyTask;
  onToggle: () => void;
  onToggleSubtask: (index: number) => void;
  onEdit: () => void;
}

export const TaskCard = memo(function TaskCard({ task, onToggle, onToggleSubtask, onEdit }: TaskCardProps) {
  const { getGoalById } = useApp();
  const taskIcon = CATEGORY_ICONS[task.category] || 'solar:target-linear';
  const subDone = task.subtasks.filter((s) => s.done).length;
  const subTotal = task.subtasks.length;
  const hasSubtasks = subTotal > 0;
  const allSubtasksDone = hasSubtasks ? subDone === subTotal : true;
  const linkedGoal = task.linkedGoalId ? getGoalById(task.linkedGoalId) : null;

  // Can only mark main task as done if ALL subtasks are completed (or no subtasks)
  const canComplete = allSubtasksDone;

  const handleMainToggle = () => {
    if (!task.done && !canComplete) {
      // Cannot mark complete — subtasks not all done
      return;
    }
    onToggle();
  };

  return (
    <div
      className={`rounded-premium border transition-all shadow-soft ${
        task.done 
          ? 'bg-[#dcfce7]/50 border-transparent' 
          : 'bg-white border-[#dcfce7] hover:border-[#022c22]/20'
      }`}
    >
      <div className="flex items-center gap-4 py-4 px-5">
        {/* Main toggle — disabled look if subtasks incomplete & not yet done */}
        <button
          onClick={handleMainToggle}
          className={`w-6 h-6 rounded-full border-[1.5px] flex items-center justify-center flex-shrink-0 transition-all ${
            task.done
              ? 'bg-[#bef264] border-[#bef264]'
              : canComplete
              ? 'border-slate-300 hover:border-[#022c22]'
              : 'border-slate-200 opacity-40 cursor-not-allowed'
          }`}
          aria-label={
            task.done
              ? 'Mark incomplete'
              : canComplete
              ? 'Mark complete'
              : 'Complete all subtasks first'
          }
          aria-pressed={task.done}
          title={!canComplete && !task.done ? 'Complete all subtasks first' : undefined}
        >
          {task.done && (
            <iconify-icon icon="solar:check-read-linear" width="14" height="14" className="text-[#bef264]" />
          )}
        </button>

        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${task.done ? 'bg-white/50' : 'bg-[#f0fdf4] border border-[#dcfce7]'}`}>
          <iconify-icon icon={taskIcon} width="20" height="20" className={task.done ? 'text-slate-400' : 'text-[#022c22]'} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className={`text-base font-black uppercase tracking-tighter truncate transition-colors ${task.done ? 'text-slate-400' : 'text-[#022c22]'}`}>
            {task.title}
          </h3>
          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#022c22]/40">{task.category}</span>
            {hasSubtasks && (
              <span className={`text-[10px] font-black uppercase tracking-widest ${subDone === subTotal ? 'text-[#10b981]' : 'text-slate-400'}`}>
                · {subDone}/{subTotal} subtasks
              </span>
            )}
            {linkedGoal && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#064e3b] border border-[#dcfce7]">
                {linkedGoal.title}
              </span>
            )}
            {!canComplete && !task.done && hasSubtasks && (
              <span className="text-[10px] text-amber-500 font-medium flex items-center gap-1">
                <iconify-icon icon="solar:lock-linear" width="10" height="10" />
                Complete subtasks
              </span>
            )}
          </div>
        </div>

        <div
          className={`text-[11px] flex-shrink-0 px-3 py-1 rounded-full border border-transparent flex items-center gap-1.5 ${
            task.done ? 'text-slate-400 bg-[#f0fdf4]' : 'text-[#022c22] bg-[#f0fdf4] border-[#dcfce7] font-bold'
          }`}
        >
          <span>{task.startTime}</span>
          <span className="opacity-30">→</span>
          <span>{task.endTime || '…'}</span>
        </div>

        <button
          onClick={onEdit}
          className="text-slate-400 hover:text-[#022c22] transition-colors flex-shrink-0 p-1"
          aria-label="Edit task"
        >
          <iconify-icon icon="solar:pen-linear" width="18" height="18" />
        </button>
      </div>

      {!task.done && hasSubtasks && (
        <div className="px-5 pb-4 pl-20 space-y-2">
          {task.subtasks.map((sub, si) => (
            <div key={si} className="flex items-center gap-3 group">
              <button
                onClick={() => onToggleSubtask(si)}
                className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
                  sub.done ? 'bg-[#bef264] border-[#bef264]' : 'border-slate-300 group-hover:border-[#022c22]'
                }`}
                aria-label={sub.done ? 'Mark subtask incomplete' : 'Mark subtask complete'}
              >
                {sub.done && (
                  <iconify-icon icon="solar:check-read-linear" width="10" height="10" className="text-[#bef264]" />
                )}
              </button>
              <span className={`text-xs ${sub.done ? 'line-through text-slate-400' : 'text-slate-600'}`}>{sub.text}</span>
            </div>
          ))}
          {task.note && (
            <div className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-[#f0fdf4] rounded-premium px-4 py-3 flex items-start gap-3 border border-[#dcfce7]">
              <iconify-icon icon="solar:notes-linear" width="16" height="16" className="text-[#022c22]/40 mt-0.5 flex-shrink-0" />
              {task.note}
            </div>
          )}
        </div>
      )}
    </div>
  );
});
