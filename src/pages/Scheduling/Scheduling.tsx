import { memo, useMemo, useState } from 'react';
import { useApp } from '@/context';
import { Modal, Button } from '@/components';

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const EVENT_COLORS = ['#bef264', '#10b981', '#065f46', '#bef264', '#022c22', '#dcfce7'];

export const Scheduling = memo(function Scheduling() {
  const { dailyTasks, onProgressGoals, doneGoals, scheduledEvents, handleAddEvent, handleDeleteEvent } = useApp();
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', startTime: '09:00', endTime: '10:00', description: '' });

  const weekDates = useMemo(() => {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1) + currentWeekOffset * 7);
    
    return DAYS.map((_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  }, [currentWeekOffset]);

  const toDateStr = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const renderTasksForDay = (dayIndex: number) => {
    const date = weekDates[dayIndex];
    const dateStr = toDateStr(date);

    return dailyTasks
      .filter((task) => task.assignedDate === dateStr)
      .map((task) => {
        const timeParts = task.startTime.split(' - ')[0].split(':');
        if (timeParts.length < 2) return null;
        const startHour = parseInt(timeParts[0], 10);
        const startMin = parseInt(timeParts[1], 10) || 0;
        
        if (startHour < 8 || startHour > 19) return null;
        const top = (startHour - 8) * 64 + (startMin / 60) * 64 + 4;
        
        return (
          <div
            key={task.id}
            className={`absolute left-1 right-1 rounded-xl p-3 text-[10px] shadow-sm border border-[#dcfce7] overflow-hidden transition-all hover:scale-[1.02] cursor-pointer ${
              task.done ? 'opacity-40' : ''
            }`}
            style={{
              top: `${top}px`,
              height: '52px',
              backgroundColor: task.done ? 'transparent' : '#f0fdf4',
              borderLeft: `4px solid ${task.done ? '#cbd5e1' : '#022c22'}`,
              zIndex: 10,
            }}
          >
            <div className={`font-black uppercase tracking-tighter truncate ${task.done ? 'line-through text-slate-400' : 'text-[#022c22]'}`}>{task.title}</div>
            <div className="font-bold text-[#022c22]/40 mt-0.5">{task.startTime}</div>
          </div>
        );
      });
  };

  const renderEventsForDay = (dayIndex: number) => {
    const date = weekDates[dayIndex];
    const dateStr = toDateStr(date);
    
    return scheduledEvents
      .filter(evt => evt.date === dateStr)
      .map((evt) => {
        const [h, m] = evt.startTime.split(':').map(Number);
        if (h < 8 || h > 19) return null;
        const top = (h - 8) * 64 + ((m || 0) / 60) * 64 + 4;
        const [eh, em] = evt.endTime.split(':').map(Number);
        const duration = ((eh || h + 1) - h) * 64 + (((em || 0) - (m || 0)) / 60) * 64;

        return (
          <div
            key={evt.id}
            className="absolute left-1 right-1 rounded-xl p-3 text-[10px] shadow-soft overflow-hidden transition-all hover:scale-[1.02] cursor-pointer group border border-[#dcfce7]"
            style={{
              top: `${top}px`,
              height: `${Math.max(duration, 38)}px`,
              backgroundColor: '#ffffff',
              borderLeft: `4px solid ${evt.color}`,
              zIndex: 15,
            }}
            onClick={() => handleDeleteEvent(evt.id)}
          >
            <div className="font-black uppercase tracking-tighter truncate text-[#022c22]">{evt.title}</div>
            <div className="font-bold text-[#022c22]/40 mt-0.5">{evt.startTime} - {evt.endTime}</div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <iconify-icon icon="solar:trash-bin-2-linear" width="14" height="14" class="text-rose-400" />
            </div>
          </div>
        );
      });
  };

  const renderGoalsForDay = (dayIndex: number) => {
    const date = weekDates[dayIndex];
    const allGoals = [...onProgressGoals, ...doneGoals];

    return allGoals.filter(goal => {
      const lowerDueDate = goal.dueDate.toLowerCase();
      const isToday = lowerDueDate.includes('today') && date.toDateString() === new Date().toDateString();
      const dateStr = date.getDate().toString();
      const monthShort = date.toLocaleDateString('en-US', { month: 'short' }).toLowerCase();
      const matchesDate = lowerDueDate.includes(dateStr) && lowerDueDate.includes(monthShort);
      
      return isToday || matchesDate;
    }).map((goal) => (
      <div
        key={goal.id}
        className="mb-1 rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-widest bg-[#022c22] text-white flex items-center gap-2 truncate shadow-sm"
      >
        <div className={`w-1.5 h-1.5 rounded-full ${goal.status === 'Done' ? 'bg-[#bef264]' : 'bg-[#bef264]'}`} />
        {goal.title}
      </div>
    ));
  };

  const handleSubmitEvent = () => {
    if (!newEvent.title || !newEvent.date) return;
    handleAddEvent({
      title: newEvent.title,
      date: newEvent.date,
      startTime: newEvent.startTime,
      endTime: newEvent.endTime,
      color: EVENT_COLORS[Math.floor(Math.random() * EVENT_COLORS.length)],
      description: newEvent.description,
    });
    setNewEvent({ title: '', date: '', startTime: '09:00', endTime: '10:00', description: '' });
    setIsAddEventOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#f0fdf4] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-12 py-10 border-b border-[#dcfce7] bg-white shadow-sm">
        <div>
          <h1 className="text-4xl tracking-tighter font-black uppercase text-[#022c22]">Scheduling</h1>
          <p className="text-sm text-slate-500 mt-1">Plan your tactical execution</p>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center bg-[#f0fdf4] rounded-xl p-1.5 border border-[#dcfce7]">
            <button
              onClick={() => setCurrentWeekOffset(prev => prev - 1)}
              className="p-2 hover:bg-white hover:shadow-soft rounded-lg transition-all text-[#022c22]/40 hover:text-[#022c22]"
            >
              <iconify-icon icon="solar:alt-arrow-left-linear" width="20" />
            </button>
            <button
              onClick={() => setCurrentWeekOffset(0)}
              className="px-5 py-2 text-xs font-black uppercase tracking-widest hover:bg-white hover:shadow-soft rounded-lg transition-all text-[#022c22]/60"
            >
              Now
            </button>
            <button
              onClick={() => setCurrentWeekOffset(prev => prev + 1)}
              className="p-2 hover:bg-white hover:shadow-soft rounded-lg transition-all text-[#022c22]/40 hover:text-[#022c22]"
            >
              <iconify-icon icon="solar:alt-arrow-right-linear" width="20" />
            </button>
          </div>
          <div className="text-sm font-black uppercase tracking-tighter text-[#022c22]">
            {weekDates[0].toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </div>
          <Button
            onClick={() => {
              setNewEvent(prev => ({ ...prev, date: toDateStr(new Date()) }));
              setIsAddEventOpen(true);
            }}
          >
            <iconify-icon icon="solar:add-circle-linear" width="20" />
            Add Event
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-y-auto mt-8 px-12 pb-12">
        <div className="min-w-[900px] bg-white border border-[#dcfce7] rounded-premium overflow-hidden shadow-soft">
          {/* Grid Header */}
          <div className="grid grid-cols-[100px_repeat(7,1fr)] bg-[#f0fdf4]/50 border-b border-[#dcfce7]">
            <div className="h-16 border-r border-[#dcfce7]" />
            {DAYS.map((day, i) => {
              const date = weekDates[i];
              const isToday = date.toDateString() === new Date().toDateString();
              return (
                <div key={day} className="flex flex-col items-center justify-center h-16 border-r border-[#dcfce7] last:border-r-0">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#022c22]/30 mb-1">{day}</span>
                  <span className={`w-8 h-8 flex items-center justify-center rounded-xl text-xs font-black ${isToday ? 'bg-[#022c22] text-white shadow-soft' : 'text-[#022c22]'}`}>
                    {date.getDate()}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Grid Body */}
          <div className="relative">
            {HOURS.map((hour) => (
              <div key={hour} className="grid grid-cols-[100px_repeat(7,1fr)] h-16 border-b border-[#f0fdf4] last:border-b-0">
                <div className="flex items-start justify-center pt-3 border-r border-[#dcfce7] text-[10px] font-black text-[#022c22]/30 uppercase tracking-tighter">
                  {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
                </div>
                {DAYS.map((_, i) => (
                  <div key={i} className="border-r border-[#f0fdf4] last:border-r-0" />
                ))}
              </div>
            ))}

            {/* Event Overlay */}
            <div className="absolute top-0 left-[100px] right-0 bottom-0 grid grid-cols-7 pointer-events-none">
              {DAYS.map((_, i) => {
                const date = weekDates[i];
                return (
                  <div key={i} className="relative border-r border-[#dcfce7]/30 last:border-r-0 pointer-events-auto">
                    <div className="absolute top-2 left-2 right-2 flex flex-col gap-1 z-20">
                      {renderGoalsForDay(i)}
                    </div>
                    <div className="h-full relative mt-12">
                      {renderTasksForDay(i)}
                      {renderEventsForDay(i)}
                      
                      {/* Timeline Indicator */}
                      {(() => {
                        const now = new Date();
                        const todayStr = toDateStr(now);
                        if (toDateStr(date) === todayStr) {
                          const nowH = now.getHours();
                          const nowM = now.getMinutes();
                          if (nowH >= 8 && nowH <= 19) {
                            return (
                              <div
                                className="absolute left-0 right-0 border-t-2 border-rose-500 z-30 pointer-events-none"
                                style={{ top: `${(nowH - 8) * 64 + (nowM / 60) * 64}px` }}
                              >
                                <div className="w-2 h-2 rounded-full bg-rose-500 absolute -left-1 -top-1 shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
                              </div>
                            );
                          }
                        }
                        return null;
                      })()}
                    </div>
                  </div>
                );
              })}
            </div>
            
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      <Modal isOpen={isAddEventOpen} onClose={() => setIsAddEventOpen(false)} title="New Event" width="480px">
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-[#022c22]/40 mb-3">Event Identity</label>
            <input
              type="text"
              placeholder="Strategic Session, Client Call..."
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="w-full bg-[#f0fdf4] border border-[#dcfce7] rounded-xl px-4 py-3 text-sm focus:border-[#022c22]/30 outline-none text-[#022c22] font-medium"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-[#022c22]/40 mb-3">Timeline Date</label>
              <input
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                className="w-full bg-[#f0fdf4] border border-[#dcfce7] rounded-xl px-4 py-3 text-sm outline-none text-[#022c22] font-medium"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-[#022c22]/40 mb-3">Start</label>
                <input type="time" value={newEvent.startTime} onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })} className="w-full bg-[#f0fdf4] border border-[#dcfce7] rounded-xl px-3 py-3 text-sm outline-none text-[#022c22]" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-[#022c22]/40 mb-3">End</label>
                <input type="time" value={newEvent.endTime} onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })} className="w-full bg-[#f0fdf4] border border-[#dcfce7] rounded-xl px-3 py-3 text-sm outline-none text-[#022c22]" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-[#022c22]/40 mb-3">Strategic Context</label>
            <textarea
              placeholder="Detailed objectives..."
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              className="w-full bg-[#f0fdf4] border border-[#dcfce7] rounded-xl px-4 py-3 text-sm outline-none text-[#022c22] h-24 resize-none"
            />
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-[#dcfce7] flex gap-3">
          <Button onClick={handleSubmitEvent} className="flex-1">Deploy Event</Button>
          <Button onClick={() => setIsAddEventOpen(false)} variant="secondary" className="flex-1">Abort</Button>
        </div>
      </Modal>
    </div>
  );
});
