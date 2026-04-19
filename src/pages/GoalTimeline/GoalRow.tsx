import type { Goal } from '@/types';
import { memo } from 'react';

function parseDateStr(dateStr: string): Date | null {
  if (!dateStr || dateStr === 'N/A') return null;
  
  const months: Record<string, number> = {
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
  
  const cleanDate = dateStr.trim().toLowerCase();
  let day = 0, monthIdx = 0, year = 2026;
  
  // Find month first
  let monthFound = false;
  for (const [m, idx] of Object.entries(months)) {
    if (cleanDate.includes(m)) {
      monthIdx = idx;
      monthFound = true;
      break;
    }
  }
  
  if (!monthFound) return null;
  
  // Extract day number
  const dayMatch = cleanDate.match(/(\d{1,2})/);
  if (dayMatch) {
    day = parseInt(dayMatch[1], 10);
  }
  
  // Extract year
  const yearMatch = cleanDate.match(/(\d{4})/);
  if (yearMatch) {
    year = parseInt(yearMatch[1], 10);
  }
  
  if (day === 0 || day > 31) return null;
  return new Date(year, monthIdx, day);
}

function getDaysRemaining(startDate: string, dueDate: string): { totalDays: number; remainingDays: number; isOverdue: boolean } {
  const today = new Date(2026, 3, 19); // April 19, 2026
  
  if (!dueDate || dueDate === 'N/A') {
    return { totalDays: 0, remainingDays: 0, isOverdue: false };
  }
  
  const start = parseDateStr(startDate) || today;
  const end = parseDateStr(dueDate);
  
  if (!end) {
    return { totalDays: 0, remainingDays: 0, isOverdue: false };
  }
  
  const totalMs = end.getTime() - start.getTime();
  const totalDays = Math.ceil(totalMs / (1000 * 60 * 60 * 24));
  
  const remainingMs = end.getTime() - today.getTime();
  const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
  
  return { totalDays, remainingDays, isOverdue: remainingDays < 0 };
}

interface GoalRowProps {
  goal: Goal;
  isActive: boolean;
  onSelect: () => void;
}

export const GoalRow = memo(function GoalRow({ goal, isActive, onSelect }: GoalRowProps) {
  const progressNum = parseInt(goal.progress) || 0;
  const { totalDays, remainingDays, isOverdue } = getDaysRemaining(goal.startDate, goal.dueDate);
  const displayDays = remainingDays > 0 ? remainingDays : (isOverdue ? Math.abs(remainingDays) : totalDays);

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
        <div className={`text-[22px] font-black ${isOverdue ? 'text-rose-500' : displayDays <= 3 ? 'text-amber-500' : 'text-[#022c22]'}`}>
          {displayDays}
        </div>
        <div className={`text-[8px] font-black uppercase ${isOverdue ? 'text-rose-400' : 'text-slate-400'}`}>
          {isOverdue ? 'days ago' : 'days left'}
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
