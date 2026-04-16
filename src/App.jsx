import React, { useState, useMemo } from 'react';

/* ───────────────────────── icon map for nav ───────────────────────── */
const NAV_ICONS = {
    'Goal Timeline': 'solar:chart-2-linear',
    'Daily Routine': 'solar:sun-2-linear',
    'Report': 'solar:document-text-linear',
    'Help center': 'solar:question-circle-linear',
};

/* ───────────────────────── fake routine data ───────────────────────── */
// Remaining routine data
const DAILY_TASKS = [
    { id: 'd1', time: '06:00 AM', title: 'Morning Meditation', category: 'Wellness', icon: 'solar:moon-sleep-linear', done: true },
    { id: 'd2', time: '07:00 AM', title: 'Gym Workout', category: 'Fitness', icon: 'solar:running-2-linear', done: true },
    { id: 'd3', time: '08:30 AM', title: 'Team Stand-up Meeting', category: 'Work', icon: 'solar:users-group-rounded-linear', done: true },
    { id: 'd4', time: '09:00 AM', title: 'Code Review & PR Merge', category: 'Development', icon: 'solar:code-linear', done: false },
    { id: 'd5', time: '12:00 PM', title: 'Lunch Break & Walk', category: 'Health', icon: 'solar:cup-hot-linear', done: false },
    { id: 'd6', time: '02:00 PM', title: 'Client Presentation Prep', category: 'Work', icon: 'solar:presentation-graph-linear', done: false },
    { id: 'd7', time: '04:00 PM', title: 'Read 30 Pages of Book', category: 'Learning', icon: 'solar:book-2-linear', done: false },
    { id: 'd8', time: '06:00 PM', title: 'Instagram Content Creation', category: 'Social media', icon: 'simple-icons:instagram', done: false },
    { id: 'd9', time: '09:00 PM', title: 'Journal & Reflection', category: 'Wellness', icon: 'solar:pen-new-square-linear', done: false },
];

/* ───────────────────────── help center data ───────────────────────── */
const HELP_ITEMS = [
    { q: 'How do I create a new goal?', a: 'Click the "+ Add Goal" button in the top-right corner of the Goal Timeline page. Fill in the goal name, dates, target, and description, then click "Add Goal" to save.' },
    { q: 'Can I edit an existing goal?', a: 'Yes! Click on any goal row to open the Goal Detail panel. You can view all the details and use the edit icon next to the goal name to modify it.' },
    { q: 'How do routines work?', a: 'Routines are organized into a Daily view. It contains task checklists you can toggle as complete. Progress is tracked automatically.' },
    { q: 'Where can I see my progress reports?', a: 'Navigate to the "Report" section from the sidebar. You\'ll find visual charts showing your goal completion rate, category breakdown, and weekly activity trends.' },
    { q: 'How do I mark a goal as done?', a: 'When a goal reaches 100% progress, it automatically moves to the "Goal Done" section. You can also manually update progress from the Goal Detail panel.' },
    { q: 'Can I delete a goal?', a: 'Currently, goals can be archived by marking them as done. Full delete functionality will be available in a future update.' },
    { q: 'How is the achievement count calculated?', a: 'Achievements are counted based on the number of goals that have reached 100% completion and moved to the "Goal Done" section.' },
    { q: 'Is my data saved?', a: 'In this demo version, data is stored in the browser session. For production use, data will sync to your cloud account automatically.' },
];

/* ═══════════════════════════════════════════════════════════════════ */
export default function App() {
    const [activePage, setActivePage] = useState('Goal Timeline');
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [newGoalForm, setNewGoalForm] = useState({ name: '', startDate: '', dueDate: '', target: '', description: '' });

    /* routine state */
    const [dailyTasks, setDailyTasks] = useState(DAILY_TASKS);

    /* help center accordion */
    const [openFaq, setOpenFaq] = useState(null);

    /* settings modal */
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [settingsForm, setSettingsForm] = useState({
        name: 'Arriva Elma',
        email: 'arriva@keepsgoal.com',
        notifications: true,
        darkMode: false,
        language: 'English',
    });

    /* ─── goal lists (on-progress is mutable) ─── */
    const [onProgressGoals, setOnProgressGoals] = useState([
        { id: 1, time: '09:05 AM', icon: 'simple-icons:instagram', title: 'Instagram Post Update', category: 'Social media', startDate: '30 Oct, 2022', dueDate: 'Today, 17:00 PM', target: 'Engagement', status: 'Active', progress: '55%' },
        { id: 2, time: '09:05 AM', icon: 'solar:code-linear', title: 'Android Studio Course', category: 'Learning', startDate: '30 Oct, 2022', dueDate: '25 Dec, 2022', target: 'Intermediate Level', status: 'Active', progress: '80%' },
        { id: 3, time: '09:05 AM', icon: 'solar:case-linear', title: 'Business Improvement', category: 'Business', startDate: '01 Nov, 2022', dueDate: '28 Dec, 2022', target: 'Sales target', status: 'Active', progress: '30%' },
    ]);
    const [doneGoals, setDoneGoals] = useState([
        { id: 4, time: '09:05 AM', icon: 'solar:home-2-linear', title: 'Home Interior Design', category: 'Property', startDate: '10 Oct, 2022', dueDate: '08 Nov, 2022', target: 'Interior Stuff', status: 'Done', progress: '100%' },
        { id: 5, time: '09:05 AM', icon: 'solar:bag-2-linear', title: 'Nike Air Jordan Shoe', category: 'Fashion shopping', startDate: '15 Oct, 2022', dueDate: '25 Oct, 2022', target: 'Upgrade Style', status: 'Done', progress: '100%' },
    ]);

    /* ─── derived / computed ─── */
    const totalGoals = onProgressGoals.length + doneGoals.length;
    const filteredProgress = useMemo(() =>
        onProgressGoals.filter(g => g.title.toLowerCase().includes(searchQuery.toLowerCase())), [onProgressGoals, searchQuery]);
    const filteredDone = useMemo(() =>
        doneGoals.filter(g => g.title.toLowerCase().includes(searchQuery.toLowerCase())), [doneGoals, searchQuery]);

    /* ─── handlers ─── */
    const handleAddGoalSubmit = () => {
        const icons = ['solar:target-linear', 'solar:star-linear', 'solar:flag-linear', 'solar:rocket-2-linear', 'solar:cup-star-linear'];
        const newEntry = {
            id: Date.now(),
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            icon: icons[Math.floor(Math.random() * icons.length)],
            title: newGoalForm.name || 'Untitled Goal',
            category: 'Custom',
            startDate: newGoalForm.startDate || 'N/A',
            dueDate: newGoalForm.dueDate || 'N/A',
            target: newGoalForm.target || 'N/A',
            status: 'Active',
            progress: '0%',
        };
        setOnProgressGoals([newEntry, ...onProgressGoals]);
        setIsAddGoalModalOpen(false);
        setNewGoalForm({ name: '', startDate: '', dueDate: '', target: '', description: '' });
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

    const handleNavClick = (label) => {
        setActivePage(label);
        setSelectedGoal(null);
        setSearchQuery('');
    };

    /* ─── nav items ─── */
    const navLinks = [
        'Goal Timeline', 'Daily Routine', 'Report', 'Help center',
    ];

    /* ════════════════════════  PAGE RENDERERS  ════════════════════════ */

    /* ─── Goal Timeline (main page) ─── */
    const renderGoalTimeline = () => (
        <>
            {/* Header */}
            <div className="flex justify-between items-center px-12 py-10 border-b border-gray-100">
                <h1 className="text-4xl tracking-tight font-normal">Goal Timeline</h1>
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

            {/* Stats Row */}
            <div className="grid grid-cols-4 px-12 py-8 border-b border-gray-100">
                <div>
                    <div className="text-sm text-gray-500 mb-1">Goal</div>
                    <div className="text-base font-medium">This month</div>
                </div>
                <div className="border-l border-gray-100 pl-8">
                    <div className="text-sm text-gray-500 mb-1">Total</div>
                    <div className="text-base font-medium">{totalGoals} Goal{totalGoals !== 1 ? 's' : ''}</div>
                </div>
                <div className="border-l border-gray-100 pl-8">
                    <div className="text-sm text-gray-500 mb-1">In progress</div>
                    <div className="text-base font-medium">{onProgressGoals.length} Active</div>
                </div>
                <div className="border-l border-gray-100 pl-8">
                    <div className="text-sm text-gray-500 mb-1">Goal achieved</div>
                    <div className="text-base font-medium">{doneGoals.length} Achievement{doneGoals.length !== 1 ? 's' : ''}</div>
                </div>
            </div>

            {/* Table */}
            <div className="px-12 pt-10 pb-20">
                <div className="grid grid-cols-[120px_1fr_150px_150px] gap-8 text-sm text-gray-500 mb-6 border-b border-gray-100 pb-4">
                    <div>Date created</div><div>Goal name</div><div>Due date</div><div>Goal target</div>
                </div>

                {/* On Progress */}
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

                {/* Done */}
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

    /* ─── Routine renderer (shared for daily/weekly/monthly) ─── */
    const renderRoutinePage = (title, subtitle, tasks, toggleFn, labelKey) => {
        const doneCount = tasks.filter(t => t.done).length;
        const pct = Math.round((doneCount / tasks.length) * 100);
        return (
            <>
                <div className="flex justify-between items-center px-12 py-10 border-b border-gray-100">
                    <div>
                        <h1 className="text-4xl tracking-tight font-normal">{title}</h1>
                        <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-xs text-gray-400">Completed</div>
                            <div className="text-lg font-medium">{doneCount}/{tasks.length}</div>
                        </div>
                        <div className="w-14 h-14 rounded-full border-[3px] border-[#bef445] flex items-center justify-center">
                            <span className="text-sm font-semibold">{pct}%</span>
                        </div>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="px-12 pt-6 pb-2">
                    <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-[#bef445] h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
                    </div>
                </div>

                <div className="px-12 pt-6 pb-20 space-y-3">
                    {tasks.map(task => (
                        <div key={task.id} onClick={() => toggleFn(task.id)}
                            className={`flex items-center gap-5 py-4 px-5 rounded-xl cursor-pointer transition-all ${task.done ? 'bg-gray-50' : 'hover:bg-gray-50'}`}>
                            {/* checkbox */}
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${task.done ? 'bg-[#bef445] border-[#bef445]' : 'border-gray-300'}`}>
                                {task.done && <iconify-icon icon="solar:check-read-linear" width="14" height="14" className="text-gray-900"></iconify-icon>}
                            </div>
                            {/* icon */}
                            <div className="w-10 h-10 rounded-full bg-[#f0f2eb] flex items-center justify-center flex-shrink-0">
                                <iconify-icon icon={task.icon} width="20" height="20" className="text-gray-700"></iconify-icon>
                            </div>
                            {/* info */}
                            <div className="flex-1 min-w-0">
                                <div className={`text-sm font-medium ${task.done ? 'line-through text-gray-400' : 'text-gray-900'}`}>{task.title}</div>
                                <div className="text-xs text-gray-400">{task.category}</div>
                            </div>
                            {/* time / label */}
                            <div className="text-sm text-gray-400 flex-shrink-0">{task[labelKey]}</div>
                        </div>
                    ))}
                </div>
            </>
        );
    };

    /* ─── Report page ─── */
    const renderReport = () => {
        const categories = {};
        [...onProgressGoals, ...doneGoals].forEach(g => { categories[g.category] = (categories[g.category] || 0) + 1; });
        const catEntries = Object.entries(categories).sort((a, b) => b[1] - a[1]);
        const maxCat = Math.max(...catEntries.map(c => c[1]), 1);

        const dailyDone = dailyTasks.filter(t => t.done).length;

        return (
            <>
                <div className="px-12 py-10 border-b border-gray-100">
                    <h1 className="text-4xl tracking-tight font-normal">Report</h1>
                    <p className="text-sm text-gray-400 mt-1">Your progress overview and analytics</p>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-4 gap-6 px-12 py-8">
                    {[
                        { label: 'Total Goals', value: totalGoals, icon: 'solar:target-linear', color: 'bg-[#bef445]' },
                        { label: 'In Progress', value: onProgressGoals.length, icon: 'solar:refresh-circle-linear', color: 'bg-amber-100' },
                        { label: 'Completed', value: doneGoals.length, icon: 'solar:check-circle-linear', color: 'bg-emerald-100' },
                        { label: 'Completion Rate', value: totalGoals > 0 ? Math.round((doneGoals.length / totalGoals) * 100) + '%' : '0%', icon: 'solar:chart-2-linear', color: 'bg-sky-100' },
                    ].map((s, i) => (
                        <div key={i} className="bg-gray-50 rounded-2xl p-6">
                            <div className={`w-10 h-10 ${s.color} rounded-full flex items-center justify-center mb-4`}>
                                <iconify-icon icon={s.icon} width="20" height="20" className="text-gray-800"></iconify-icon>
                            </div>
                            <div className="text-xs text-gray-400 mb-1">{s.label}</div>
                            <div className="text-2xl font-medium">{s.value}</div>
                        </div>
                    ))}
                </div>

                {/* Category breakdown */}
                <div className="px-12 py-6">
                    <h2 className="text-lg font-medium mb-6">Goals by Category</h2>
                    <div className="space-y-4">
                        {catEntries.map(([cat, count]) => (
                            <div key={cat} className="flex items-center gap-4">
                                <div className="w-32 text-sm text-gray-600 truncate">{cat}</div>
                                <div className="flex-1 bg-gray-100 rounded-full h-3">
                                    <div className="bg-[#1b1b1b] h-3 rounded-full transition-all duration-500" style={{ width: `${(count / maxCat) * 100}%` }}></div>
                                </div>
                                <div className="text-sm font-medium w-8 text-right">{count}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Routine progress */}
                <div className="px-12 py-6 pb-20">
                    <h2 className="text-lg font-medium mb-6">Routine Completion</h2>
                    <div className="grid grid-cols-1 gap-6 max-w-xs">
                        {[
                            { label: 'Daily', done: dailyDone, total: dailyTasks.length, color: '#bef445' },
                        ].map((r, i) => {
                            const rpct = r.total > 0 ? Math.round((r.done / r.total) * 100) : 0;
                            return (
                                <div key={i} className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center">
                                    <div className="w-20 h-20 rounded-full border-4 flex items-center justify-center mb-4" style={{ borderColor: r.color }}>
                                        <span className="text-lg font-semibold">{rpct}%</span>
                                    </div>
                                    <div className="text-sm font-medium">{r.label} Routine</div>
                                    <div className="text-xs text-gray-400 mt-1">{r.done}/{r.total} tasks done</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Weekly activity chart */}
                <div className="px-12 py-6 pb-20">
                    <h2 className="text-lg font-medium mb-6">Weekly Activity</h2>
                    <div className="flex items-end gap-3 h-40">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => {
                            const h = [65, 80, 45, 90, 55, 30, 70][i];
                            return (
                                <div key={d} className="flex-1 flex flex-col items-center gap-2">
                                    <div className="w-full rounded-lg transition-all duration-300 hover:opacity-80" style={{ height: `${h}%`, backgroundColor: i === 3 ? '#bef445' : '#1b1b1b' }}></div>
                                    <span className="text-xs text-gray-400">{d}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </>
        );
    };

    /* ─── Help Center page ─── */
    const renderHelpCenter = () => (
        <>
            <div className="px-12 py-10 border-b border-gray-100">
                <h1 className="text-4xl tracking-tight font-normal">Help Center</h1>
                <p className="text-sm text-gray-400 mt-1">Find answers to common questions</p>
            </div>

            {/* Search */}
            <div className="px-12 pt-8 pb-4">
                <div className="relative max-w-lg">
                    <iconify-icon icon="solar:magnifer-linear" width="18" height="18" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></iconify-icon>
                    <input type="text" placeholder="Search help articles..." className="w-full border border-gray-200 rounded-lg pl-11 pr-4 py-3 text-sm outline-none focus:border-gray-300 placeholder:text-gray-300" />
                </div>
            </div>

            {/* Quick links */}
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

            {/* FAQ Accordion */}
            <div className="px-12 py-6 pb-20">
                <h2 className="text-lg font-medium mb-6">Frequently Asked Questions</h2>
                <div className="space-y-3">
                    {HELP_ITEMS.map((item, i) => (
                        <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                            <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                className="w-full flex justify-between items-center px-6 py-4 text-left hover:bg-gray-50 transition-colors">
                                <span className="text-sm font-medium">{item.q}</span>
                                <iconify-icon
                                    icon={openFaq === i ? 'solar:alt-arrow-up-linear' : 'solar:alt-arrow-down-linear'}
                                    width="18" height="18" className="text-gray-400 flex-shrink-0 ml-4"
                                ></iconify-icon>
                            </button>
                            {openFaq === i && (
                                <div className="px-6 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
                                    {item.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );

    /* ─── active page content ─── */
    const renderPageContent = () => {
        switch (activePage) {
            case 'Goal Timeline': return renderGoalTimeline();
            case 'Daily Routine': return renderRoutinePage('Daily Routine', 'Your daily tasks and habits', dailyTasks, toggleDailyTask, 'time');
            case 'Report': return renderReport();
            case 'Help center': return renderHelpCenter();
            default: return renderGoalTimeline();
        }
    };

    /* ═══════════════════════════  RENDER  ═══════════════════════════ */
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
                                        <input type="text" placeholder="30 Oct, 2022" value={newGoalForm.startDate} onChange={(e) => setNewGoalForm({ ...newGoalForm, startDate: e.target.value })}
                                            className="w-full text-sm outline-none placeholder-gray-300 text-gray-900" />
                                        <iconify-icon icon="solar:calendar-linear" width="16" height="16" className="text-gray-400"></iconify-icon>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 block mb-2">Due Date</label>
                                    <div className="border-b border-gray-200 pb-2 flex justify-between items-center">
                                        <input type="text" placeholder="25 Dec, 2022" value={newGoalForm.dueDate} onChange={(e) => setNewGoalForm({ ...newGoalForm, dueDate: e.target.value })}
                                            className="w-full text-sm outline-none placeholder-gray-300 text-gray-900" />
                                        <iconify-icon icon="solar:calendar-linear" width="16" height="16" className="text-gray-400"></iconify-icon>
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
                        <div className="p-8 pt-4 flex gap-4">
                            <button onClick={handleAddGoalSubmit}
                                className="flex-1 bg-[#bef445] text-gray-900 text-sm font-medium py-3 rounded-lg hover:bg-[#a6d83a] transition-colors">Add Goal</button>
                            <button onClick={() => setIsAddGoalModalOpen(false)}
                                className="flex-1 bg-white text-gray-900 text-sm font-medium py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">Cancel</button>
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
                                    <input type="text" value={settingsForm.name} onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                                        className="w-full text-sm outline-none text-gray-900" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 block mb-2">Email</label>
                                <div className="border-b border-gray-200 pb-2">
                                    <input type="email" value={settingsForm.email} onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                                        className="w-full text-sm outline-none text-gray-900" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 block mb-2">Language</label>
                                <div className="border-b border-gray-200 pb-2">
                                    <select value={settingsForm.language} onChange={(e) => setSettingsForm({ ...settingsForm, language: e.target.value })}
                                        className="w-full text-sm outline-none text-gray-900 bg-transparent">
                                        <option>English</option><option>Spanish</option><option>French</option><option>German</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-medium">Notifications</div>
                                    <div className="text-xs text-gray-400">Receive push notifications</div>
                                </div>
                                <button onClick={() => setSettingsForm({ ...settingsForm, notifications: !settingsForm.notifications })}
                                    className={`w-11 h-6 rounded-full transition-colors relative ${settingsForm.notifications ? 'bg-[#bef445]' : 'bg-gray-200'}`}>
                                    <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-transform ${settingsForm.notifications ? 'translate-x-[22px]' : 'translate-x-0.5'}`}></div>
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-medium">Dark Mode</div>
                                    <div className="text-xs text-gray-400">Use dark appearance</div>
                                </div>
                                <button onClick={() => setSettingsForm({ ...settingsForm, darkMode: !settingsForm.darkMode })}
                                    className={`w-11 h-6 rounded-full transition-colors relative ${settingsForm.darkMode ? 'bg-[#bef445]' : 'bg-gray-200'}`}>
                                    <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-transform ${settingsForm.darkMode ? 'translate-x-[22px]' : 'translate-x-0.5'}`}></div>
                                </button>
                            </div>
                        </div>
                        <div className="p-8 pt-2 flex gap-4">
                            <button onClick={() => setIsSettingsOpen(false)}
                                className="flex-1 bg-[#bef445] text-gray-900 text-sm font-medium py-3 rounded-lg hover:bg-[#a6d83a] transition-colors">Save Changes</button>
                            <button onClick={() => setIsSettingsOpen(false)}
                                className="flex-1 bg-white text-gray-900 text-sm font-medium py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">Cancel</button>
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
                        <div>
                            <label className="text-xs text-gray-400 mb-2 block">Status</label>
                            <div className="border-b border-gray-100 pb-2"><span className="text-base font-medium">{selectedGoal.status}</span></div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs text-gray-400 mb-2 block">Start date</label>
                                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                                    <span className="text-base font-medium">{selectedGoal.startDate}</span>
                                    <iconify-icon icon="solar:calendar-linear" width="16" height="16" className="text-gray-800"></iconify-icon>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 mb-2 block">Due Date</label>
                                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                                    <span className="text-base font-medium">{selectedGoal.dueDate}</span>
                                    <iconify-icon icon="solar:calendar-linear" width="16" height="16" className="text-gray-800"></iconify-icon>
                                </div>
                            </div>
                        </div>
                        <div className="pb-6 border-b border-dashed border-gray-200">
                            <label className="text-xs text-gray-400 mb-2 block">Goal target</label>
                            <div className="pb-2"><span className="text-base font-medium">{selectedGoal.target}</span></div>
                        </div>

                        {/* Progress */}
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
                            <div className="flex justify-between text-xs text-gray-400">
                                <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-3 pt-4 border-t border-gray-100">
                            {selectedGoal.status !== 'Done' && (
                                <button onClick={() => handleMarkDone(selectedGoal.id)}
                                    className="flex-1 bg-[#bef445] text-gray-900 text-xs font-medium py-2.5 rounded-lg hover:bg-[#a6d83a] transition-colors">
                                    Mark as Done
                                </button>
                            )}
                            <button onClick={() => handleDeleteGoal(selectedGoal.id)}
                                className="flex-1 bg-white text-red-500 text-xs font-medium py-2.5 rounded-lg border border-red-200 hover:bg-red-50 transition-colors">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Left Sidebar ─── */}
            <div className="w-[280px] flex-shrink-0 flex flex-col justify-between pt-16 pb-8 px-6">
                <div>
                    <div className="text-xl tracking-tight font-semibold mb-12 px-4">KEEPSGOAL</div>
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
                <div className="space-y-6 px-4">
                    <div className="flex items-center gap-3">
                        <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="User" className="w-8 h-8 rounded-full bg-gray-200 object-cover" />
                        <span className="text-sm font-medium">{settingsForm.name}</span>
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