import { useState, useEffect } from 'react';
import { Modal, Button } from '@/components';
import { useApp } from '@/context';
import { CATEGORY_LIST } from '@/constants';

export function EditTaskModal() {
  const { editingTask, setEditingTask, handleSaveEditTask, handleDeleteTask } = useApp();
  const [taskForm, setTaskForm] = useState({
    title: '',
    startTime: '09:00',
    endTime: '10:00',
    category: 'Work',
    subtasks: [] as { text: string; done: boolean }[],
  });
  const [newSubtask, setNewSubtask] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTaskForm({
        title: editingTask.title,
        startTime: editingTask.startTime,
        endTime: editingTask.endTime || '10:00',
        category: editingTask.category || 'Work',
        subtasks: editingTask.subtasks || [],
      });
    }
  }, [editingTask]);

  const handleSubmit = () => {
    if (!taskForm.title || !editingTask) return;
    // Pass complete updated task directly — no race condition
    const updatedTask = {
      ...editingTask,
      title: taskForm.title,
      startTime: taskForm.startTime,
      endTime: taskForm.endTime,
      category: taskForm.category,
      subtasks: taskForm.subtasks,
    };
    handleSaveEditTask(updatedTask);
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
    <Modal isOpen={!!editingTask} onClose={() => setEditingTask(null)} title="Refine Task" width="480px">
      <div className="space-y-6">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#022c22]/40 mb-3">Task Identity</label>
          <input
            type="text"
            placeholder="Operational objective..."
            value={taskForm.title}
            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
            className="w-full bg-[#f0fdf4] border border-[#dcfce7] rounded-xl px-4 py-3.5 text-sm focus:border-[#022c22]/30 outline-none transition-all placeholder-slate-300 text-[#022c22] font-bold"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#022c22]/40 mb-3">Execution Time</label>
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
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#022c22]/40 mb-3">Category</label>
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
          
          <div className="space-y-2 mb-4">
            {taskForm.subtasks.map((st, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-[#f0fdf4] border border-[#dcfce7] rounded-xl group">
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${st.done ? 'bg-[#bef264] border-[#bef264]' : 'border-[#dcfce7]'}`} />
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

      <div className="mt-10 pt-6 border-t border-[#dcfce7] flex flex-col gap-3">
        <Button onClick={handleSubmit} className="w-full">
          Implement Changes
        </Button>
        <div className="flex gap-3">
          <Button onClick={() => setEditingTask(null)} variant="secondary" className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={() => {
              if(editingTask) handleDeleteTask(editingTask.id);
              setEditingTask(null);
            }} 
            variant="secondary" 
            className="flex-1 border-rose-100 text-rose-500 hover:bg-rose-50 hover:border-rose-200"
          >
            Terminated Task
          </Button>
        </div>
      </div>
    </Modal>
  );
}
