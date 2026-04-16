import React, { useState, useMemo, useEffect } from 'react';

/* ───────────────────── icon map for nav ───────────────────── */
const NAV_ICONS = {
    'Goal Timeline': 'solar:chart-2-linear',
    'Daily Routine': 'solar:sun-2-linear',
    'Report': 'solar:document-text-linear',
    'Help center': 'solar:question-circle-linear',
};

/* ───────── category → icon mapping ───────── */
const CATEGORY_ICONS = {
    'Wellness': 'solar:heart-pulse-linear',
    'Fitness': 'solar:running-2-linear',
    'Work': 'solar:case-linear',
    'Development': 'solar:code-linear',
    'Health': 'solar:heart-pulse-linear',
    'Learning': 'solar:book-2-linear',
    'Social media': 'simple-icons:instagram',
    'Finance': 'solar:wallet-money-linear',
    'Personal': 'solar:user-circle-linear',
    'Design': 'solar:palette-2-linear',
    'Marketing': 'solar:letter-linear',
    'Meeting': 'solar:users-group-rounded-linear',
    'Food': 'solar:cup-hot-linear',
    'Creative': 'solar:pen-new-square-linear',
    'Sports': 'solar:running-2-linear',
    'Music': 'solar:music-note-2-linear',
    'Travel': 'solar:globe-linear',
    'Shopping': 'solar:bag-2-linear',
    'Home': 'solar:home-2-linear',
    'Custom': 'solar:target-linear',
};

const CATEGORY_LIST = Object.keys(CATEGORY_ICONS);

/* ───────── India timezone helpers ───────── */
const getISTTime = () => new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true });
const getISTTimeFull = () => new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
const getISTDate = () => new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const getISTShortDate = () => new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric' });
const getISTNow = () => {
    const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    return { year: d.getFullYear(), month: d.getMonth(), day: d.getDate(), weekday: d.getDay(), hours: d.getHours(), minutes: d.getMinutes() };
};

/* ───────── calendar helpers ───────── */
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_LABELS = ['Su','Mo','Tu','We','Th','Fr','Sa'];
const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

/* ───────── fake daily routine data ───────── */
const DAILY_TASKS = [
    { id: 'd1', time: '06:00 AM', title: 'Morning Meditation', category: 'Wellness', note: 'Focus on breathing for 15 min', subtasks: [{ text: 'Set up mat', done: true }, { text: 'Guided session', done: true }], done: true },
    { id: 'd2', time: '07:00 AM', title: 'Gym Workout', category: 'Fitness', note: 'Upper body day - bench press & rows', subtasks: [{ text: 'Warm up 10 min', done: true }, { text: 'Main workout', done: true }, { text: 'Cool down stretch', done: false }], done: true },
    { id: 'd3', time: '08:30 AM', title: 'Team Stand-up Meeting', category: 'Meeting', note: 'Daily sync with dev team on Zoom', subtasks: [{ text: 'Review blockers', done: true }, { text: 'Share updates', done: true }], done: true },
    { id: 'd4', time: '09:00 AM', title: 'Code Review & PR Merge', category: 'Development', note: 'Review feature branch #42 and auth module', subtasks: [{ text: 'Check unit tests', done: false }, { text: 'Review code quality', done: false }, { text: 'Approve & merge', done: false }], done: false },
    { id: 'd5', time: '12:00 PM', title: 'Lunch Break & Walk', category: 'Food', note: 'Try the new cafe downtown', subtasks: [{ text: 'Order food', done: false }, { text: '15 min walk', done: false }], done: false },
    { id: 'd6', time: '02:00 PM', title: 'Client Presentation Prep', category: 'Work', note: 'Q4 metrics deck for Acme Corp', subtasks: [{ text: 'Finalize slides', done: false }, { text: 'Practice pitch', done: false }, { text: 'Send calendar invite', done: false }], done: false },
    { id: 'd7', time: '04:00 PM', title: 'Read 30 Pages of Book', category: 'Learning', note: 'Atomic Habits by James Clear - Chapter 8', subtasks: [{ text: 'Read chapter', done: false }, { text: 'Take notes', done: false }], done: false },
    { id: 'd8', time: '06:00 PM', title: 'Instagram Content Creation', category: 'Social media', note: 'Reel editing + story design for brand', subtasks: [{ text: 'Shoot reel', done: false }, { text: 'Edit & add captions', done: false }, { text: 'Schedule post', done: false }], done: false },
    { id: 'd9', time: '09:00 PM', title: 'Journal & Reflection', category: 'Creative', note: 'Gratitude journal + day review', subtasks: [{ text: 'Write 3 things grateful for', done: false }, { text: 'Plan tomorrow', done: false }], done: false },
];

/* ───────── help center data ───────── */
const HELP_ITEMS = [
    { q: 'How do I create a new goal?', a: 'Click the "+ Add Goal" button in the top-right corner of the Goal Timeline page. Fill in the goal name, dates, target, and description, then click "Add Goal" to save.' },
    { q: 'Can I edit an existing goal?', a: 'Yes! Click on any goal row to open the Goal Detail panel. You can view all the details and use the edit icon next to the goal name to modify it.' },
    { q: 'How do routines work?', a: 'Routines are organized into a Daily view with subtasks, notes, and time tracking. Click the edit icon to modify any task, add subtasks, or write notes.' },
    { q: 'Where can I see my progress reports?', a: 'Navigate to the "Report" section from the sidebar. You\'ll find visual charts showing your goal completion rate, category breakdown, and daily activity.' },
    { q: 'How do I mark a goal as done?', a: 'When a goal reaches 100% progress, it automatically moves to the "Goal Done" section. You can also manually update progress from the Goal Detail panel.' },
    { q: 'Can I delete a goal?', a: 'Currently, goals can be archived by marking them as done. Full delete functionality will be available in a future update.' },
    { q: 'How is the achievement count calculated?', a: 'Achievements are counted based on the number of goals that have reached 100% completion and moved to the "Goal Done" section.' },
    { q: 'Is my data saved?', a: 'In this demo version, data is stored in the browser session. For production use, data will sync to your cloud account automatically.' },
];

/* ═══════════════════════════════════════════════════════════════ */
export default function App() {
    const [activePage, setActivePage] = useState('Goal Timeline');
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [newGoalForm, setNewGoalForm] = useState({ name: '', startDate: '', dueDate: '', target: '', description: '' });

    /* live clock */
    const [liveClock, setLiveClock] = useState(getISTTimeFull());
    const [liveDate, setLiveDate] = useState(getISTDate());
    useEffect(() => {
        const timer = setInterval(() => { setLiveClock(getISTTimeFull()); setLiveDate(getISTDate()); }, 1000);
        return () => clearInterval(timer);
    }, []);

    /* calendar state */
    const istNow = getISTNow();
    const [calMonth, setCalMonth] = useState(istNow.month);
    const [calYear, setCalYear] = useState(istNow.year);
    const calDays = getDaysInMonth(calYear, calMonth);
    const calStart = getFirstDayOfMonth(calYear, calMonth);
    const calPrev = () => { if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); } else setCalMonth(calMonth - 1); };
    const calNext = () => { if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); } else setCalMonth(calMonth + 1); };

    /* routine state */
    const [dailyTasks, setDailyTasks] = useState(DAILY_TASKS);
    const [editingTask, setEditingTask] = useState(null);
    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
    const [newTaskForm, setNewTaskForm] = useState({ title: '', time: '', category: 'Work', note: '' });

    /* strategy planner */
    const [planningGoal, setPlanningGoal] = useState(null);
    const [strategyPlans, setStrategyPlans] = useState([
        {
            goalId: 2, goalTitle: 'Android Studio Course', phases: [
                { id: 'p1', name: 'Foundation', timeframe: 'Week 1-2', status: 'done', milestones: [
                    { text: 'Install Android Studio & configure SDK', done: true },
                    { text: 'Complete Kotlin basics tutorial', done: true },
                    { text: 'Build first Hello World app', done: true },
                ], keyActions: 'Complete 2 hrs daily study sessions', risks: 'Setup issues on older hardware' },
                { id: 'p2', name: 'Core Concepts', timeframe: 'Week 3-4', status: 'active', milestones: [
                    { text: 'Learn Activity lifecycle', done: true },
                    { text: 'Master RecyclerView & Adapters', done: false },
                    { text: 'Implement Navigation component', done: false },
                ], keyActions: 'Build 1 mini-project per concept', risks: 'Complexity jump from basics' },
                { id: 'p3', name: 'Intermediate Projects', timeframe: 'Week 5-7', status: 'upcoming', milestones: [
                    { text: 'Build a To-Do app with Room DB', done: false },
                    { text: 'Integrate REST API with Retrofit', done: false },
                    { text: 'Add authentication with Firebase', done: false },
                ], keyActions: 'Complete full project each week', risks: 'API integration debugging' },
                { id: 'p4', name: 'Final Capstone', timeframe: 'Week 8', status: 'upcoming', milestones: [
                    { text: 'Design capstone app UI', done: false },
                    { text: 'Implement all features', done: false },
                    { text: 'Test & deploy to Play Store', done: false },
                ], keyActions: 'Full-time development sprint', risks: 'Scope creep - keep MVP focused' },
            ]
        }
    ]);

    /* help center accordion */
    const [openFaq, setOpenFaq] = useState(null);

    /* settings modal */
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [settingsForm, setSettingsForm] = useState({ name: 'Arriva Elma', email: 'arriva@keepsgoal.com', notifications: true, darkMode: false, language: 'English' });

    /* goal lists */
    const [onProgressGoals, setOnProgressGoals] = useState([
        { id: 1, time: '09:05 AM', icon: 'simple-icons:instagram', title: 'Instagram Post Update', category: 'Social media', startDate: '30 Oct, 2022', dueDate: 'Today, 17:00 PM', target: 'Engagement', status: 'Active', progress: '55%' },
        { id: 2, time: '09:05 AM', icon: 'solar:code-linear', title: 'Android Studio Course', category: 'Learning', startDate: '30 Oct, 2022', dueDate: '25 Dec, 2022', target: 'Intermediate Level', status: 'Active', progress: '80%' },
        { id: 3, time: '09:05 AM', icon: 'solar:case-linear', title: 'Business Improvement', category: 'Business', startDate: '01 Nov, 2022', dueDate: '28 Dec, 2022', target: 'Sales target', status: 'Active', progress: '30%' },
    ]);
    const [doneGoals, setDoneGoals] = useState([
        { id: 4, time: '09:05 AM', icon: 'solar:home-2-linear', title: 'Home Interior Design', category: 'Property', startDate: '10 Oct, 2022', dueDate: '08 Nov, 2022', target: 'Interior Stuff', status: 'Done', progress: '100%' },
        { id: 5, time: '09:05 AM', icon: 'solar:bag-2-linear', title: 'Nike Air Jordan Shoe', category: 'Fashion shopping', startDate: '15 Oct, 2022', dueDate: '25 Oct, 2022', target: 'Upgrade Style', status: 'Done', progress: '100%' },
    ]);

    /* derived */
    const totalGoals = onProgressGoals.length + doneGoals.length;
    const filteredProgress = useMemo(() => onProgressGoals.filter(g => g.title.toLowerCase().includes(searchQuery.toLowerCase())), [onProgressGoals, searchQuery]);
    const filteredDone = useMemo(() => doneGoals.filter(g => g.title.toLowerCase().includes(searchQuery.toLowerCase())), [doneGoals, searchQuery]);

    /* ─── handlers ─── */
    const handleAddGoalSubmit = (openPlanner) => {
        const icons = ['solar:target-linear', 'solar:star-linear', 'solar:flag-linear', 'solar:rocket-2-linear', 'solar:cup-star-linear'];
        const newEntry = {
            id: Date.now(), time: getISTTime(), icon: icons[Math.floor(Math.random() * icons.length)],
            title: newGoalForm.name || 'Untitled Goal', category: 'Custom',
            startDate: newGoalForm.startDate || 'N/A', dueDate: newGoalForm.dueDate || 'N/A',
            target: newGoalForm.target || 'N/A', status: 'Active', progress: '0%',
        };
        setOnProgressGoals([newEntry, ...onProgressGoals]);
        setIsAddGoalModalOpen(false);
        setNewGoalForm({ name: '', startDate: '', dueDate: '', target: '', description: '' });
        if (openPlanner) {
            const newPlan = { goalId: newEntry.id, goalTitle: newEntry.title, phases: [
                { id: 'np1', name: 'Phase 1 — Research & Planning', timeframe: 'Week 1', status: 'active', milestones: [{ text: 'Define clear objectives', done: false }, { text: 'Research best approaches', done: false }], keyActions: 'Brainstorm, gather resources', risks: 'Unclear requirements' },
                { id: 'np2', name: 'Phase 2 — Execution', timeframe: 'Week 2-3', status: 'upcoming', milestones: [{ text: 'Start core work', done: false }, { text: 'Track daily progress', done: false }], keyActions: 'Daily focused work sessions', risks: 'Losing momentum' },
                { id: 'np3', name: 'Phase 3 — Review & Complete', timeframe: 'Week 4', status: 'upcoming', milestones: [{ text: 'Review results', done: false }, { text: 'Final adjustments', done: false }], keyActions: 'Evaluate and iterate', risks: 'Last-minute changes' },
            ]};
            setStrategyPlans([...strategyPlans, newPlan]);
            setPlanningGoal(newPlan);
            setActivePage('Strategy Planner');
        }
    };

    const handleMarkDone = (goalId) => {
        const goal = onProgressGoals.find(g => g.id === goalId);
        if (!goal) return;
        setOnProgressGoals(onProgressGoals.filter(g => g.id !== goalId));
        setDoneGoals([{ ...goal, status: 'Done', progress: '100%' }, ...doneGoals]);
        if (selectedGoal && selectedGoal.id === goalId) setSelectedGoal(null);
    };

    const handleDeleteGoal = (goalId) => {
        setOnProgressGoals(onProgressGoals.filter(g => g.id !== goalId));
        setDoneGoals(doneGoals.filter(g => g.id !== goalId));
        if (selectedGoal && selectedGoal.id === goalId) setSelectedGoal(null);
    };

    const toggleDailyTask = (id) => setDailyTasks(dailyTasks.map(t => t.id === id ? { ...t, done: !t.done } : t));

    const toggleSubtask = (taskId, subIdx) => {
        setDailyTasks(dailyTasks.map(t => {
            if (t.id !== taskId) return t;
            const newSubs = t.subtasks.map((s, i) => i === subIdx ? { ...s, done: !s.done } : s);
            return { ...t, subtasks: newSubs };
        }));
    };

    const handleSaveEditTask = () => {
        if (!editingTask) return;
        setDailyTasks(dailyTasks.map(t => t.id === editingTask.id ? editingTask : t));
        setEditingTask(null);
    };

    const handleDeleteTask = (id) => {
        setDailyTasks(dailyTasks.filter(t => t.id !== id));
        setEditingTask(null);
    };

    const handleAddNewTask = () => {
        const newTask = {
            id: 'dt' + Date.now(),
            time: newTaskForm.time || getISTTime(),
            title: newTaskForm.title || 'New Task',
            category: newTaskForm.category,
            note: newTaskForm.note || '',
            subtasks: [],
            done: false,
        };
        setDailyTasks([...dailyTasks, newTask]);
        setIsAddTaskOpen(false);
        setNewTaskForm({ title: '', time: '', category: 'Work', note: '' });
    };

    const handleNavClick = (label) => { setActivePage(label); setSelectedGoal(null); setSearchQuery(''); };

    const navLinks = ['Goal Timeline', 'Daily Routine', 'Report', 'Help center'];

    /* ════════════════════ PAGE RENDERERS ════════════════════ */

    /* ─── Goal Timeline ─── */
            <div className="flex justify-between items-center px-12 py-10 border-b border-gray-100">
                <div>
                    <h1 className="text-4xl tracking-tight font-normal">Goal Timeline</h1>
                    <p className="text-sm text-gray-400 mt-1">{liveDate}</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <iconify-icon icon="solar:magnifer-linear" width="18" height="18" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></iconify-icon>
                        <input type="text" placeholder="Search goal" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                            className="border border-gray-200 rounded-lg pl-11 pr-4 py-2.5 text-sm outline-none focus:border-gray-300 w-64 transition-colors placeholder:text-gray-300 text-gray-900 bg-white" />
                    </div>
                    <button onClick={() => setIsAddGoalModalOpen(true)}
                        className="bg-[#1b1b1b] text-white px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium hover:bg-black transition-colors">
                        <span className="text-lg leading-none shrink-0">+</span> <span className="pt-px">Add Goal</span>
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-4 px-12 py-8 border-b border-gray-100">
                <div><div className="text-sm text-gray-500 mb-1">Goal</div><div className="text-base font-medium">This month</div></div>
                <div className="border-l border-gray-100 pl-8"><div className="text-sm text-gray-500 mb-1">Total</div><div className="text-base font-medium">{totalGoals} Goal{totalGoals !== 1 ? 's' : ''}</div></div>
                <div className="border-l border-gray-100 pl-8"><div className="text-sm text-gray-500 mb-1">In progress</div><div className="text-base font-medium">{onProgressGoals.length} Active</div></div>
                <div className="border-l border-gray-100 pl-8"><div className="text-sm text-gray-500 mb-1">Goal achieved</div><div className="text-base font-medium">{doneGoals.length} Achievement{doneGoals.length !== 1 ? 's' : ''}</div></div>
            </div>
            <div className="px-12 pt-10 pb-20">
                <div className="grid grid-cols-[120px_1fr_150px_150px] gap-8 text-sm text-gray-500 mb-6 border-b border-gray-100 pb-4">
                    <div>Date created</div><div>Goal name</div><div>Due date</div><div>Goal target</div>
                </div>
                <div className="mb-10">
                    <h2 className="text-2xl tracking-tight font-normal mb-6">On progress</h2>
                    {filteredProgress.length === 0 && <p className="text-sm text-gray-400 py-4">No goals found.</p>}
                    <div className="flex flex-col">
                        {filteredProgress.map((goal) => {
                            const isActive = selectedGoal && selectedGoal.id === goal.id;
                            return (
                                <div key={goal.id} onClick={() => setSelectedGoal(goal)}
                                    className={`grid grid-cols-[120px_1fr_150px_150px] gap-8 items-center py-5 cursor-pointer transition-colors rounded-xl ${isActive ? 'bg-[#1b1b1b] text-white -mx-12 px-12 my-2' : 'hover:bg-gray-50 px-4 -mx-4'}`}>
                                    <div className={`text-sm ${isActive ? 'text-gray-300' : 'text-gray-400'}`}>{goal.time}</div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-[#bef445] flex items-center justify-center flex-shrink-0">
                                            <iconify-icon icon={goal.icon} width="20" height="20" className="text-gray-900"></iconify-icon>
                                        </div>
                                        <div>
                                            <div className={`text-base font-medium ${!isActive ? 'text-gray-900' : ''}`}>{goal.title}</div>
                                            <div className={`text-sm ${isActive ? 'text-gray-400' : 'text-gray-500'}`}>{goal.category}</div>
                                        </div>
                                    </div>
                                    <div className={`text-sm ${isActive ? 'text-gray-300' : 'text-gray-600'}`}>{goal.dueDate}</div>
                                    <div className={`text-sm ${isActive ? 'text-gray-300' : 'text-gray-600'}`}>{goal.target}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl tracking-tight font-normal mb-6 pt-4">Goal done</h2>
                    {filteredDone.length === 0 && <p className="text-sm text-gray-400 py-4">No completed goals found.</p>}
                    <div className="flex flex-col">
                        {filteredDone.map((goal) => {
                            const isActive = selectedGoal && selectedGoal.id === goal.id;
                            return (
                                <div key={goal.id} onClick={() => setSelectedGoal(goal)}
                                    className={`grid grid-cols-[120px_1fr_150px_150px] gap-8 items-center py-5 cursor-pointer transition-colors rounded-xl ${isActive ? 'bg-[#1b1b1b] text-white -mx-12 px-12 my-2' : 'hover:bg-gray-50 px-4 -mx-4'}`}>
                                    <div className={`text-sm ${isActive ? 'text-gray-300' : 'text-gray-400'}`}>{goal.time}</div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-[#bef445] flex items-center justify-center flex-shrink-0">
                                            <iconify-icon icon={goal.icon} width="20" height="20" className="text-gray-900"></iconify-icon>
                                        </div>
                                        <div>
                                            <div className={`text-base font-medium ${!isActive ? 'text-gray-900' : ''}`}>{goal.title}</div>
                                            <div className={`text-sm ${isActive ? 'text-gray-400' : 'text-gray-500'}`}>{goal.category}</div>
                                        </div>
                                    </div>
                                    <div className={`text-sm ${isActive ? 'text-gray-300' : 'text-gray-600'}`}>{goal.dueDate}</div>
                                    <div className={`text-sm ${isActive ? 'text-gray-300' : 'text-gray-600'}`}>{goal.target}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );

    /* ─── Daily Routine ─── */
    const renderDailyRoutine = () => {
        const doneCount = dailyTasks.filter(t => t.done).length;
        const pct = dailyTasks.length > 0 ? Math.round((doneCount / dailyTasks.length) * 100) : 0;
        const totalSubs = dailyTasks.reduce((a, t) => a + t.subtasks.length, 0);
        const doneSubs = dailyTasks.reduce((a, t) => a + t.subtasks.filter(s => s.done).length, 0);

        return (
            <>
                {/* Header */}
                <div className="flex justify-between items-center px-12 py-10 border-b border-gray-100">
                    <div>
                        <h1 className="text-4xl tracking-tight font-normal">Daily Routine</h1>
                        <p className="text-sm text-gray-400 mt-1">{liveDate} · <span className="text-[#bef445] font-medium">{liveClock} IST</span></p>
                    </div>
                    <div className="flex items-center gap-5">
                        <div className="text-right">
                            <div className="text-xs text-gray-400">Tasks done</div>
                            <div className="text-lg font-medium">{doneCount}<span className="text-gray-300">/{dailyTasks.length}</span></div>
                        </div>
                        <div className="w-14 h-14 rounded-full border-[3px] border-[#bef445] flex items-center justify-center">
                            <span className="text-sm font-semibold">{pct}%</span>
                        </div>
                        <button onClick={() => setIsAddTaskOpen(true)}
                            className="bg-[#1b1b1b] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-black transition-colors">
                            <span className="text-lg leading-none">+</span> <span>Add Task</span>
                        </button>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="px-12 pt-6 pb-2">
                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                        <span>Progress</span>
                        <span>{pct}% · {doneSubs}/{totalSubs} subtasks</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-[#bef445] h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
                    </div>
                </div>

                {/* Task list */}
                <div className="px-12 pt-6 pb-20 space-y-2">
                    {dailyTasks.map(task => {
                        const taskIcon = CATEGORY_ICONS[task.category] || 'solar:target-linear';
                        const subDone = task.subtasks.filter(s => s.done).length;
                        const subTotal = task.subtasks.length;
                        return (
                            <div key={task.id} className={`rounded-xl border transition-all ${task.done ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-100 hover:border-gray-200'}`}>
                                {/* Main row */}
                                <div className="flex items-center gap-4 py-4 px-5">
                                    {/* Checkbox */}
                                    <button onClick={() => toggleDailyTask(task.id)}
                                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${task.done ? 'bg-[#bef445] border-[#bef445]' : 'border-gray-300 hover:border-gray-400'}`}>
                                        {task.done && <iconify-icon icon="solar:check-read-linear" width="14" height="14" className="text-gray-900"></iconify-icon>}
                                    </button>
                                    {/* Icon */}
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${task.done ? 'bg-gray-200' : 'bg-[#f0f2eb]'}`}>
                                        <iconify-icon icon={taskIcon} width="20" height="20" className="text-gray-700"></iconify-icon>
                                    </div>
                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className={`text-sm font-medium ${task.done ? 'line-through text-gray-400' : 'text-gray-900'}`}>{task.title}</div>
                                        <div className="flex items-center gap-3 mt-0.5">
                                            <span className="text-xs text-gray-400">{task.category}</span>
                                            {subTotal > 0 && <span className="text-xs text-gray-300">· {subDone}/{subTotal} subtasks</span>}
                                            {task.note && <span className="text-xs text-gray-300">· 📝</span>}
                                        </div>
                                    </div>
                                    {/* Time */}
                                    <div className={`text-sm flex-shrink-0 px-3 py-1 rounded-lg ${task.done ? 'text-gray-400 bg-gray-100' : 'text-gray-700 bg-[#f0f2eb]'}`}>
                                        {task.time}
                                    </div>
                                    {/* Edit */}
                                    <button onClick={(e) => { e.stopPropagation(); setEditingTask({ ...task, subtasks: task.subtasks.map(s => ({ ...s })) }); }}
                                        className="text-gray-400 hover:text-gray-700 transition-colors flex-shrink-0 p-1">
                                        <iconify-icon icon="solar:pen-linear" width="16" height="16"></iconify-icon>
                                    </button>
                                </div>

                                {/* Subtasks expanded */}
                                {!task.done && subTotal > 0 && (
                                    <div className="px-5 pb-4 pl-20 space-y-2">
                                        {task.subtasks.map((sub, si) => (
                                            <div key={si} className="flex items-center gap-3">
                                                <button onClick={() => toggleSubtask(task.id, si)}
                                                    className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${sub.done ? 'bg-[#bef445] border-[#bef445]' : 'border-gray-300'}`}>
                                                    {sub.done && <iconify-icon icon="solar:check-read-linear" width="10" height="10" className="text-gray-900"></iconify-icon>}
                                                </button>
                                                <span className={`text-xs ${sub.done ? 'line-through text-gray-400' : 'text-gray-600'}`}>{sub.text}</span>
                                            </div>
                                        ))}
                                        {task.note && (
                                            <div className="mt-2 text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2 flex items-start gap-2">
                                                <iconify-icon icon="solar:notes-linear" width="14" height="14" className="text-gray-300 mt-0.5 flex-shrink-0"></iconify-icon>
                                                {task.note}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </>
        );
    };

    /* ─── Report page (redesigned to match dashboard theme) ─── */
    const renderReport = () => {
        const categories = {};
        [...onProgressGoals, ...doneGoals].forEach(g => { categories[g.category] = (categories[g.category] || 0) + 1; });
        const catEntries = Object.entries(categories).sort((a, b) => b[1] - a[1]);
        const dailyDone = dailyTasks.filter(t => t.done).length;
        const dailyPct = dailyTasks.length > 0 ? Math.round((dailyDone / dailyTasks.length) * 100) : 0;
        const completionRate = totalGoals > 0 ? Math.round((doneGoals.length / totalGoals) * 100) : 0;

        return (
            <>
                {/* Header — matches the Goal Timeline style */}
                <div className="flex justify-between items-center px-12 py-10 border-b border-gray-100">
                    <h1 className="text-4xl tracking-tight font-normal">Report</h1>
                    <div className="text-sm text-gray-400">{liveDate}</div>
                </div>

                {/* Stats row — same style as Goal Timeline stats */}
                <div className="grid grid-cols-4 px-12 py-8 border-b border-gray-100">
                    <div>
                        <div className="text-sm text-gray-500 mb-1">Total Goals</div>
                        <div className="text-2xl font-medium">{totalGoals}</div>
                    </div>
                    <div className="border-l border-gray-100 pl-8">
                        <div className="text-sm text-gray-500 mb-1">In Progress</div>
                        <div className="text-2xl font-medium">{onProgressGoals.length}</div>
                    </div>
                    <div className="border-l border-gray-100 pl-8">
                        <div className="text-sm text-gray-500 mb-1">Completed</div>
                        <div className="text-2xl font-medium text-[#22c55e]">{doneGoals.length}</div>
                    </div>
                    <div className="border-l border-gray-100 pl-8">
                        <div className="text-sm text-gray-500 mb-1">Completion Rate</div>
                        <div className="text-2xl font-medium">{completionRate}%</div>
                    </div>
                </div>

                <div className="px-12 pt-10 pb-20">
                    {/* Table header — dashboard-style columns */}
                    <div className="grid grid-cols-[120px_1fr_100px_100px] gap-8 text-sm text-gray-500 mb-6 border-b border-gray-100 pb-4">
                        <div>Category</div><div>Goal breakdown</div><div>Count</div><div>Progress</div>
                    </div>

                    {/* Category rows — timeline-style */}
                    <div className="mb-10">
                        <h2 className="text-2xl tracking-tight font-normal mb-6">Goals by Category</h2>
                        <div className="flex flex-col">
                            {catEntries.map(([cat, count]) => {
                                const catIcon = CATEGORY_ICONS[cat] || 'solar:target-linear';
                                const catPct = totalGoals > 0 ? Math.round((count / totalGoals) * 100) : 0;
                                return (
                                    <div key={cat} className="grid grid-cols-[120px_1fr_100px_100px] gap-8 items-center py-4 hover:bg-gray-50 px-4 -mx-4 rounded-xl transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[#f0f2eb] flex items-center justify-center flex-shrink-0">
                                                <iconify-icon icon={catIcon} width="16" height="16" className="text-gray-700"></iconify-icon>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm font-medium text-gray-900 w-32 truncate">{cat}</span>
                                            <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                                                <div className="bg-[#1b1b1b] h-2.5 rounded-full transition-all duration-700" style={{ width: `${catPct}%` }}></div>
                                            </div>
                                        </div>
                                        <div className="text-sm font-medium text-gray-900">{count}</div>
                                        <div className="text-sm text-gray-500">{catPct}%</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Daily Routine Section */}
                    <div className="mb-10">
                        <h2 className="text-2xl tracking-tight font-normal mb-6 pt-4">Daily Routine</h2>
                        <div className="grid grid-cols-[120px_1fr_100px_100px] gap-8 items-center py-4 hover:bg-gray-50 px-4 -mx-4 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#bef445] flex items-center justify-center flex-shrink-0">
                                    <iconify-icon icon="solar:sun-2-linear" width="16" height="16" className="text-gray-900"></iconify-icon>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-gray-900 w-32">Tasks today</span>
                                <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                                    <div className="bg-[#bef445] h-2.5 rounded-full transition-all duration-700" style={{ width: `${dailyPct}%` }}></div>
                                </div>
                            </div>
                            <div className="text-sm font-medium text-gray-900">{dailyDone}/{dailyTasks.length}</div>
                            <div className="text-sm text-[#22c55e] font-medium">{dailyPct}%</div>
                        </div>
                    </div>

                    {/* Weekly Activity — bar chart matching dashboard style */}
                    <div>
                        <h2 className="text-2xl tracking-tight font-normal mb-6 pt-4">Weekly Activity</h2>
                        <div className="bg-[#f0f2eb] rounded-2xl p-8">
                            <div className="flex items-end gap-4 h-40">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => {
                                    const h = [65, 80, 45, 90, 55, 30, 70][i];
                                    return (
                                        <div key={d} className="flex-1 flex flex-col items-center gap-3">
                                            <span className="text-xs font-medium text-gray-600">{h}%</span>
                                            <div className="w-full rounded-t-lg transition-all duration-300 hover:opacity-80" style={{ height: `${h}%`, backgroundColor: i === 3 ? '#bef445' : '#1b1b1b' }}></div>
                                            <span className="text-xs text-gray-500">{d}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Progress chart */}
                    <div className="mt-10">
                        <h2 className="text-2xl tracking-tight font-normal mb-6">Progress Trend</h2>
                        <div className="w-full h-28 relative">
                            <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                                <path d="M0,35 Q5,36 10,33 T20,35 T30,32 T40,34 T45,30 T50,32 T60,30 T70,31 T80,29 T90,30 T100,28" stroke="#e5e7eb" strokeWidth="0.5" fill="none" vectorEffect="non-scaling-stroke"></path>
                                <path d="M0,28 Q4,30 8,26 T16,28 T24,23 T30,25 T36,18 T42,22 T50,15 T56,18 T64,12 T72,16 T80,10 T86,14 T94,8 T100,2" stroke="#1f2937" strokeWidth="1.2" fill="none" vectorEffect="non-scaling-stroke"></path>
                            </svg>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 mt-2">
                            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                        </div>
                    </div>
                </div>
            </>
        );
    };

    /* ─── Help Center ─── */
    const renderHelpCenter = () => (
        <>
            <div className="px-12 py-10 border-b border-gray-100">
                <h1 className="text-4xl tracking-tight font-normal">Help Center</h1>
                <p className="text-sm text-gray-400 mt-1">Find answers to common questions</p>
            </div>
            <div className="px-12 pt-8 pb-4">
                <div className="relative max-w-lg">
                    <iconify-icon icon="solar:magnifer-linear" width="18" height="18" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></iconify-icon>
                    <input type="text" placeholder="Search help articles..." className="w-full border border-gray-200 rounded-lg pl-11 pr-4 py-3 text-sm outline-none focus:border-gray-300 placeholder:text-gray-300" />
                </div>
            </div>
            <div className="px-12 py-6 grid grid-cols-3 gap-4">
                {[
                    { icon: 'solar:book-2-linear', title: 'Getting Started', desc: 'Learn the basics' },
                    { icon: 'solar:settings-linear', title: 'Account Settings', desc: 'Manage your profile' },
                    { icon: 'solar:shield-check-linear', title: 'Privacy & Security', desc: 'Keep your data safe' },
                ].map((item, i) => (
                    <div key={i} className="bg-gray-50 rounded-2xl p-6 cursor-pointer hover:bg-gray-100 transition-colors">
                        <div className="w-10 h-10 bg-[#bef445] rounded-full flex items-center justify-center mb-3">
                            <iconify-icon icon={item.icon} width="20" height="20" className="text-gray-800"></iconify-icon>
                        </div>
                        <div className="text-sm font-medium">{item.title}</div>
                        <div className="text-xs text-gray-400 mt-1">{item.desc}</div>
                    </div>
                ))}
            </div>
            <div className="px-12 py-6 pb-20">
                <h2 className="text-lg font-medium mb-6">Frequently Asked Questions</h2>
                <div className="space-y-3">
                    {HELP_ITEMS.map((item, i) => (
                        <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                            <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                className="w-full flex justify-between items-center px-6 py-4 text-left hover:bg-gray-50 transition-colors">
                                <span className="text-sm font-medium">{item.q}</span>
                                <iconify-icon icon={openFaq === i ? 'solar:alt-arrow-up-linear' : 'solar:alt-arrow-down-linear'}
                                    width="18" height="18" className="text-gray-400 flex-shrink-0 ml-4"></iconify-icon>
                            </button>
                            {openFaq === i && (
                                <div className="px-6 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3">{item.a}</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );

    /* ─── Strategy Planner Page ─── */
    const renderStrategyPlanner = () => {
        if (!planningGoal) return <div className="px-12 py-10"><p className="text-gray-400">No goal selected for planning.</p></div>;
        const plan = planningGoal;
        const totalMilestones = plan.phases.reduce((a, p) => a + p.milestones.length, 0);
        const doneMilestones = plan.phases.reduce((a, p) => a + p.milestones.filter(m => m.done).length, 0);
        const overallPct = totalMilestones > 0 ? Math.round((doneMilestones / totalMilestones) * 100) : 0;

        const togglePlanMilestone = (phaseId, mIdx) => {
            const updated = { ...plan, phases: plan.phases.map(p => {
                if (p.id !== phaseId) return p;
                return { ...p, milestones: p.milestones.map((m, i) => i === mIdx ? { ...m, done: !m.done } : m) };
            })};
            setPlanningGoal(updated);
            setStrategyPlans(strategyPlans.map(sp => sp.goalId === updated.goalId ? updated : sp));
        };

        const addPhase = () => {
            const newPhase = { id: 'ph' + Date.now(), name: 'New Phase', timeframe: 'TBD', status: 'upcoming', milestones: [{ text: 'Define milestone', done: false }], keyActions: '', risks: '' };
            const updated = { ...plan, phases: [...plan.phases, newPhase] };
            setPlanningGoal(updated);
            setStrategyPlans(strategyPlans.map(sp => sp.goalId === updated.goalId ? updated : sp));
        };

        const updatePhaseField = (phaseId, field, value) => {
            const updated = { ...plan, phases: plan.phases.map(p => p.id === phaseId ? { ...p, [field]: value } : p) };
            setPlanningGoal(updated);
            setStrategyPlans(strategyPlans.map(sp => sp.goalId === updated.goalId ? updated : sp));
        };

        const addMilestone = (phaseId) => {
            const updated = { ...plan, phases: plan.phases.map(p => p.id === phaseId ? { ...p, milestones: [...p.milestones, { text: '', done: false }] } : p) };
            setPlanningGoal(updated);
            setStrategyPlans(strategyPlans.map(sp => sp.goalId === updated.goalId ? updated : sp));
        };

        const updateMilestoneText = (phaseId, mIdx, text) => {
            const updated = { ...plan, phases: plan.phases.map(p => p.id !== phaseId ? p : { ...p, milestones: p.milestones.map((m, i) => i === mIdx ? { ...m, text } : m) }) };
            setPlanningGoal(updated);
            setStrategyPlans(strategyPlans.map(sp => sp.goalId === updated.goalId ? updated : sp));
        };

        const deletePhase = (phaseId) => {
            const updated = { ...plan, phases: plan.phases.filter(p => p.id !== phaseId) };
            setPlanningGoal(updated);
            setStrategyPlans(strategyPlans.map(sp => sp.goalId === updated.goalId ? updated : sp));
        };

        const statusColors = { done: 'bg-[#bef445] text-gray-900', active: 'bg-[#1b1b1b] text-white', upcoming: 'bg-gray-100 text-gray-500' };

        return (
            <>
                {/* Header */}
                <div className="flex justify-between items-center px-12 py-10 border-b border-gray-100">
                    <div>
                        <button onClick={() => { setActivePage('Goal Timeline'); setPlanningGoal(null); }}
                            className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 mb-2 transition-colors">
                            <iconify-icon icon="solar:arrow-left-linear" width="16" height="16"></iconify-icon> Back to Timeline
                        </button>
                        <h1 className="text-4xl tracking-tight font-normal">Strategy Planner</h1>
                        <p className="text-sm text-gray-400 mt-1">{liveDate} · Planning for <span className="text-gray-700 font-medium">{plan.goalTitle}</span></p>
                    </div>
                    <div className="flex items-center gap-5">
                        <div className="text-right">
                            <div className="text-xs text-gray-400">Milestones</div>
                            <div className="text-lg font-medium">{doneMilestones}<span className="text-gray-300">/{totalMilestones}</span></div>
                        </div>
                        <div className="w-14 h-14 rounded-full border-[3px] border-[#bef445] flex items-center justify-center">
                            <span className="text-sm font-semibold">{overallPct}%</span>
                        </div>
                        <button onClick={addPhase}
                            className="bg-[#1b1b1b] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-black transition-colors">
                            <span className="text-lg leading-none">+</span> Add Phase
                        </button>
                    </div>
                </div>

                {/* Overall progress */}
                <div className="px-12 pt-6 pb-2">
                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                        <span>Overall Progress</span>
                        <span>{overallPct}% complete</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-[#bef445] h-2 rounded-full transition-all duration-500" style={{ width: `${overallPct}%` }}></div>
                    </div>
                </div>

                {/* Phase timeline visual */}
                <div className="px-12 pt-6 pb-4">
                    <div className="flex items-center gap-1">
                        {plan.phases.map((phase, pi) => {
                            const phaseDone = phase.milestones.filter(m => m.done).length;
                            const phasePct = phase.milestones.length > 0 ? Math.round((phaseDone / phase.milestones.length) * 100) : 0;
                            return (
                                <React.Fragment key={phase.id}>
                                    <div className="flex-1 relative">
                                        <div className="h-2 rounded-full bg-gray-100">
                                            <div className={`h-2 rounded-full transition-all duration-700 ${phase.status === 'done' ? 'bg-[#bef445]' : phase.status === 'active' ? 'bg-[#1b1b1b]' : 'bg-gray-200'}`} style={{ width: `${phasePct}%` }}></div>
                                        </div>
                                        <div className="text-[10px] text-gray-400 mt-1 text-center truncate">{phase.name}</div>
                                    </div>
                                    {pi < plan.phases.length - 1 && (
                                        <div className="w-6 flex items-center justify-center flex-shrink-0 -mt-4">
                                            <iconify-icon icon="solar:arrow-right-linear" width="12" height="12" className="text-gray-300"></iconify-icon>
                                        </div>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>

                {/* Phases */}
                <div className="px-12 pt-4 pb-20 space-y-6">
                    {plan.phases.map((phase) => {
                        const phaseDone = phase.milestones.filter(m => m.done).length;
                        const phasePct = phase.milestones.length > 0 ? Math.round((phaseDone / phase.milestones.length) * 100) : 0;
                        return (
                            <div key={phase.id} className="border border-gray-100 rounded-2xl overflow-hidden">
                                {/* Phase header */}
                                <div className="flex items-center justify-between p-6 bg-white">
                                    <div className="flex items-center gap-4">
                                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[phase.status]}`}>
                                            {phase.status === 'done' ? 'Completed' : phase.status === 'active' ? 'In Progress' : 'Upcoming'}
                                        </div>
                                        <input type="text" value={phase.name} onChange={(e) => updatePhaseField(phase.id, 'name', e.target.value)}
                                            className="text-lg font-medium outline-none text-gray-900 bg-transparent" />
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2 bg-[#f0f2eb] px-3 py-1.5 rounded-lg">
                                            <iconify-icon icon="solar:clock-circle-linear" width="14" height="14" className="text-gray-500"></iconify-icon>
                                            <input type="text" value={phase.timeframe} onChange={(e) => updatePhaseField(phase.id, 'timeframe', e.target.value)}
                                                className="text-xs font-medium outline-none bg-transparent text-gray-700 w-20" />
                                        </div>
                                        <div className="text-xs text-gray-400">{phasePct}%</div>
                                        <select value={phase.status} onChange={(e) => updatePhaseField(phase.id, 'status', e.target.value)}
                                            className="text-xs outline-none bg-transparent text-gray-400 cursor-pointer">
                                            <option value="upcoming">Upcoming</option>
                                            <option value="active">Active</option>
                                            <option value="done">Done</option>
                                        </select>
                                        <button onClick={() => deletePhase(phase.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                                            <iconify-icon icon="solar:trash-bin-2-linear" width="16" height="16"></iconify-icon>
                                        </button>
                                    </div>
                                </div>

                                {/* Milestones */}
                                <div className="px-6 pb-4 space-y-2 border-t border-gray-50 pt-4 bg-gray-50/50">
                                    <div className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wider">Milestones</div>
                                    {phase.milestones.map((m, mi) => (
                                        <div key={mi} className="flex items-center gap-3">
                                            <button onClick={() => togglePlanMilestone(phase.id, mi)}
                                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${m.done ? 'bg-[#bef445] border-[#bef445]' : 'border-gray-300 hover:border-gray-400'}`}>
                                                {m.done && <iconify-icon icon="solar:check-read-linear" width="12" height="12" className="text-gray-900"></iconify-icon>}
                                            </button>
                                            <input type="text" value={m.text} onChange={(e) => updateMilestoneText(phase.id, mi, e.target.value)}
                                                placeholder="Describe milestone..."
                                                className={`flex-1 text-sm outline-none bg-transparent ${m.done ? 'line-through text-gray-400' : 'text-gray-700'}`} />
                                        </div>
                                    ))}
                                    <button onClick={() => addMilestone(phase.id)}
                                        className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 pt-1 transition-colors">
                                        <span className="text-sm">+</span> Add milestone
                                    </button>
                                </div>

                                {/* Key Actions & Risks */}
                                <div className="grid grid-cols-2 gap-0 border-t border-gray-100">
                                    <div className="p-5 border-r border-gray-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <iconify-icon icon="solar:bolt-linear" width="14" height="14" className="text-[#bef445]"></iconify-icon>
                                            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Key Actions</span>
                                        </div>
                                        <input type="text" value={phase.keyActions} onChange={(e) => updatePhaseField(phase.id, 'keyActions', e.target.value)}
                                            placeholder="What needs to be done..."
                                            className="text-sm text-gray-600 outline-none bg-transparent w-full placeholder-gray-300" />
                                    </div>
                                    <div className="p-5">
                                        <div className="flex items-center gap-2 mb-2">
                                            <iconify-icon icon="solar:danger-triangle-linear" width="14" height="14" className="text-amber-400"></iconify-icon>
                                            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Risks</span>
                                        </div>
                                        <input type="text" value={phase.risks} onChange={(e) => updatePhaseField(phase.id, 'risks', e.target.value)}
                                            placeholder="Potential blockers..."
                                            className="text-sm text-gray-600 outline-none bg-transparent w-full placeholder-gray-300" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </>
        );
    };

    /* ─── active page content ─── */
    const renderPageContent = () => {
        switch (activePage) {
            case 'Goal Timeline': return renderGoalTimeline();
            case 'Daily Routine': return renderDailyRoutine();
            case 'Report': return renderReport();
            case 'Help center': return renderHelpCenter();
            case 'Strategy Planner': return renderStrategyPlanner();
            default: return renderGoalTimeline();
        }
    };

    /* ═══════════════════════ RENDER ═══════════════════════ */
    return (
        <div className="bg-[#f0f2eb] text-gray-900 font-sans h-screen flex overflow-hidden relative">

            {/* ─── Add Goal Modal ─── */}
            {isAddGoalModalOpen && (
                <div className="absolute inset-0 bg-black/20 z-[60] flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-[480px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col">
                        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-medium tracking-tight">Add Goal</h2>
                            <button onClick={() => setIsAddGoalModalOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors">
                                <iconify-icon icon="mingcute:close-line" width="24" height="24"></iconify-icon>
                            </button>
                        </div>
                        <div className="p-8 space-y-6 flex-1 overflow-y-auto">
                            <div>
                                <label className="text-xs text-gray-400 block mb-2">Goal name</label>
                                <div className="border-b border-gray-200 pb-2 flex justify-between items-center">
                                    <input type="text" placeholder="Enter name" value={newGoalForm.name} onChange={(e) => setNewGoalForm({ ...newGoalForm, name: e.target.value })}
                                        className="w-full text-sm outline-none placeholder-gray-300 text-gray-900" />
                                    <iconify-icon icon="solar:pen-linear" width="16" height="16" className="text-gray-400"></iconify-icon>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <label className="text-xs text-gray-400 block mb-2">Start date</label>
                                    <div className="border-b border-gray-200 pb-2 flex justify-between items-center">
                                        <input type="date" value={newGoalForm.startDate} onChange={(e) => setNewGoalForm({ ...newGoalForm, startDate: e.target.value })}
                                            className="w-full text-sm outline-none placeholder-gray-300 text-gray-900 bg-transparent cursor-pointer" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 block mb-2">Due Date</label>
                                    <div className="border-b border-gray-200 pb-2 flex justify-between items-center">
                                        <input type="date" value={newGoalForm.dueDate} onChange={(e) => setNewGoalForm({ ...newGoalForm, dueDate: e.target.value })}
                                            className="w-full text-sm outline-none placeholder-gray-300 text-gray-900 bg-transparent cursor-pointer" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 block mb-2">Goal target</label>
                                <div className="border-b border-gray-200 pb-2">
                                    <input type="text" placeholder="Enter target" value={newGoalForm.target} onChange={(e) => setNewGoalForm({ ...newGoalForm, target: e.target.value })}
                                        className="w-full text-sm outline-none placeholder-gray-300 text-gray-900" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 block mb-2">Upload file</label>
                                <div className="border-b border-gray-200 pb-2 flex items-center gap-2 cursor-pointer pt-1 hover:text-gray-600 transition-colors group">
                                    <iconify-icon icon="solar:document-add-linear" width="16" height="16" className="text-gray-400 group-hover:text-gray-500"></iconify-icon>
                                    <span className="text-sm text-gray-400 group-hover:text-gray-500">Upload file here</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 block mb-2">Description</label>
                                <div className="border-b border-gray-200 pb-2">
                                    <textarea placeholder="Enter Description" value={newGoalForm.description} onChange={(e) => setNewGoalForm({ ...newGoalForm, description: e.target.value })}
                                        className="w-full text-sm outline-none placeholder-gray-300 text-gray-900 h-16 resize-none pt-1"></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="p-8 pt-4 space-y-3">
                            <div className="flex gap-4">
                                <button onClick={() => handleAddGoalSubmit(false)} className="flex-1 bg-[#bef445] text-gray-900 text-sm font-medium py-3 rounded-lg hover:bg-[#a6d83a] transition-colors">Add Goal</button>
                                <button onClick={() => setIsAddGoalModalOpen(false)} className="flex-1 bg-white text-gray-900 text-sm font-medium py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">Cancel</button>
                            </div>
                            <button onClick={() => handleAddGoalSubmit(true)}
                                className="w-full bg-[#1b1b1b] text-white text-sm font-medium py-3 rounded-lg hover:bg-black transition-colors flex items-center justify-center gap-2">
                                <iconify-icon icon="solar:routing-2-linear" width="18" height="18"></iconify-icon>
                                Plan Strategy & Breakdown
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Edit Task Modal ─── */}
            {editingTask && (
                <div className="absolute inset-0 bg-black/20 z-[60] flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-[520px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-medium tracking-tight">Edit Task</h2>
                            <button onClick={() => setEditingTask(null)} className="text-gray-400 hover:text-gray-900 transition-colors">
                                <iconify-icon icon="mingcute:close-line" width="24" height="24"></iconify-icon>
                            </button>
                        </div>
                        <div className="p-8 space-y-6 flex-1 overflow-y-auto">
                            {/* Task name */}
                            <div>
                                <label className="text-xs text-gray-400 block mb-2">Task name</label>
                                <div className="border-b border-gray-200 pb-2 flex justify-between items-center">
                                    <input type="text" value={editingTask.title} onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                                        className="w-full text-sm outline-none text-gray-900" />
                                    <iconify-icon icon="solar:pen-linear" width="16" height="16" className="text-gray-400"></iconify-icon>
                                </div>
                            </div>
                            {/* Time + Category */}
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <label className="text-xs text-gray-400 block mb-2">Time (AM/PM IST)</label>
                                    <div className="border-b border-gray-200 pb-2 flex justify-between items-center">
                                        <input type="time" value={editingTask.time}
                                            onChange={(e) => setEditingTask({ ...editingTask, time: e.target.value })}
                                            className="w-full text-sm outline-none text-gray-900 bg-transparent cursor-pointer" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 block mb-2">Category</label>
                                    <div className="border-b border-gray-200 pb-2">
                                        <select value={editingTask.category} onChange={(e) => setEditingTask({ ...editingTask, category: e.target.value })}
                                            className="w-full text-sm outline-none text-gray-900 bg-transparent">
                                            {CATEGORY_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            {/* Subtasks */}
                            <div>
                                <label className="text-xs text-gray-400 block mb-2">Subtasks</label>
                                <div className="space-y-2">
                                    {editingTask.subtasks.map((sub, si) => (
                                        <div key={si} className="flex items-center gap-3">
                                            <button onClick={() => {
                                                const newSubs = editingTask.subtasks.map((s, i) => i === si ? { ...s, done: !s.done } : s);
                                                setEditingTask({ ...editingTask, subtasks: newSubs });
                                            }}
                                                className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${sub.done ? 'bg-[#bef445] border-[#bef445]' : 'border-gray-300'}`}>
                                                {sub.done && <iconify-icon icon="solar:check-read-linear" width="10" height="10" className="text-gray-900"></iconify-icon>}
                                            </button>
                                            <input type="text" value={sub.text}
                                                onChange={(e) => {
                                                    const newSubs = editingTask.subtasks.map((s, i) => i === si ? { ...s, text: e.target.value } : s);
                                                    setEditingTask({ ...editingTask, subtasks: newSubs });
                                                }}
                                                className="flex-1 text-sm outline-none text-gray-900 border-b border-gray-100 pb-1" />
                                            <button onClick={() => {
                                                const newSubs = editingTask.subtasks.filter((_, i) => i !== si);
                                                setEditingTask({ ...editingTask, subtasks: newSubs });
                                            }} className="text-gray-300 hover:text-red-400 transition-colors">
                                                <iconify-icon icon="solar:trash-bin-2-linear" width="14" height="14"></iconify-icon>
                                            </button>
                                        </div>
                                    ))}
                                    <button onClick={() => setEditingTask({ ...editingTask, subtasks: [...editingTask.subtasks, { text: '', done: false }] })}
                                        className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 pt-1">
                                        <span className="text-sm">+</span> Add subtask
                                    </button>
                                </div>
                            </div>
                            {/* Note */}
                            <div>
                                <label className="text-xs text-gray-400 block mb-2">Short Note</label>
                                <div className="border-b border-gray-200 pb-2">
                                    <textarea value={editingTask.note || ''} onChange={(e) => setEditingTask({ ...editingTask, note: e.target.value })}
                                        placeholder="Add a short note..." className="w-full text-sm outline-none placeholder-gray-300 text-gray-900 h-16 resize-none pt-1"></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="p-8 pt-4 flex gap-4">
                            <button onClick={handleSaveEditTask}
                                className="flex-1 bg-[#bef445] text-gray-900 text-sm font-medium py-3 rounded-lg hover:bg-[#a6d83a] transition-colors">Save Changes</button>
                            <button onClick={() => handleDeleteTask(editingTask.id)}
                                className="flex-1 bg-white text-red-500 text-sm font-medium py-3 rounded-lg border border-red-200 hover:bg-red-50 transition-colors">Delete Task</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Add Task Modal ─── */}
            {isAddTaskOpen && (
                <div className="absolute inset-0 bg-black/20 z-[60] flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-[480px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col">
                        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-medium tracking-tight">Add Daily Task</h2>
                            <button onClick={() => setIsAddTaskOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors">
                                <iconify-icon icon="mingcute:close-line" width="24" height="24"></iconify-icon>
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div>
                                <label className="text-xs text-gray-400 block mb-2">Task name</label>
                                <div className="border-b border-gray-200 pb-2">
                                    <input type="text" placeholder="Enter task name" value={newTaskForm.title}
                                        onChange={(e) => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
                                        className="w-full text-sm outline-none placeholder-gray-300 text-gray-900" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <label className="text-xs text-gray-400 block mb-2">Time</label>
                                    <div className="border-b border-gray-200 pb-2 flex justify-between items-center">
                                        <input type="time" value={newTaskForm.time} onChange={(e) => setNewTaskForm({ ...newTaskForm, time: e.target.value })}
                                            className="w-full text-sm outline-none text-gray-900 bg-transparent cursor-pointer" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 block mb-2">Category</label>
                                    <div className="border-b border-gray-200 pb-2">
                                        <select value={newTaskForm.category} onChange={(e) => setNewTaskForm({ ...newTaskForm, category: e.target.value })}
                                            className="w-full text-sm outline-none text-gray-900 bg-transparent">
                                            {CATEGORY_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 block mb-2">Short Note</label>
                                <div className="border-b border-gray-200 pb-2">
                                    <textarea placeholder="Optional note..." value={newTaskForm.note}
                                        onChange={(e) => setNewTaskForm({ ...newTaskForm, note: e.target.value })}
                                        className="w-full text-sm outline-none placeholder-gray-300 text-gray-900 h-12 resize-none pt-1"></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="p-8 pt-4 flex gap-4">
                            <button onClick={handleAddNewTask} className="flex-1 bg-[#bef445] text-gray-900 text-sm font-medium py-3 rounded-lg hover:bg-[#a6d83a] transition-colors">Add Task</button>
                            <button onClick={() => setIsAddTaskOpen(false)} className="flex-1 bg-white text-gray-900 text-sm font-medium py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Settings Modal ─── */}
            {isSettingsOpen && (
                <div className="absolute inset-0 bg-black/20 z-[60] flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-[480px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden">
                        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-medium tracking-tight">Settings</h2>
                            <button onClick={() => setIsSettingsOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors">
                                <iconify-icon icon="mingcute:close-line" width="24" height="24"></iconify-icon>
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div>
                                <label className="text-xs text-gray-400 block mb-2">Full Name</label>
                                <div className="border-b border-gray-200 pb-2">
                                    <input type="text" value={settingsForm.name} onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })} className="w-full text-sm outline-none text-gray-900" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 block mb-2">Email</label>
                                <div className="border-b border-gray-200 pb-2">
                                    <input type="email" value={settingsForm.email} onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })} className="w-full text-sm outline-none text-gray-900" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 block mb-2">Language</label>
                                <div className="border-b border-gray-200 pb-2">
                                    <select value={settingsForm.language} onChange={(e) => setSettingsForm({ ...settingsForm, language: e.target.value })} className="w-full text-sm outline-none text-gray-900 bg-transparent">
                                        <option>English</option><option>Spanish</option><option>French</option><option>German</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div><div className="text-sm font-medium">Notifications</div><div className="text-xs text-gray-400">Receive push notifications</div></div>
                                <button onClick={() => setSettingsForm({ ...settingsForm, notifications: !settingsForm.notifications })}
                                    className={`w-11 h-6 rounded-full transition-colors relative ${settingsForm.notifications ? 'bg-[#bef445]' : 'bg-gray-200'}`}>
                                    <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-transform ${settingsForm.notifications ? 'translate-x-[22px]' : 'translate-x-0.5'}`}></div>
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div><div className="text-sm font-medium">Dark Mode</div><div className="text-xs text-gray-400">Use dark appearance</div></div>
                                <button onClick={() => setSettingsForm({ ...settingsForm, darkMode: !settingsForm.darkMode })}
                                    className={`w-11 h-6 rounded-full transition-colors relative ${settingsForm.darkMode ? 'bg-[#bef445]' : 'bg-gray-200'}`}>
                                    <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-transform ${settingsForm.darkMode ? 'translate-x-[22px]' : 'translate-x-0.5'}`}></div>
                                </button>
                            </div>
                        </div>
                        <div className="p-8 pt-2 flex gap-4">
                            <button onClick={() => setIsSettingsOpen(false)} className="flex-1 bg-[#bef445] text-gray-900 text-sm font-medium py-3 rounded-lg hover:bg-[#a6d83a] transition-colors">Save Changes</button>
                            <button onClick={() => setIsSettingsOpen(false)} className="flex-1 bg-white text-gray-900 text-sm font-medium py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Goal Detail Panel ─── */}
            {selectedGoal && activePage === 'Goal Timeline' && (
                <div className="absolute top-8 right-8 w-[380px] bg-white rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-8 z-50 max-h-[calc(100vh-64px)] overflow-y-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl tracking-tight font-medium">Goal Detail</h2>
                        <button onClick={() => setSelectedGoal(null)} className="text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center">
                            <iconify-icon icon="solar:logout-2-linear" width="20" height="20"></iconify-icon>
                        </button>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <label className="text-xs text-gray-400 mb-2 block">Goal name</label>
                            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                                <span className="text-base font-medium">{selectedGoal.title}</span>
                                <button className="text-gray-800 flex items-center justify-center"><iconify-icon icon="solar:pen-linear" width="16" height="16"></iconify-icon></button>
                            </div>
                        </div>
                        <div><label className="text-xs text-gray-400 mb-2 block">Status</label><div className="border-b border-gray-100 pb-2"><span className="text-base font-medium">{selectedGoal.status}</span></div></div>
                        <div className="grid grid-cols-2 gap-6">
                            <div><label className="text-xs text-gray-400 mb-2 block">Start date</label><div className="flex justify-between items-center border-b border-gray-100 pb-2"><span className="text-base font-medium">{selectedGoal.startDate}</span><iconify-icon icon="solar:calendar-linear" width="16" height="16" className="text-gray-800"></iconify-icon></div></div>
                            <div><label className="text-xs text-gray-400 mb-2 block">Due Date</label><div className="flex justify-between items-center border-b border-gray-100 pb-2"><span className="text-base font-medium">{selectedGoal.dueDate}</span><iconify-icon icon="solar:calendar-linear" width="16" height="16" className="text-gray-800"></iconify-icon></div></div>
                        </div>
                        <div className="pb-6 border-b border-dashed border-gray-200"><label className="text-xs text-gray-400 mb-2 block">Goal target</label><div className="pb-2"><span className="text-base font-medium">{selectedGoal.target}</span></div></div>
                        <div className="pt-2">
                            <label className="text-xs text-gray-500 mb-3 block">Progress</label>
                            <h3 className="text-xl tracking-tight font-medium mb-3">{selectedGoal.title}</h3>
                            <div className="flex gap-2 mb-6">
                                <span className="px-3 py-1 bg-[#e8faeb] text-[#22c55e] text-xs font-medium rounded-full">{selectedGoal.progress}</span>
                                <span className="px-3 py-1 bg-[#f4fcf6] text-[#22c55e] text-xs font-medium rounded-full">{selectedGoal.category}</span>
                            </div>
                            <div className="w-full h-24 relative mb-2">
                                <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                                    <path d="M0,35 Q5,36 10,33 T20,35 T30,32 T40,34 T45,30 T50,32 T60,30 T70,31 T80,29 T90,30 T100,28" stroke="#9ca3af" strokeWidth="0.5" fill="none" vectorEffect="non-scaling-stroke"></path>
                                    <path d="M0,28 Q4,30 8,26 T16,28 T24,23 T30,25 T36,18 T42,22 T50,15 T56,18 T64,12 T72,16 T80,10 T86,14 T94,8 T100,2" stroke="#1f2937" strokeWidth="1.2" fill="none" vectorEffect="non-scaling-stroke"></path>
                                </svg>
                            </div>
                            <div className="flex justify-between text-xs text-gray-400"><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span></div>
                        </div>
                        <div className="space-y-2 pt-4 border-t border-gray-100">
                            <button onClick={() => {
                                let existingPlan = strategyPlans.find(sp => sp.goalId === selectedGoal.id);
                                if (!existingPlan) {
                                    existingPlan = { goalId: selectedGoal.id, goalTitle: selectedGoal.title, phases: [
                                        { id: 'ep1', name: 'Phase 1 — Research & Planning', timeframe: 'Week 1', status: 'active', milestones: [{ text: 'Define clear objectives', done: false }, { text: 'Research best approaches', done: false }], keyActions: 'Brainstorm, gather resources', risks: 'Unclear requirements' },
                                        { id: 'ep2', name: 'Phase 2 — Execution', timeframe: 'Week 2-3', status: 'upcoming', milestones: [{ text: 'Start core work', done: false }, { text: 'Track daily progress', done: false }], keyActions: 'Daily focused work sessions', risks: 'Losing momentum' },
                                        { id: 'ep3', name: 'Phase 3 — Review & Complete', timeframe: 'Week 4', status: 'upcoming', milestones: [{ text: 'Review results', done: false }, { text: 'Final adjustments', done: false }], keyActions: 'Evaluate and iterate', risks: 'Last-minute changes' },
                                    ]};
                                    setStrategyPlans([...strategyPlans, existingPlan]);
                                }
                                setPlanningGoal(existingPlan);
                                setSelectedGoal(null);
                                setActivePage('Strategy Planner');
                            }}
                                className="w-full bg-[#1b1b1b] text-white text-xs font-medium py-2.5 rounded-lg hover:bg-black transition-colors flex items-center justify-center gap-2">
                                <iconify-icon icon="solar:routing-2-linear" width="14" height="14"></iconify-icon>
                                Plan Strategy & Breakdown
                            </button>
                            <div className="flex gap-3">
                                {selectedGoal.status !== 'Done' && (
                                    <button onClick={() => handleMarkDone(selectedGoal.id)} className="flex-1 bg-[#bef445] text-gray-900 text-xs font-medium py-2.5 rounded-lg hover:bg-[#a6d83a] transition-colors">Mark as Done</button>
                                )}
                                <button onClick={() => handleDeleteGoal(selectedGoal.id)} className="flex-1 bg-white text-red-500 text-xs font-medium py-2.5 rounded-lg border border-red-200 hover:bg-red-50 transition-colors">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Left Sidebar ─── */}
            <div className="w-[280px] flex-shrink-0 flex flex-col justify-between pt-10 pb-6 px-6 overflow-y-auto">
                <div>
                    <div className="text-xl tracking-tight font-semibold mb-8 px-4">KEEPSGOAL</div>

                    {/* Live clock widget */}
                    <div className="mx-4 mb-6 bg-[#1b1b1b] rounded-2xl p-4 text-white">
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                                <iconify-icon icon="solar:clock-circle-linear" width="14" height="14" className="text-[#bef445]"></iconify-icon>
                                <span className="text-[10px] uppercase tracking-widest text-gray-400">IST Live</span>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-[#bef445] animate-pulse"></div>
                        </div>
                        <div className="text-2xl font-semibold tracking-tight font-mono">{liveClock}</div>
                        <div className="text-xs text-gray-400 mt-1">{liveDate}</div>
                    </div>

                    {/* Mini Calendar */}
                    <div className="mx-4 mb-6 bg-white/60 rounded-2xl p-4 border border-gray-200/50">
                        <div className="flex items-center justify-between mb-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                            <span>Calendar</span>
                            <button onClick={() => { setCalMonth(istNow.month); setCalYear(istNow.year); }}
                                className="text-[10px] bg-[#bef445]/20 text-[#719229] px-2 py-0.5 rounded-md hover:bg-[#bef445]/30 transition-colors">
                                Today
                            </button>
                        </div>
                        <div className="flex items-center justify-between mb-3">
                            <button onClick={calPrev} className="text-gray-400 hover:text-gray-700 transition-colors p-1">
                                <iconify-icon icon="solar:alt-arrow-left-linear" width="16" height="16"></iconify-icon>
                            </button>
                            <span className="text-xs font-semibold text-gray-700">{MONTH_NAMES[calMonth]} {calYear}</span>
                            <button onClick={calNext} className="text-gray-400 hover:text-gray-700 transition-colors p-1">
                                <iconify-icon icon="solar:alt-arrow-right-linear" width="16" height="16"></iconify-icon>
                            </button>
                        </div>
                        <div className="grid grid-cols-7 gap-0">
                            {DAY_LABELS.map(d => <div key={d} className="text-[9px] text-gray-400 text-center py-1 font-medium">{d}</div>)}
                            {Array.from({ length: calStart }).map((_, i) => <div key={'e' + i}></div>)}
                            {Array.from({ length: calDays }).map((_, i) => {
                                const day = i + 1;
                                const isToday = day === istNow.day && calMonth === istNow.month && calYear === istNow.year;
                                return (
                                    <div key={day} className={`text-[11px] text-center py-1 rounded-lg cursor-default transition-colors ${
                                        isToday ? 'bg-[#bef445] text-gray-900 font-bold' : 'text-gray-600 hover:bg-gray-100'
                                    }`}>{day}</div>
                                );
                            })}
                        </div>
                    </div>

                    <nav className="space-y-1">
                        {navLinks.map((label) => (
                            <a key={label} href="#" onClick={(e) => { e.preventDefault(); handleNavClick(label); }}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activePage === label ? 'bg-[#bef445]' : 'text-gray-500 hover:text-gray-900'}`}>
                                <iconify-icon icon={NAV_ICONS[label]} width="20" height="20"></iconify-icon>
                                {label}
                            </a>
                        ))}
                    </nav>
                </div>
                <div className="space-y-6 px-4 mt-6">
                    <div className="flex items-center gap-3">
                        <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="User" className="w-8 h-8 rounded-full bg-gray-200 object-cover" />
                        <div>
                            <span className="text-sm font-medium block">{settingsForm.name}</span>
                            <span className="text-[10px] text-gray-400">{getISTShortDate()}</span>
                        </div>
                    </div>
                    <button onClick={() => setIsSettingsOpen(true)} className="flex items-center gap-3 text-gray-500 hover:text-gray-900 transition-colors">
                        <iconify-icon icon="solar:settings-linear" width="20" height="20"></iconify-icon>
                        <span className="text-sm font-medium">Settings</span>
                    </button>
                </div>
            </div>

            {/* ─── Main Content Area ─── */}
            <div className="flex-1 bg-white h-full overflow-y-auto rounded-tl-3xl rounded-bl-3xl">
                {renderPageContent()}
            </div>

        </div>
    );
}