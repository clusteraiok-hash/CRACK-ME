import { memo, useMemo, useCallback, Fragment, useState } from 'react';
import { useApp } from '@/context';
import { Button, ProgressBar } from '@/components';
import type { StrategyPlan, Phase } from '@/types';

export const StrategyPlanner = memo(function StrategyPlanner() {
  const {
    planningGoal,
    setPlanningGoal,
    setStrategyPlans,
    strategyPlans,
    setActivePage,
    liveDate,
    addToast,
    logActivity,
    setOnProgressGoals,
    computeGoalProgress,
  } = useApp();

  const [showPlanList, setShowPlanList] = useState(!planningGoal);

  const totalMilestones = useMemo(
    () => planningGoal?.phases.reduce((a, p) => a + p.milestones.length, 0) ?? 0,
    [planningGoal]
  );

  const doneMilestones = useMemo(
    () => planningGoal?.phases.reduce((a, p) => a + p.milestones.filter((m) => m.done).length, 0) ?? 0,
    [planningGoal]
  );

  const overallPct = totalMilestones > 0 ? Math.round((doneMilestones / totalMilestones) * 100) : 0;

  const updatePlan = useCallback(
    (updated: StrategyPlan) => {
      setPlanningGoal(updated);
      setStrategyPlans((prev) => prev.map((sp) => (sp.goalId === updated.goalId ? updated : sp)));
    },
    [setPlanningGoal, setStrategyPlans]
  );

  const syncGoalProgress = useCallback(
    (goalId: number) => {
      const pct = computeGoalProgress(goalId);
      setOnProgressGoals(prev =>
        prev.map(g => g.id === goalId ? { ...g, progress: `${pct}%` } : g)
      );
    },
    [computeGoalProgress, setOnProgressGoals]
  );

  const toggleMilestone = useCallback(
    (phaseId: string, mIdx: number) => {
      if (!planningGoal) return;
      const phase = planningGoal.phases.find(p => p.id === phaseId);
      const milestone = phase?.milestones[mIdx];
      const wasNotDone = milestone && !milestone.done;

      const updated: StrategyPlan = {
        ...planningGoal,
        phases: planningGoal.phases.map((p) => {
          if (p.id !== phaseId) return p;
          const newMilestones = p.milestones.map((m, i) => (i === mIdx ? { ...m, done: !m.done } : m));
          const allDone = newMilestones.every(m => m.done);
          const anyDone = newMilestones.some(m => m.done);
          const newStatus: Phase['status'] = allDone ? 'done' : anyDone ? 'active' : 'upcoming';
          return { ...p, milestones: newMilestones, status: newStatus };
        }),
      };
      updatePlan(updated);
      syncGoalProgress(planningGoal.goalId);

      if (wasNotDone) {
        addToast('success', `Milestone completed! 🎯`);
        logActivity('milestone_completed', `Completed: ${milestone?.text}`, planningGoal.goalId);
      }
    },
    [planningGoal, updatePlan, syncGoalProgress, addToast, logActivity]
  );

  const addPhase = useCallback(() => {
    if (!planningGoal) return;
    const newPhase: Phase = {
      id: 'ph' + Date.now(),
      name: 'New Phase',
      timeframe: 'TBD',
      status: 'upcoming',
      milestones: [{ text: 'Define milestone', done: false }],
      keyActions: '',
      risks: '',
    };
    updatePlan({ ...planningGoal, phases: [...planningGoal.phases, newPhase] });
    addToast('info', 'New phase added.');
  }, [planningGoal, updatePlan, addToast]);

  const updatePhase = useCallback(
    (phaseId: string, field: keyof Phase, value: string) => {
      if (!planningGoal) return;
      updatePlan({
        ...planningGoal,
        phases: planningGoal.phases.map((p) => (p.id === phaseId ? { ...p, [field]: value } : p)),
      });
    },
    [planningGoal, updatePlan]
  );

  const addMilestone = useCallback(
    (phaseId: string) => {
      if (!planningGoal) return;
      updatePlan({
        ...planningGoal,
        phases: planningGoal.phases.map((p) =>
          p.id === phaseId ? { ...p, milestones: [...p.milestones, { text: '', done: false }] } : p
        ),
      });
    },
    [planningGoal, updatePlan]
  );

  const updateMilestoneText = useCallback(
    (phaseId: string, mIdx: number, text: string) => {
      if (!planningGoal) return;
      updatePlan({
        ...planningGoal,
        phases: planningGoal.phases.map((p) =>
          p.id !== phaseId
            ? p
            : { ...p, milestones: p.milestones.map((m, i) => (i === mIdx ? { ...m, text } : m)) }
        ),
      });
    },
    [planningGoal, updatePlan]
  );

  const deleteMilestone = useCallback(
    (phaseId: string, mIdx: number) => {
      if (!planningGoal) return;
      updatePlan({
        ...planningGoal,
        phases: planningGoal.phases.map((p) =>
          p.id !== phaseId
            ? p
            : { ...p, milestones: p.milestones.filter((_, i) => i !== mIdx) }
        ),
      });
    },
    [planningGoal, updatePlan]
  );

  const deletePhase = useCallback(
    (phaseId: string) => {
      if (!planningGoal) return;
      updatePlan({ ...planningGoal, phases: planningGoal.phases.filter((p) => p.id !== phaseId) });
      addToast('info', 'Phase deleted.');
    },
    [planningGoal, updatePlan, addToast]
  );

  const handleBack = () => {
    setActivePage('Goal Timeline');
    setPlanningGoal(null);
  };

  if (!planningGoal || showPlanList) {
    return (
      <div className="flex flex-col h-full overflow-hidden bg-[#f0fdf4]">
        <div className="flex justify-between items-center px-12 py-10 border-b border-[#dcfce7] bg-white shadow-sm">
          <div>
            <h1 className="text-4xl tracking-tighter font-black uppercase text-[#022c22]">Strategy</h1>
            <p className="text-sm text-slate-500 mt-1">{liveDate}</p>
          </div>
          <Button onClick={handleBack}>
             Timeline
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-12 pt-10 pb-20">
          {strategyPlans.length === 0 ? (
            <div className="py-20 text-center text-slate-400 border border-dashed border-[#dcfce7] rounded-premium bg-white shadow-soft">
              <iconify-icon icon="solar:routing-2-linear" width="48" height="48" className="text-[#022c22]/10 mb-4" />
              <p className="text-sm font-bold uppercase tracking-widest text-[#022c22]/40">No strategy plans yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-8">
              {strategyPlans.map((plan) => {
                const planDone = plan.phases.reduce((a, p) => a + p.milestones.filter(m => m.done).length, 0);
                const planTotal = plan.phases.reduce((a, p) => a + p.milestones.length, 0);
                const planPct = planTotal > 0 ? Math.round((planDone / planTotal) * 100) : 0;

                return (
                  <button
                    key={plan.goalId}
                    onClick={() => {
                      setPlanningGoal(plan);
                      setShowPlanList(false);
                    }}
                    className="bg-white border border-[#dcfce7] rounded-premium p-8 text-left hover:border-[#022c22]/20 hover:shadow-soft transition-all group"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 rounded-xl bg-[#f0fdf4] flex items-center justify-center text-[#022c22] border border-[#dcfce7]">
                        <iconify-icon icon="solar:routing-2-linear" width="24" height="24" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#022c22]/30 group-hover:text-[#022c22]/60 transition-colors">Strategic</span>
                    </div>
                    <h3 className="text-xl font-black text-[#022c22] mb-2 truncate tracking-tighter uppercase">{plan.goalTitle}</h3>
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#bef264]" />
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{plan.phases.length} Phases · {planTotal} Milestones</span>
                    </div>
                    
                    <div className="w-full bg-[#dcfce7] rounded-full h-2 mb-2">
                      <div 
                        className="bg-[#022c22] h-2 rounded-full transition-all duration-700 shadow-sm"
                        style={{ width: `${planPct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span>Performance</span>
                      <span className="text-[#022c22]">{planPct}%</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  const plan = planningGoal;

  return (
    <>
      <div className="flex justify-between items-center px-12 py-10 border-b border-[#dcfce7] bg-white shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={handleBack}
              className="text-xs font-black uppercase tracking-widest text-[#022c22]/40 hover:text-[#022c22] transition-colors"
            >
              Timeline
            </button>
            <span className="text-slate-200">/</span>
            <button
              onClick={() => setShowPlanList(true)}
              className="text-xs font-black uppercase tracking-widest text-[#022c22]/40 hover:text-[#022c22] transition-colors"
            >
              All Plans
            </button>
          </div>
          <h1 className="text-4xl tracking-tighter font-black uppercase text-[#022c22]">Strategy</h1>
          <p className="text-sm text-slate-500 mt-1">
            {liveDate} · Planning for <span className="text-[#022c22] font-black uppercase">{plan.goalTitle}</span>
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">Milestones</div>
            <div className="text-xl font-black text-[#022c22]">
              {doneMilestones}
              <span className="text-slate-300"> / {totalMilestones}</span>
            </div>
          </div>
          <div className="w-16 h-16 rounded-premium border-2 border-[#bef264] flex flex-col items-center justify-center bg-[#bef264]/10 shadow-soft">
            <span className="text-sm font-black text-[#022c22] leading-none">{overallPct}%</span>
            <span className="text-[8px] uppercase tracking-tighter text-[#022c22]/60 mt-0.5 font-bold">LVL</span>
          </div>
          <Button onClick={addPhase}>
            <span className="text-lg leading-none">+</span> Add Phase
          </Button>
        </div>
      </div>

      <div className="px-12 pt-6 pb-2">
        <ProgressBar percentage={overallPct} />
      </div>

      <div className="px-12 pt-6 pb-4">
        <div className="flex items-center gap-1">
          {plan.phases.map((phase, pi) => {
            const phaseDone = phase.milestones.filter((m) => m.done).length;
            const phasePct = phase.milestones.length > 0 ? Math.round((phaseDone / phase.milestones.length) * 100) : 0;
            return (
              <Fragment key={phase.id}>
                <div className="flex-1 relative">
                  <div className="h-2 rounded-full bg-[#dcfce7]">
                    <div
                      className={`h-2 rounded-full transition-all duration-700 ${
                        phase.status === 'done' ? 'bg-[#10b981]' : phase.status === 'active' ? 'bg-[#022c22]' : 'bg-slate-200'
                      }`}
                      style={{ width: `${phasePct}%` }}
                    />
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-tighter text-slate-400 mt-2 text-center truncate">{phase.name}</div>
                </div>
                {pi < plan.phases.length - 1 && (
                  <div className="w-8 flex items-center justify-center flex-shrink-0 -mt-5">
                    <iconify-icon icon="solar:arrow-right-linear" width="14" height="14" className="text-slate-200" />
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>
      </div>

      <div className="px-12 pt-4 pb-20 space-y-6">
        {plan.phases.map((phase) => {
          const phaseDone = phase.milestones.filter((m) => m.done).length;
          const phasePct = phase.milestones.length > 0 ? Math.round((phaseDone / phase.milestones.length) * 100) : 0;

          return (
            <div key={phase.id} className="bg-white border border-[#dcfce7] rounded-premium overflow-hidden shadow-soft">
              <div className="flex items-center justify-between p-7 bg-white">
                <div className="flex items-center gap-5">
                  <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    phase.status === 'done' ? 'bg-[#bef264] text-[#022c22]' : 'bg-[#f0fdf4] text-[#022c22]/50 border border-[#dcfce7]'
                  }`}>
                    {phase.status}
                  </div>
                  <input
                    type="text"
                    value={phase.name}
                    onChange={(e) => updatePhase(phase.id, 'name', e.target.value)}
                    className="text-xl font-black tracking-tighter uppercase outline-none text-[#022c22] bg-transparent"
                    aria-label="Phase name"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-[#f0fdf4] border border-[#dcfce7] px-4 py-2 rounded-xl">
                    <iconify-icon icon="solar:clock-circle-linear" width="16" height="16" className="text-[#022c22]/40" />
                    <input
                      type="text"
                      value={phase.timeframe}
                      onChange={(e) => updatePhase(phase.id, 'timeframe', e.target.value)}
                      className="text-xs font-bold outline-none bg-transparent text-[#022c22] w-24"
                      aria-label="Timeframe"
                    />
                  </div>
                  <div className="text-sm font-black text-[#022c22] ml-4">{phasePct}%</div>
                  <button
                    onClick={() => deletePhase(phase.id)}
                    className="text-slate-200 hover:text-rose-500 transition-colors ml-4"
                    aria-label="Delete phase"
                  >
                    <iconify-icon icon="solar:trash-bin-2-linear" width="20" height="20" />
                  </button>
                </div>
              </div>

              <div className="px-7 pb-6 space-y-3 border-t border-[#f0fdf4] pt-6 bg-[#f0fdf4]/30">
                <div className="text-[10px] text-[#022c22]/40 mb-2 font-black uppercase tracking-[0.2em]">Operational Milestones</div>
                {phase.milestones.map((m, mi) => (
                  <div key={mi} className="flex items-center gap-4 group">
                    <button
                      onClick={() => toggleMilestone(phase.id, mi)}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        m.done ? 'bg-[#bef264] border-[#bef264]' : 'border-[#dcfce7] hover:border-[#022c22]'
                      }`}
                      aria-label={m.done ? 'Mark incomplete' : 'Mark complete'}
                    >
                      {m.done && (
                        <iconify-icon icon="solar:check-read-linear" width="12" height="12" className="text-[#bef264]" />
                      )}
                    </button>
                    <input
                      type="text"
                      value={m.text}
                      onChange={(e) => updateMilestoneText(phase.id, mi, e.target.value)}
                      placeholder="Input strategic milestone..."
                      className={`flex-1 text-sm font-bold outline-none bg-transparent transition-all ${
                        m.done ? 'line-through text-slate-400' : 'text-[#022c22]'
                      }`}
                      aria-label="Milestone text"
                    />
                    <button
                      onClick={() => deleteMilestone(phase.id, mi)}
                      className="text-slate-200 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                      aria-label="Delete milestone"
                    >
                      <iconify-icon icon="solar:trash-bin-2-linear" width="16" height="16" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addMilestone(phase.id)}
                  className="text-xs font-black uppercase tracking-widest text-[#022c22]/30 hover:text-[#022c22] flex items-center gap-2 pt-2 transition-colors"
                >
                  <span className="text-lg">+</span> Add strategic point
                </button>
              </div>

              <div className="grid grid-cols-2 gap-0 border-t border-[#dcfce7]">
                <div className="p-6 border-r border-[#dcfce7]">
                  <div className="flex items-center gap-2 mb-3">
                    <iconify-icon icon="solar:bolt-linear" width="14" height="14" className="text-[#bef264]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#022c22]/40">Key Actions</span>
                  </div>
                  <input
                    type="text"
                    value={phase.keyActions}
                    onChange={(e) => updatePhase(phase.id, 'keyActions', e.target.value)}
                    placeholder="Focus areas..."
                    className="text-sm font-medium text-[#022c22] outline-none bg-transparent w-full placeholder-slate-300"
                    aria-label="Key actions"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <iconify-icon icon="solar:danger-triangle-linear" width="14" height="14" className="text-rose-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#022c22]/40">Critical Risks</span>
                  </div>
                  <input
                    type="text"
                    value={phase.risks}
                    onChange={(e) => updatePhase(phase.id, 'risks', e.target.value)}
                    placeholder="Blockers..."
                    className="text-sm font-medium text-[#022c22] outline-none bg-transparent w-full placeholder-slate-300"
                    aria-label="Risks"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
});
