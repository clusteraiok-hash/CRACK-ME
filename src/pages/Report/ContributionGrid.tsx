import { useMemo, memo } from 'react';
import { useApp } from '@/context';

const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const ContributionGrid = memo(function ContributionGrid() {
  const { activityLog } = useApp();

  const data = useMemo(() => {
    const now = new Date();
    const result = [];
    const activityMap: Record<string, number> = {};

    // Process activity log into a map
    activityLog.forEach(entry => {
      activityMap[entry.date] = (activityMap[entry.date] || 0) + 1;
    });

    // Start from 52 weeks ago, aligned to the start of that week (Sunday)
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 364);
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    const totalDays = 371; // ~53 weeks to ensure coverage

    for (let i = 0; i < totalDays; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        const count = activityMap[dateStr] || 0;
        
        result.push({
            date: dateStr,
            count,
            day: d.getDay(),
            month: d.getMonth(),
            year: d.getFullYear(),
            isFuture: d > now
        });
    }

    return result;
  }, [activityLog]);

  const weeks = useMemo(() => {
    const w = [];
    for (let i = 0; i < data.length; i += 7) {
      w.push(data.slice(i, i + 7));
    }
    return w;
  }, [data]);

  const getColor = (count: number, isFuture: boolean) => {
    if (isFuture) return 'bg-transparent';
    if (count === 0) return 'bg-slate-100/50';
    if (count <= 2) return 'bg-[#dcfce7]';
    if (count <= 5) return 'bg-[#bbf7d0]';
    if (count <= 8) return 'bg-[#86efac]';
    return 'bg-[#bef264]';
  };

  const totalContributions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return activityLog.filter(e => e.date.startsWith(currentYear.toString())).length;
  }, [activityLog]);

  // Streak logic
  const { streak, maxStreak } = useMemo(() => {
    const activityDates = new Set(activityLog.map(e => e.date));
    
    let current = 0;
    let maxS = 0;
    let temp = 0;
    
    // Current streak
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    if (activityDates.has(today) || activityDates.has(yesterday)) {
        let checkDate = activityDates.has(today) ? new Date() : new Date(Date.now() - 86400000);
        while (activityDates.has(checkDate.toISOString().split('T')[0])) {
            current++;
            checkDate.setDate(checkDate.getDate() - 1);
        }
    }

    // Max streak
    const allDates = Array.from(activityDates).sort();
    if (allDates.length > 0) {
        let lastD = new Date(allDates[0]);
        temp = 1;
        maxS = 1;
        for (let i = 1; i < allDates.length; i++) {
            const currD = new Date(allDates[i]);
            const diff = (currD.getTime() - lastD.getTime()) / (1000 * 60 * 60 * 24);
            if (diff === 1) {
                temp++;
            } else {
                temp = 1;
            }
            maxS = Math.max(maxS, temp);
            lastD = currD;
        }
    }

    return { streak: current, maxStreak: maxS };
  }, [activityLog]);

  return (
    <div className="mt-12">
      <h2 className="text-2xl tracking-tighter font-black uppercase mb-8 text-[#022c22] flex items-center gap-2">
        <span className="text-[#bef264] text-lg">■</span>
        Contribution Activity
      </h2>
      
      <div className="bg-white rounded-premium p-10 border border-[#dcfce7] shadow-soft overflow-x-auto">
        <div className="flex flex-col gap-6 min-w-[800px]">
          <div className="flex justify-between items-end mb-2">
             <div className="text-xl font-black text-[#022c22]">
                {totalContributions} <span className="text-slate-400 font-bold uppercase text-xs tracking-widest ml-1">contributions in {new Date().getFullYear()}</span>
             </div>
             <div className="flex gap-8">
                <div className="text-right">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Current Streak</div>
                    <div className="text-xl font-black text-[#bef264] flex items-center justify-end gap-1">
                        <iconify-icon icon="solar:fire-bold" />
                        {streak} days
                    </div>
                </div>
                <div className="text-right border-l border-[#dcfce7] pl-8">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Max Streak</div>
                    <div className="text-xl font-black text-[#022c22]">{maxStreak} days</div>
                </div>
             </div>
          </div>

          <div className="flex gap-4">
            {/* Day Labels */}
            <div className="flex flex-col gap-2 pt-6">
              {DAY_LABELS.map((label, i) => (
                <div key={i} className="h-3 text-[9px] font-bold text-slate-400 uppercase leading-[12px] w-6">
                  {label}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="flex-1">
              {/* Month Labels */}
              <div className="flex mb-2">
                {weeks.map((week, i) => {
                  const firstDay = week[0];
                  const isNewMonth = firstDay.date.endsWith('-01') || (i === 0) || (i > 0 && weeks[i-1][0].month !== firstDay.month);
                  return (
                    <div key={i} className="flex-1 text-[9px] font-bold text-slate-400 uppercase min-w-[12px]">
                      {isNewMonth ? MONTH_LABELS[firstDay.month] : ''}
                    </div>
                  );
                })}
              </div>

              {/* Squares */}
              <div className="flex gap-1">
                {weeks.map((week, i) => (
                  <div key={i} className="flex flex-col gap-1 flex-1">
                    {week.map((day) => (
                      <div
                        key={day.date}
                        className={`w-3 h-3 rounded-[2px] transition-all duration-300 hover:ring-2 hover:ring-[#bef264] cursor-help ${getColor(day.count, day.isFuture)}`}
                        title={`${day.count} activities on ${new Date(day.date).toLocaleDateString()}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-2 mt-2">
             <span className="text-[10px] font-bold text-slate-400 uppercase">Less</span>
             <div className="flex gap-1">
                <div className="w-3 h-3 rounded-[2px] bg-slate-100/50" />
                <div className="w-3 h-3 rounded-[2px] bg-[#dcfce7]" />
                <div className="w-3 h-3 rounded-[2px] bg-[#bbf7d0]" />
                <div className="w-3 h-3 rounded-[2px] bg-[#86efac]" />
                <div className="w-3 h-3 rounded-[2px] bg-[#bef264]" />
             </div>
             <span className="text-[10px] font-bold text-slate-400 uppercase">More</span>
          </div>
        </div>
      </div>
    </div>
  );
});
