import { memo, useMemo } from 'react';
import { useApp } from '@/context';
import { GoalDetailPanel, Button } from '@/components';
import { GoalSection } from './GoalRow';

export const GoalTimeline = memo(function GoalTimeline() {
  const {
    liveDate,
    searchQuery,
    setSearchQuery,
    setIsAddGoalModalOpen,
    onProgressGoals,
    doneGoals,
    selectedGoal,
    setSelectedGoal,
  } = useApp();

  const filteredProgress = useMemo(
    () => onProgressGoals.filter((g) => g.title.toLowerCase().includes(searchQuery.toLowerCase())),
    [onProgressGoals, searchQuery]
  );

  const filteredDone = useMemo(
    () => doneGoals.filter((g) => g.title.toLowerCase().includes(searchQuery.toLowerCase())),
    [doneGoals, searchQuery]
  );

  const totalGoals = onProgressGoals.length + doneGoals.length;

  return (
    <>
      <div className="flex justify-between items-center px-12 py-10 border-b border-[#dcfce7] bg-white shadow-sm">
        <div>
          <h1 className="text-4xl tracking-tighter font-black uppercase text-[#022c22]">Goal Timeline</h1>
          <p className="text-sm text-slate-500 mt-1">{liveDate}</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative">
            <iconify-icon
              icon="solar:magnifer-linear"
              width="18"
              height="18"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#022c22]/40"
            />
            <input
              type="text"
              placeholder="Search goal"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-[#dcfce7] rounded-xl pl-11 pr-4 py-2.5 text-sm outline-none focus:border-[#022c22]/30 w-64 transition-all placeholder:text-slate-400 text-[#022c22] bg-[#f0fdf4]"
              aria-label="Search goals"
            />
          </div>
          <Button onClick={() => setIsAddGoalModalOpen(true)}>
            <span className="text-lg leading-none shrink-0">+</span>
            <span className="pt-px">Add Goal</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 px-12 py-8 border-b border-[#dcfce7]">
        <div>
          <div className="text-sm text-slate-500 mb-1">Goal</div>
          <div className="text-base font-medium text-[#022c22]">This month</div>
        </div>
        <div className="border-l border-[#dcfce7] pl-8">
          <div className="text-sm text-slate-500 mb-1">Total</div>
          <div className="text-base font-medium text-[#022c22]">
            {totalGoals} Goal{totalGoals !== 1 ? 's' : ''}
          </div>
        </div>
        <div className="border-l border-[#dcfce7] pl-8">
          <div className="text-sm text-slate-500 mb-1">In progress</div>
          <div className="text-base font-medium text-[#022c22]">{onProgressGoals.length} Active</div>
        </div>
        <div className="border-l border-[#dcfce7] pl-8">
          <div className="text-sm text-slate-500 mb-1">Goal achieved</div>
          <div className="text-base font-medium text-[#022c22]">
            {doneGoals.length} Achievement{doneGoals.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <div className="px-12 pt-10 pb-20">
        <div className="grid grid-cols-[120px_1fr_150px_100px_100px] gap-6 text-[10px] font-black uppercase tracking-widest text-[#022c22]/40 mb-6 border-b border-[#dcfce7] pb-4">
          <div>Date created</div>
          <div>Goal name</div>
          <div>Due date</div>
          <div>Days left</div>
          <div>Target</div>
        </div>

        <GoalSection
          title="On progress"
          goals={filteredProgress}
          selectedGoal={selectedGoal}
          onSelectGoal={setSelectedGoal}
          emptyMessage="No goals found. Add your first goal to get started!"
        />

        <GoalSection
          title="Goal done"
          goals={filteredDone}
          selectedGoal={selectedGoal}
          onSelectGoal={setSelectedGoal}
          emptyMessage="No completed goals yet. Keep pushing!"
        />
      </div>

      {selectedGoal && <GoalDetailPanel goal={selectedGoal} onClose={() => setSelectedGoal(null)} />}
    </>
  );
});
