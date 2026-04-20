import { useState } from 'react';
import { Modal, Button } from '@/components';
import { useApp } from '@/context';
import { CATEGORY_LIST } from '@/constants';

export function AddTaskModal() {
  const { isAddTaskOpen, setIsAddTaskOpen, handleAddNewTask } = useApp();
  const [taskForm, setTaskForm] = useState({
    title: '',
    startTime: '09:00',
    endTime: '10:00',
    category: 'Work',
    note: '',
    subtasks: [] as { text: string; done: boolean }[],
  });
  const [newSubtask, setNewSubtask] = useState('');

  const handleSubmit = () => {
    if (!taskForm.title) return;
    // Pass form data directly — no race condition
    handleAddNewTask({
      title: taskForm.title,
      startTime: taskForm.startTime,
      endTime: taskForm.endTime,
      category: taskForm.category,
      note: taskForm.note,
      subtasks: taskForm.subtasks,
    });
    setTaskForm({ title: '', startTime: '09:00', endTime: '10:00', category: 'Work', note: '', subtasks: [] });
    setNewSubtask('');
    setIsAddTaskOpen(false);
  };

  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    setTaskForm(prev => ({
      ...prev,
      subtasks: [...prev.subtasks, { text: newSubtask.trim(), done: false }]
    }));
    setNewSubtask('');
  };

  const removeSubtask = (index: number) => {
    setTaskForm(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter((_, i) => i !== index)
    }));
  };

  return (
    <Modal isOpen={isAddTaskOpen} onClose={() => setIsAddTaskOpen(false)} title="New Daily Task" width="480px">
      <div className="space-y-6">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#022c22]/40 mb-3">Task Identity</label>
          <input
            type="text"
            placeholder="What needs execution..."
            value={taskForm.title}
            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
            className="w-full bg-[#f0fdf4] border border-[#dcfce7] rounded-xl px-4 py-3.5 text-sm focus:border-[#022c22]/30 outline-none transition-all placeholder-slate-300 text-[#022c22] font-bold"
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#022c22]/40 mb-3">Initiation Time</label>
            <input
              type="time"
              value={taskForm.startTime}
              onChange={(e) => setTaskForm({ ...taskForm, startTime: e.target.value })}
              className="w-full bg-[#f0fdf4] border border-[#dcfce7] rounded-xl px-4 py-3.5 text-sm outline-none text-[#022c22] font-bold cursor-pointer transition-all focus:border-[#022c22]/30"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#022c22]/40 mb-3">Termination Time</label>
            <input
              type="time"
              value={taskForm.endTime}
              onChange={(e) => setTaskForm({ ...taskForm, endTime: e.target.value })}
              className="w-full bg-[#f0fdf4] border border-[#dcfce7] rounded-xl px-4 py-3.5 text-sm outline-none text-[#022c22] font-bold cursor-pointer transition-all focus:border-[#022c22]/30"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#022c22]/40 mb-3">Classification</label>
          <select
            value={taskForm.category}
            onChange={(e) => setTaskForm({ ...taskForm, category: e.target.value })}
            className="w-full bg-[#f0fdf4] border border-[#dcfce7] rounded-xl px-4 py-3.5 text-sm outline-none text-[#022c22] font-bold cursor-pointer transition-all focus:border-[#022c22]/30 appearance-none"
          >
            {CATEGORY_LIST.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="pt-4 border-t border-[#dcfce7]">
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#022c22]/40 mb-4">Operations Checklist</label>
          
          <div className="space-y-2 mb-4 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
            {taskForm.subtasks.map((st, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-[#f0fdf4] border border-[#dcfce7] rounded-xl group">
                <div className="w-4 h-4 rounded-full border-2 border-[#dcfce7] flex-shrink-0" />
                <span className="flex-1 text-xs font-bold text-[#022c22]">{st.text}</span>
                <button 
                  onClick={() => removeSubtask(idx)}
                  className="text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <iconify-icon icon="solar:trash-bin-2-linear" width="16" height="16" />
                </button>
              </div>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Add strategic sub-step..."
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSubtask()}
              className="w-full bg-[#f0fdf4] border border-[#dcfce7] rounded-xl px-4 py-3.5 text-xs focus:border-[#022c22]/30 outline-none transition-all placeholder-slate-300 text-[#022c22] font-bold pr-12"
            />
            <button
              onClick={addSubtask}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-[#bef264] text-[#022c22] flex items-center justify-center hover:shadow-soft transition-all"
            >
              <iconify-icon icon="solar:add-circle-linear" width="20" height="20" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-[#dcfce7] flex gap-3">
        <Button onClick={handleSubmit} className="flex-1">
          Deploy Task
        </Button>
        <Button onClick={() => setIsAddTaskOpen(false)} variant="secondary" className="flex-1">
          Cancel
        </Button>
      </div>
    </Modal>
  );
}
