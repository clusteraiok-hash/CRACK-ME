import { memo, useState } from 'react';
import type { Goal } from '@/types';
import { useApp } from '@/context';
import { Button, ProgressBar } from '@/components';
import { getGoalMetrics } from '@/utils/dateUtils';

interface GoalDetailPanelProps {
  goal: Goal;
  onClose: () => void;
}

export const GoalDetailPanel = memo(function GoalDetailPanel({ goal, onClose }: GoalDetailPanelProps) {
  const {
    handleMarkDone,
    handleDeleteGoal,
    handleEditGoal,
    setPlanningGoal,
    setActivePage,
    strategyPlans,
    setStrategyPlans,
    dailyTasks,
    computeGoalProgress,
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: goal.title,
    startDate: goal.startDate,
    dueDate: goal.dueDate,
    target: goal.target,
  });

  const linkedTasks = dailyTasks.filter(t => t.linkedGoalId === goal.id);
  const plan = strategyPlans.find(sp => sp.goalId === goal.id);
  const computedProgress = computeGoalProgress(goal.id);
  const { daysRemaining, isOverdue } = getGoalMetrics(goal.startDate, goal.dueDate);

  const totalMilestones = plan ? plan.phases.reduce((a, p) => a + p.milestones.length, 0) : 0;
  const doneMilestones = plan ? plan.phases.reduce((a, p) => a + p.milestones.filter(m => m.done).length, 0) : 0;

  const handlePlanStrategy = () => {
    let existingPlan = strategyPlans.find((sp) => sp.goalId === goal.id);
    if (!existingPlan) {
      existingPlan = {
        goalId: goal.id,
        goalTitle: goal.title,
        phases: [
          {
            id: 'ep1',
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
        ],
      };
      setStrategyPlans((prev) => [...prev, existingPlan!]);
    }
    setPlanningGoal(existingPlan);
    onClose();
    setActivePage('Strategy Planner');
  };

  const handleSaveEdit = () => {
    handleEditGoal(goal.id, {
      title: editForm.title,
      startDate: editForm.startDate,
      dueDate: editForm.dueDate,
      target: editForm.target,
    });
    setIsEditing(false);
  };

  return (
    <aside
      className="absolute top-10 right-10 w-[420px] bg-white rounded-premium shadow-premium p-10 z-50 max-h-[calc(100vh-80px)] overflow-y-auto border border-[#dcfce7] animate-slide-in-right"
      role="complementary"
      aria-label="Goal details"
    >
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-black tracking-tighter uppercase text-[#022c22]">Goal details</h2>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-[#022c22] hover:bg-[#f0fdf4] transition-all"
          aria-label="Close panel"
        >
          <iconify-icon icon="mingcute:close-line" width="24" height="24" />
        </button>
      </div>

      <div className="space-y-8">
        {/* Goal Name */}
        <div>
          <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#022c22]/30 mb-3">Objective</label>
          <div className="flex justify-between items-center group">
            {isEditing ? (
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="flex-1 bg-[#f0fdf4] border border-[#dcfce7] rounded-xl px-4 py-3 text-sm font-bold text-[#022c22] outline-none"
                autoFocus
              />
            ) : (
              <span className="text-xl font-black text-[#022c22] uppercase tracking-tighter leading-tight">{goal.title}</span>
            )}
            <button
              onClick={() => {
                if (isEditing) handleSaveEdit();
                else setIsEditing(true);
              }}
              className="ml-4 text-slate-300 hover:text-[#022c22] transition-colors"
              aria-label={isEditing ? 'Save' : 'Edit goal'}
            >
              <iconify-icon icon={isEditing ? 'solar:check-read-linear' : 'solar:pen-linear'} width="20" height="20" />
            </button>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-3 gap-6 p-6 bg-[#f0fdf4] rounded-2xl border border-[#dcfce7]/50">
          <div>
            <label className="block text-[8px] font-black uppercase tracking-widest text-[#022c22]/40 mb-2">Initiated</label>
            <div className="text-xs font-black text-[#022c22]">{goal.startDate}</div>
          </div>
          <div>
            <label className="block text-[8px] font-black uppercase tracking-widest text-[#022c22]/40 mb-2">Deadline</label>
            <div className="text-xs font-black text-[#022c22]">{goal.dueDate}</div>
          </div>
          <div>
            <label className="block text-[8px] font-black uppercase tracking-widest text-[#022c22]/40 mb-2">{isOverdue ? 'Overdue' : 'Remaining'}</label>
            <div className={`text-xs font-black ${isOverdue ? 'text-rose-500' : 'text-[#022c22]'}`}>
              {daysRemaining} Days
            </div>
          </div>
        </div>

        {/* Target */}
        <div>
          <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#022c22]/30 mb-3">Quantitative Target</label>
          <div className="text-sm font-bold text-[#022c22]">{goal.target}</div>
        </div>

        {/* Progress Overview */}
        <div>
          <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#022c22]/30 mb-4">Tactical Progress</label>
          <div className="space-y-4">
             <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-1">
                <span className="text-[#022c22]/40">Status</span>
                <span className={goal.status === 'Done' ? 'text-[#10b981]' : 'text-[#022c22]'}>{goal.status}</span>
             </div>
             <ProgressBar percentage={computedProgress} />
          </div>
        </div>

        {/* Strategy Summary */}
        {plan && (
          <div className="p-6 bg-[#f0fdf4] rounded-2xl border border-[#dcfce7]/50">
            <div className="text-[10px] font-black uppercase tracking-widest text-[#022c22]/40 mb-3">Strategic Architecture</div>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-xs font-black text-[#022c22]">{plan.phases.length} Phases Active</div>
                <div className="text-[10px] font-bold text-slate-400 mt-1">{doneMilestones} / {totalMilestones} Milestones Secured</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#bef264]/20 flex items-center justify-center border border-[#bef264]">
                 <iconify-icon icon="solar:routing-2-linear" width="20" height="20" className="text-[#022c22]" />
              </div>
            </div>
          </div>
        )}

        {/* Linked Tasks */}
        {linkedTasks.length > 0 && (
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#022c22]/30 mb-4">Daily Operations</label>
            <div className="space-y-3">
              {linkedTasks.slice(0, 3).map(task => (
                <div key={task.id} className="flex items-center gap-3 p-3 bg-white border border-[#f0fdf4] rounded-xl">
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${task.done ? 'bg-[#bef264] border-[#bef264]' : 'border-[#dcfce7]'}`}>
                     {task.done && <iconify-icon icon="solar:check-read-linear" width="10" height="10" className="text-[#022c22]" />}
                  </div>
                  <span className={`text-xs font-bold leading-none ${task.done ? 'line-through text-slate-300' : 'text-[#022c22]'}`}>{task.title}</span>
                </div>
              ))}
              {linkedTasks.length > 3 && (
                <div className="text-center text-[10px] font-black uppercase tracking-widest text-slate-400 pt-1">+{linkedTasks.length - 3} additional tasks</div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3 pt-8 border-t border-[#f0fdf4]">
          <Button
            onClick={handlePlanStrategy}
            className="w-full justify-center"
          >
            <iconify-icon icon="solar:routing-2-linear" width="18" height="18" />
            {plan ? 'Navigate Strategy' : 'Define Plan'}
          </Button>
          <div className="flex gap-3">
            {goal.status !== 'Done' && (
              <Button
                onClick={() => handleMarkDone(goal.id)}
                className="flex-1 justify-center"
              >
                Conclude
              </Button>
            )}
            <Button
              onClick={() => handleDeleteGoal(goal.id)}
              variant="secondary"
              className="flex-1 justify-center border-rose-100 text-rose-500 hover:bg-rose-50 hover:border-rose-200"
            >
              Exterminate
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
});
