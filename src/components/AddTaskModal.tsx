import { useState } from 'react';
import { Modal, Button } from '@/components';
import { useApp } from '@/context';

export function AddTaskModal() {
  const { isAddTaskOpen, setIsAddTaskOpen, handleAddNewTask, setNewTaskForm } = useApp();
  const [taskForm, setTaskForm] = useState({
    title: '',
    startTime: '09:00',
    endTime: '10:00',
    category: 'Work',
    note: '',
  });

  const handleSubmit = () => {
    if (!taskForm.title) return;
    setNewTaskForm({
      title: taskForm.title,
      startTime: taskForm.startTime,
      endTime: taskForm.endTime,
      category: taskForm.category,
      note: taskForm.note,
    });
    handleAddNewTask();
    setTaskForm({ title: '', startTime: '09:00', endTime: '10:00', category: 'Work', note: '' });
    setIsAddTaskOpen(false);
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
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Health">Health</option>
            <option value="Learning">Learning</option>
          </select>
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
