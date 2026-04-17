import { useState } from 'react';
import { Modal, Button } from '@/components';
import { useApp } from '@/context';
import { validateGoalForm } from '@/utils/validation';

export function AddGoalModal() {
  const { isAddGoalModalOpen, setIsAddGoalModalOpen, newGoalForm, setNewGoalForm, handleAddGoalSubmit } =
    useApp();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (openPlanner: boolean) => {
    const validationErrors = validateGoalForm(newGoalForm);
    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach((err) => {
        errorMap[err.field] = err.message;
      });
      setErrors(errorMap);
      return;
    }
    setErrors({});
    handleAddGoalSubmit(openPlanner);
  };

  const handleClose = () => {
    setIsAddGoalModalOpen(false);
    setErrors({});
  };

  return (
    <Modal isOpen={isAddGoalModalOpen} onClose={handleClose} title="Establish Objective" width="520px">
      <div className="space-y-6">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#022c22]/40 mb-3">Objective Identity</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Strategic outcome..."
              value={newGoalForm.name}
              onChange={(e) => setNewGoalForm({ ...newGoalForm, name: e.target.value })}
              className={`w-full bg-[#f0fdf4] border border-[#dcfce7] rounded-xl px-4 py-3.5 text-sm focus:border-[#022c22]/30 outline-none transition-all placeholder-slate-300 text-[#022c22] font-bold ${
                errors.name ? 'border-rose-300' : ''
              }`}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#022c22]/20">
              <iconify-icon icon="solar:pen-linear" width="18" height="18" />
            </div>
          </div>
          {errors.name && <p className="text-[10px] uppercase font-black tracking-tight text-rose-500 mt-2 ml-1">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#022c22]/40 mb-3">Initiation</label>
            <input
              type="date"
              value={newGoalForm.startDate}
              onChange={(e) => setNewGoalForm({ ...newGoalForm, startDate: e.target.value })}
              className="w-full bg-[#f0fdf4] border border-[#dcfce7] rounded-xl px-4 py-3.5 text-sm outline-none text-[#022c22] font-bold cursor-pointer transition-all focus:border-[#022c22]/30"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#022c22]/40 mb-3">Deadline</label>
            <input
              type="date"
              value={newGoalForm.dueDate}
              onChange={(e) => setNewGoalForm({ ...newGoalForm, dueDate: e.target.value })}
              className={`w-full bg-[#f0fdf4] border border-[#dcfce7] rounded-xl px-4 py-3.5 text-sm outline-none text-[#022c22] font-bold cursor-pointer transition-all focus:border-[#022c22]/30 ${
                errors.dueDate ? 'border-rose-300' : ''
              }`}
            />
            {errors.dueDate && <p className="text-[10px] uppercase font-black tracking-tight text-rose-500 mt-2 ml-1">{errors.dueDate}</p>}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#022c22]/40 mb-3">Key Metric</label>
          <input
            type="text"
            placeholder="Quantitative target..."
            value={newGoalForm.target}
            onChange={(e) => setNewGoalForm({ ...newGoalForm, target: e.target.value })}
            className="w-full bg-[#f0fdf4] border border-[#dcfce7] rounded-xl px-4 py-3.5 text-sm outline-none transition-all focus:border-[#022c22]/30 placeholder-slate-300 text-[#022c22] font-bold"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#022c22]/40 mb-3">Detailed Context</label>
          <textarea
            placeholder="Strategic intent and alignment..."
            value={newGoalForm.description}
            onChange={(e) => setNewGoalForm({ ...newGoalForm, description: e.target.value })}
            className="w-full bg-[#f0fdf4] border border-[#dcfce7] rounded-xl px-4 py-3.5 text-sm outline-none transition-all focus:border-[#022c22]/30 h-28 resize-none text-[#022c22] font-bold placeholder-slate-300"
          />
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-[#dcfce7] space-y-4">
        <div className="flex gap-4">
          <Button onClick={() => handleSubmit(false)} className="flex-1">
            Establish Goal
          </Button>
          <Button onClick={handleClose} variant="secondary" className="flex-1">
            Abort
          </Button>
        </div>
        <Button onClick={() => handleSubmit(true)} variant="primary" className="w-full justify-center">
          <iconify-icon icon="solar:routing-2-linear" width="20" height="20" />
          Plan Strategic Breakdown
        </Button>
      </div>
    </Modal>
  );
}
