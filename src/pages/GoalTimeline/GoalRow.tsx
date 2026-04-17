import type { Goal } from '@/types';
import { memo } from 'react';

interface GoalRowProps {
  goal: Goal;
  isActive: boolean;
  onSelect: () => void;
}

export const GoalRow = memo(function GoalRow({ goal, isActive, onSelect }: GoalRowProps) {
  const progressNum = parseInt(goal.progress) || 0;

  return (
    <div
      onClick={onSelect}
      className={`grid grid-cols-[120px_1fr_150px_150px] gap-8 items-center py-5 cursor-pointer transition-all duration-300 rounded-premium mb-2 ${
        isActive 
          ? 'bg-[#bef264] text-[#022c22] -mx-12 px-12 shadow-soft' 
          : 'hover:bg-[#f0fdf4] px-4 -mx-4 border-l border-transparent hover:border-[#022c22]/30'
      }`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      aria-label={`Goal: ${goal.title}`}
      aria-selected={isActive}
    >
      <div className={`text-sm ${isActive ? 'text-gray-300' : 'text-slate-400'}`}>{goal.time}</div>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#f0fdf4] flex items-center justify-center flex-shrink-0 border border-[#dcfce7]">
          <iconify-icon icon={goal.icon} width="20" height="20" className="text-[#022c22]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className={`text-base font-black tracking-tight ${!isActive ? 'text-[#022c22]' : ''}`}>{goal.title}</div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-[#022c22]/60' : 'text-slate-400'}`}>{goal.category}</span>
            {/* Mini progress bar */}
            <div className="flex items-center gap-2 flex-1 max-w-[120px]">
              <div className={`flex-1 h-2 rounded-full bg-[#dcfce7]`}>
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    progressNum >= 100 ? 'bg-emerald-500' : 'bg-[#10b981]'
                  }`}
                  style={{ width: `${Math.min(progressNum, 100)}%` }}
                />
              </div>
              <span className={`text-[10px] font-bold ${isActive ? 'text-[#022c22]' : 'text-slate-500'}`}>{goal.progress}</span>
            </div>
          </div>
        </div>
      </div>
      <div className={`text-[10px] font-black tracking-widest uppercase ${isActive ? 'text-[#022c22]/60' : 'text-[#022c22]'}`}>{goal.dueDate}</div>
      <div className={`text-[10px] font-black tracking-widest uppercase ${isActive ? 'text-[#022c22]/60' : 'text-[#022c22]'}`}>{goal.target}</div>
    </div>
  );
});

interface GoalSectionProps {
  title: string;
  goals: Goal[];
  selectedGoal: Goal | null;
  onSelectGoal: (goal: Goal) => void;
  emptyMessage: string;
}

export const GoalSection = memo(function GoalSection({
  title,
  goals,
  selectedGoal,
  onSelectGoal,
  emptyMessage,
}: GoalSectionProps) {
  return (
    <div className="mb-12">
      <h2 className="text-2xl tracking-tighter font-black uppercase mb-8 text-[#022c22] flex items-center gap-2">
        <span className="text-[#bef264] text-lg">■</span>
        {title}
        <span className="text-sm text-slate-400 ml-3 font-normal">({goals.length})</span>
      </h2>
      {goals.length === 0 && (
        <div className="py-16 text-center text-slate-400 border border-dashed border-[#dcfce7] rounded-premium bg-white shadow-soft">
          {emptyMessage}
        </div>
      )}
      <div className="flex flex-col">
        {goals.map((goal) => (
          <GoalRow
            key={goal.id}
            goal={goal}
            isActive={selectedGoal?.id === goal.id}
            onSelect={() => onSelectGoal(goal)}
          />
        ))}
      </div>
    </div>
  );
});
