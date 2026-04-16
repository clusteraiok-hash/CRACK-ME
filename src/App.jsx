import React, { useState } from 'react';

export default function App() {
    const [selectedGoal, setSelectedGoal] = useState(null);

    const navLinks = [
        { label: 'Goal Timeline', active: true },
        { label: 'Daily Routine' },
        { label: 'Weekly Routine' },
        { label: 'Monthly Routine' },
        { label: 'Report' },
        { label: 'Help center' },
    ];

    const onProgressGoals = [
        {
            id: 1,
            time: '09:05 AM',
            icon: 'simple-icons:instagram',
            title: 'Instagram Post Update',
            category: 'Social media',
            startDate: '30 Oct, 2022',
            dueDate: 'Today, 17:00 PM',
            target: 'Engagement',
            status: 'Active',
            progress: '55%'
        },
        {
            id: 2,
            time: '09:05 AM',
            icon: 'solar:code-linear',
            title: 'Android Studio Course',
            category: 'Learning',
            startDate: '30 Oct, 2022',
            dueDate: '25 Dec, 2022',
            target: 'Intermediate Level',
            status: 'Active',
            progress: '80%'
        },
        {
            id: 3,
            time: '09:05 AM',
            icon: 'solar:case-linear',
            title: 'Business Improvement',
            category: 'Business',
            startDate: '01 Nov, 2022',
            dueDate: '28 Dec, 2022',
            target: 'Sales target',
            status: 'Active',
            progress: '30%'
        }
    ];

    const doneGoals = [
        {
            id: 4,
            time: '09:05 AM',
            icon: 'solar:home-2-linear',
            title: 'Home Interior Design',
            category: 'Property',
            startDate: '10 Oct, 2022',
            dueDate: '08 Nov, 2022',
            target: 'Interior Stuff',
            status: 'Done',
            progress: '100%'
        },
        {
            id: 5,
            time: '09:05 AM',
            icon: 'solar:bag-2-linear',
            title: 'Nike Air Jordan Shoe',
            category: 'Fashion shopping',
            startDate: '15 Oct, 2022',
            dueDate: '25 Oct, 2022',
            target: 'Upgrade Style',
            status: 'Done',
            progress: '100%'
        }
    ];

    return (
        <div className="bg-[#f0f2eb] text-gray-900 font-sans h-screen flex overflow-hidden relative">

            {/* Floating Goal Detail Panel */}
            {selectedGoal && (
                <div className="absolute top-16 left-16 w-[380px] bg-white rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-8 z-50">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl tracking-tight font-medium">Goal Detail</h2>
                        <button onClick={() => setSelectedGoal(null)} className="text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center">
                            <iconify-icon icon="solar:logout-2-linear" width="20" height="20" className="-scale-x-100"></iconify-icon>
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Goal Name */}
                        <div>
                            <label className="text-xs text-gray-400 mb-2 block">Goal name</label>
                            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                                <span className="text-base font-medium">{selectedGoal.title}</span>
                                <button className="text-gray-800 flex items-center justify-center">
                                    <iconify-icon icon="solar:pen-linear" width="16" height="16"></iconify-icon>
                                </button>
                            </div>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="text-xs text-gray-400 mb-2 block">Status</label>
                            <div className="border-b border-gray-100 pb-2">
                                <span className="text-base font-medium">{selectedGoal.status}</span>
                            </div>
                        </div>

                        {/* Dates Grid */}
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

                        {/* Goal Target */}
                        <div className="pb-6 border-b border-dashed border-gray-200">
                            <label className="text-xs text-gray-400 mb-2 block">Goal target</label>
                            <div className="pb-2">
                                <span className="text-base font-medium">{selectedGoal.target}</span>
                            </div>
                        </div>

                        {/* Progress Section */}
                        <div className="pt-2">
                            <label className="text-xs text-gray-500 mb-3 block">Progress</label>
                            <h3 className="text-xl tracking-tight font-medium mb-3">{selectedGoal.title}</h3>

                            <div className="flex gap-2 mb-6">
                                <span className="px-3 py-1 bg-[#e8faeb] text-[#22c55e] text-xs font-medium rounded-full">{selectedGoal.progress}</span>
                                <span className="px-3 py-1 bg-[#f4fcf6] text-[#22c55e] text-xs font-medium rounded-full">{selectedGoal.category}</span>
                            </div>

                            {/* Chart Area */}
                            <div className="w-full h-24 relative mb-2">
                                <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                                    {/* Bottom subtle line */}
                                    <path d="M0,35 Q5,36 10,33 T20,35 T30,32 T40,34 T45,30 T50,32 T60,30 T70,31 T80,29 T90,30 T100,28" stroke="#9ca3af" strokeWidth="0.5" fill="none" vectorEffect="non-scaling-stroke"></path>
                                    {/* Top main line */}
                                    <path d="M0,28 Q4,30 8,26 T16,28 T24,23 T30,25 T36,18 T42,22 T50,15 T56,18 T64,12 T72,16 T80,10 T86,14 T94,8 T100,2" stroke="#1f2937" strokeWidth="1.2" fill="none" vectorEffect="non-scaling-stroke"></path>
                                </svg>
                            </div>

                            {/* Chart Labels */}
                            <div className="flex justify-between text-xs text-gray-400">
                                <span>Sun</span>
                                <span>Mon</span>
                                <span>Tue</span>
                                <span>Wed</span>
                                <span>Thu</span>
                                <span>Fri</span>
                                <span>Sat</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Left Sidebar Area (Background) */}
            <div className="w-[280px] flex-shrink-0 flex flex-col justify-between pt-16 pb-8 px-6">
                <div>
                    <div className="text-xl tracking-tight font-semibold mb-12 px-4">SGOAL</div>
                    <nav className="space-y-1">
                        {navLinks.map((link, idx) => (
                            <a
                                key={idx}
                                href="#"
                                className={link.active
                                    ? "block px-4 py-3 bg-[#bef445] rounded-lg text-sm font-medium transition-colors"
                                    : "block px-4 py-3 text-gray-500 hover:text-gray-900 text-sm transition-colors"}
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>
                </div>

                <div className="space-y-6 px-4">
                    <div className="flex items-center gap-3">
                        <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="User" className="w-8 h-8 rounded-full bg-gray-200 object-cover" />
                        <span className="text-sm font-medium">Arriva Elma</span>
                    </div>
                    <button className="flex items-center gap-3 text-gray-500 hover:text-gray-900 transition-colors">
                        <iconify-icon icon="solar:settings-linear" width="20" height="20"></iconify-icon>
                        <span className="text-sm font-medium">Settings</span>
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-white h-full overflow-y-auto">

                {/* Header */}
                <div className="flex justify-between items-center px-12 py-10 border-b border-gray-100">
                    <h1 className="text-4xl tracking-tight font-normal">Goal Timeline</h1>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="border border-gray-200 rounded-lg pl-3 pr-10 py-2 text-sm outline-none focus:border-gray-300 w-48 transition-colors"
                        />
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-4 px-12 py-8 border-b border-gray-100">
                    <div>
                        <div className="text-sm text-gray-500 mb-1">Goal</div>
                        <div className="text-base font-medium">This month</div>
                    </div>
                    <div className="border-l border-gray-100 pl-8">
                        <div className="text-sm text-gray-500 mb-1">Goal</div>
                        <div className="text-base font-medium">8 Goal</div>
                    </div>
                    <div className="border-l border-gray-100 pl-8">
                        <div className="text-sm text-gray-500 mb-1">Due date</div>
                        <div className="text-base font-medium">30 Nov, 2022</div>
                    </div>
                    <div className="border-l border-gray-100 pl-8">
                        <div className="text-sm text-gray-500 mb-1">Goal achieve</div>
                        <div className="text-base font-medium">4 Achievement</div>
                    </div>
                </div>

                {/* Table Structure */}
                <div className="px-12 pt-10 pb-20">

                    {/* Table Header */}
                    <div className="grid grid-cols-[120px_1fr_150px_150px] gap-8 text-sm text-gray-500 mb-6 border-b border-gray-100 pb-4">
                        <div>Date created</div>
                        <div>Goal name</div>
                        <div>Due date</div>
                        <div>Goal target</div>
                    </div>

                    {/* Section: On Progress */}
                    <div className="mb-10">
                        <h2 className="text-2xl tracking-tight font-normal mb-6">On progress</h2>

                        <div className="flex flex-col">
                            {onProgressGoals.map((goal) => {
                                const isActive = selectedGoal && selectedGoal.id === goal.id;
                                return (
                                    <div 
                                        key={goal.id} 
                                        onClick={() => setSelectedGoal(goal)}
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
                                )
                            })}
                        </div>
                    </div>

                    {/* Section: Goal Done */}
                    <div>
                        <h2 className="text-2xl tracking-tight font-normal mb-6 pt-4">Goal done</h2>

                        <div className="flex flex-col">
                            {doneGoals.map((goal) => {
                                const isActive = selectedGoal && selectedGoal.id === goal.id;
                                return (
                                    <div 
                                        key={goal.id} 
                                        onClick={() => setSelectedGoal(goal)}
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
                                )
                            })}
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}