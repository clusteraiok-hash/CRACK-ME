import { memo, useMemo } from 'react';
import { useApp } from '@/context';
import { CATEGORY_ICONS } from '@/constants';
import type { TimeframeType } from '@/types';
import { ContributionGrid } from './ContributionGrid';

const TIMEFRAMES: TimeframeType[] = ['Daily', 'Weekly', 'Monthly', 'Yearly'];


export const Report = memo(function Report() {
  const { liveDate, onProgressGoals, doneGoals, dailyTasks, reportTimeframe, setReportTimeframe, activityLog } = useApp();

  const filteredGoals = useMemo(() => {
    const now = Date.now();
    const timeframeMs = {
      Daily: 24 * 60 * 60 * 1000,
      Weekly: 7 * 24 * 60 * 60 * 1000,
      Monthly: 30 * 24 * 60 * 60 * 1000,
      Yearly: 365 * 24 * 60 * 60 * 1000,
    };

    const ms = timeframeMs[reportTimeframe];
    const filterFn = (g: { createdAt: number }) => now - g.createdAt <= ms;

    return {
      onProgress: onProgressGoals.filter(filterFn),
      done: doneGoals.filter(filterFn),
    };
  }, [onProgressGoals, doneGoals, reportTimeframe]);

  const totalGoals = filteredGoals.onProgress.length + filteredGoals.done.length;
  const completionRate = totalGoals > 0 ? Math.round((filteredGoals.done.length / totalGoals) * 100) : 0;

  const categories = useMemo(() => {
    const catMap: Record<string, number> = {};
    [...filteredGoals.onProgress, ...filteredGoals.done].forEach((g) => {
      catMap[g.category] = (catMap[g.category] || 0) + 1;
    });
    return Object.entries(catMap).sort((a, b) => b[1] - a[1]);
  }, [filteredGoals]);

  const dailyDone = dailyTasks.filter((t) => t.done).length;
  const dailyPct = dailyTasks.length > 0 ? Math.round((dailyDone / dailyTasks.length) * 100) : 0;

  // Compute streak (consecutive days with activity)
  const streak = useMemo(() => {
    const now = new Date();
    let count = 0;
    for (let i = 0; i < 365; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const hasActivity = activityLog.some(
        e => e.date === dateStr && (e.type === 'task_completed' || e.type === 'goal_completed')
      );
      if (hasActivity || i === 0) {
        if (hasActivity) count++;
        else if (i === 0) continue; // today might not have activity yet
      } else break;
    }
    return count;
  }, [activityLog]);

  return (
    <>
      <div className="flex justify-between items-center px-12 py-10 border-b border-[#dcfce7] bg-white shadow-sm">
        <div>
          <h1 className="text-4xl tracking-tighter font-black uppercase text-[#022c22]">Performance</h1>
          <div className="flex gap-2 bg-[#f0fdf4] p-1.5 rounded-xl border border-[#dcfce7] mt-4">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf}
                onClick={() => setReportTimeframe(tf)}
                className={`
                  px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all
                  ${reportTimeframe === tf 
                    ? 'bg-[#022c22] text-white shadow-soft' 
                    : 'text-[#022c22]/60 hover:text-[#022c22] hover:bg-white/50'}
                `}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">{liveDate}</div>
          {streak > 0 && (
            <div className="text-xs text-[#bef445] font-medium mt-1 flex items-center gap-1 justify-end">
              <iconify-icon icon="solar:fire-linear" width="14" height="14" />
              {streak} day streak
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 px-12 py-8 border-b border-[#dcfce7]">
        <div>
          <div className="text-sm text-slate-500 mb-1 font-medium">Total Goals</div>
          <div className="text-2xl font-black text-[#022c22]">{totalGoals}</div>
        </div>
        <div className="border-l border-[#dcfce7] pl-8">
          <div className="text-sm text-slate-500 mb-1 font-medium">In Progress</div>
          <div className="text-2xl font-black text-[#022c22]">{filteredGoals.onProgress.length}</div>
        </div>
        <div className="border-l border-[#dcfce7] pl-8">
          <div className="text-sm text-slate-500 mb-1 font-medium">Completed</div>
          <div className="text-2xl font-black text-[#10b981]">{filteredGoals.done.length}</div>
        </div>
        <div className="border-l border-[#dcfce7] pl-8">
          <div className="text-sm text-slate-500 mb-1 font-medium">Success Rate</div>
          <div className="text-2xl font-black text-[#022c22]">{completionRate}%</div>
        </div>
      </div>

        <div className="grid grid-cols-[120px_1fr_100px_100px] gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 border-b border-[#dcfce7] pb-4">
          <div>Category</div>
          <div>Goal breakdown</div>
          <div>Count</div>
          <div>Progress</div>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl tracking-tighter font-black uppercase mb-8 text-[#022c22] flex items-center gap-2">
            <span className="text-[#bef264] text-lg">■</span>
            Goals by Category
            <span className="text-sm text-slate-400 ml-3 font-normal capitalize">({reportTimeframe})</span>
          </h2>
          <div className="flex flex-col">
            {categories.length > 0 ? (
              categories.map(([cat, count]) => {
                const catIcon = CATEGORY_ICONS[cat] || 'solar:target-linear';
                const catPct = totalGoals > 0 ? Math.round((count / totalGoals) * 100) : 0;
                return (
                  <div
                    key={cat}
                    className="grid grid-cols-[120px_1fr_100px_100px] gap-8 items-center py-4 hover:bg-[#f0fdf4] px-4 -mx-4 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#f0fdf4] flex items-center justify-center flex-shrink-0 border border-[#dcfce7]">
                        <iconify-icon icon={catIcon} width="20" height="20" className="text-[#022c22]" />
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-black uppercase tracking-tighter text-[#022c22] w-32 truncate">{cat}</span>
                      <div className="flex-1 bg-[#dcfce7] rounded-full h-2">
                        <div className="bg-[#022c22] h-2 rounded-full transition-all duration-700 shadow-sm" style={{ width: `${catPct}%` }} />
                      </div>
                    </div>
                    <div className="text-lg font-black text-[#022c22]">{count}</div>
                    <div className="text-sm font-bold text-[#10b981]">{catPct}%</div>
                  </div>
                );
              })
            ) : (
              <div className="py-10 text-center font-bold text-slate-400 border border-dashed border-[#dcfce7] rounded-premium">
                No goals found for this timeframe.
              </div>
            )}
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl tracking-tighter font-black uppercase mb-8 text-[#022c22] flex items-center gap-2">
            <span className="text-[#bef264] text-lg">■</span>
            Daily Routine
          </h2>
          <div className="grid grid-cols-[120px_1fr_100px_100px] gap-8 items-center py-5 bg-white border border-[#dcfce7] px-6 rounded-premium shadow-soft">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f0fdf4] flex items-center justify-center flex-shrink-0">
                <iconify-icon icon="solar:sun-2-linear" width="20" height="20" className="text-[#022c22]" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-black uppercase tracking-tighter text-[#022c22] w-32">Tasks today</span>
              <div className="flex-1 bg-[#dcfce7] rounded-full h-2">
                <div className="bg-[#bef264] h-2 rounded-full transition-all duration-700 shadow-sm" style={{ width: `${dailyPct}%` }} />
              </div>
            </div>
            <div className="text-sm font-black text-[#022c22]">
              {dailyDone} / {dailyTasks.length}
            </div>
            <div className="text-sm text-[#10b981] font-black">{dailyPct}%</div>
          </div>
        </div>

        {/* Activity Heatmap */}
        <ContributionGrid />

        {/* Pros / Cons */}
        <div className="mt-16 grid grid-cols-2 gap-12">
          <div className="bg-[#f0fdf4] rounded-premium p-8 border border-[#dcfce7] shadow-soft">
            <h2 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-3 text-[#022c22]">
              <div className="w-8 h-8 rounded-full bg-[#bef264]/20 flex items-center justify-center text-[#94a3b8]">
                 <iconify-icon icon="solar:chart-square-linear" className="text-[#10b981] text-lg" />
              </div>
              High Completion
            </h2>
            <div className="space-y-4">
              {[...filteredGoals.onProgress, ...filteredGoals.done]
                .filter((g) => parseInt(g.progress) >= 70)
                .sort((a, b) => parseInt(b.progress) - parseInt(a.progress))
                .slice(0, 5)
                .map((g) => (
                  <div key={g.id} className="flex justify-between items-center text-sm">
                    <span className="text-[#022c22] font-black uppercase tracking-tighter truncate pr-4">{g.title}</span>
                    <span className="text-[#10b981] font-black">{g.progress}</span>
                  </div>
                ))}
              {[...filteredGoals.onProgress, ...filteredGoals.done].filter((g) => parseInt(g.progress) >= 70).length === 0 && (
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">No high progress goals yet. Keep going!</div>
              )}
            </div>
          </div>

          <div className="bg-rose-50/50 rounded-premium p-8 border border-rose-100 shadow-soft">
            <h2 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-3 text-[#022c22]">
              <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                 <iconify-icon icon="solar:danger-triangle-linear" className="text-rose-500 text-lg" />
              </div>
              Low Progress
            </h2>
            <div className="space-y-4">
              {filteredGoals.onProgress
                .filter((g) => parseInt(g.progress) < 30)
                .sort((a, b) => parseInt(a.progress) - parseInt(b.progress))
                .slice(0, 5)
                .map((g) => (
                  <div key={g.id} className="flex justify-between items-center text-sm">
                    <span className="text-[#022c22] font-black uppercase tracking-tighter truncate pr-4">{g.title}</span>
                    <span className="text-rose-500 font-black">{g.progress}</span>
                  </div>
                ))}
              {filteredGoals.onProgress.filter((g) => parseInt(g.progress) < 30).length === 0 && (
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Great job! All goals are making good progress.</div>
              )}
            </div>
          </div>
        </div>
    </>
  );
});
