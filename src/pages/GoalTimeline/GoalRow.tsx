import type { Goal } from '@/types';
import { memo } from 'react';

function getDaysRemaining(dueDate: string): { days: number; isOverdue: boolean } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  if (!dueDate || dueDate === 'N/A') {
    return { days: 0, isOverdue: false };
  }
  
  const lowerDue = dueDate.toLowerCase();
  
  if (lowerDue.includes('today')) {
    return { days: 0, isOverdue: false };
  } else if (lowerDue.includes('tomorrow')) {
    return { days: 1, isOverdue: false };
  }
  
  // Try to parse date string
  const monthsMap: Record<string, number> = {
    'jan': 0, 'january': 0,
    'feb': 1, 'february': 1,
    'mar': 2, 'march': 2,
    'apr': 3, 'april': 3,
    'may': 4,
    'jun': 5, 'june': 5,
    'jul': 6, 'july': 6,
    'aug': 7, 'august': 7,
    'sep': 8, 'sept': 8, 'september': 8,
    'oct': 9, 'october': 9,
    'nov': 10, 'november': 10,
    'dec': 11, 'december': 11
  };
  
  // Pattern: "25 Apr, 2026" or "25 Apr 2026" or "Apr 25, 2026"
  let day = 0, month = 0, year = now.getFullYear();
  let found = false;
  
  // Try "25 Apr, 2026" format
  const match1 = dueDate.match(/(\d{1,2})\s+([a-zA-Z]+),?\s*(\d{4})?/);
  if (match1) {
    day = parseInt(match1[1], 10);
    const monthStr = match1[2].toLowerCase();
    month = monthsMap[monthStr] ?? -1;
    if (match1[3]) year = parseInt(match1[3], 10);
    found = month >= 0;
  }
  
  // Try "Apr 25, 2026" format  
  if (!found) {
    const match2 = dueDate.match(/([a-zA-Z]+)\s+(\d{1,2}),?\s*(\d{4})?/);
    if (match2) {
      const monthStr = match2[1].toLowerCase();
      month = monthsMap[monthStr] ?? -1;
      day = parseInt(match2[2], 10);
      if (match2[3]) year = parseInt(match2[3], 10);
      found = month >= 0;
    }
  }
  
  if (!found || day < 1 || day > 31) {
    return { days: 0, isOverdue: false };
  }
  
  const targetDate = new Date(year, month, day);
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return { days: diffDays, isOverdue: diffDays < 0 };
}

interface GoalRowProps {
  goal: Goal;
  isActive: boolean;
  onSelect: () => void;
}

export const GoalRow = memo(function GoalRow({ goal, isActive, onSelect }: GoalRowProps) {
  const progressNum = parseInt(goal.progress) || 0;
  const { days, isOverdue } = getDaysRemaining(goal.dueDate);

  return (
    <div
      onClick={onSelect}
      className={`grid grid-cols-[120px_1fr_150px_100px_100px] gap-6 items-center py-5 cursor-pointer transition-all duration-300 rounded-premium mb-2 ${
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
      <div className="flex flex-col items-center">
        <div className={`text-[22px] font-black ${isOverdue ? 'text-rose-500' : days <= 3 ? 'text-amber-500' : 'text-[#022c22]'}`}>
          {isOverdue ? Math.abs(days) : days}
        </div>
        <div className={`text-[8px] font-black uppercase ${isOverdue ? 'text-rose-400' : 'text-slate-400'}`}>
          {isOverdue ? 'days ago' : days === 1 ? 'day left' : 'days left'}
        </div>
      </div>
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
