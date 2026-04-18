import type { DailyTask, Goal, HelpItem, StrategyPlan } from '@/types';

export const INITIAL_DAILY_TASKS: DailyTask[] = [
  {
    id: 'd1',
    startTime: '06:00',
    endTime: '06:30',
    title: 'Morning Meditation',
    category: 'Wellness',
    note: 'Focus on breathing for 15 min',
    subtasks: [
      { text: 'Set up mat', done: true },
      { text: 'Guided session', done: true },
    ],
    done: true,
  },
  {
    id: 'd2',
    startTime: '07:00',
    endTime: '08:00',
    title: 'Gym Workout',
    category: 'Fitness',
    note: 'Upper body day - bench press & rows',
    subtasks: [
      { text: 'Warm up 10 min', done: true },
      { text: 'Main workout', done: true },
      { text: 'Cool down stretch', done: false },
    ],
    done: true,
  },
  {
    id: 'd3',
    startTime: '08:30',
    endTime: '09:00',
    title: 'Team Stand-up Meeting',
    category: 'Meeting',
    note: 'Daily sync with dev team on Zoom',
    subtasks: [
      { text: 'Review blockers', done: true },
      { text: 'Share updates', done: true },
    ],
    done: true,
  },
  {
    id: 'd4',
    startTime: '09:00',
    endTime: '11:00',
    title: 'Code Review & PR Merge',
    category: 'Development',
    note: 'Review feature branch #42 and auth module',
    subtasks: [
      { text: 'Check unit tests', done: false },
      { text: 'Review code quality', done: false },
      { text: 'Approve & merge', done: false },
    ],
    done: false,
  },
  {
    id: 'd5',
    startTime: '12:00',
    endTime: '13:00',
    title: 'Lunch Break & Walk',
    category: 'Food',
    note: 'Try the new cafe downtown',
    subtasks: [
      { text: 'Order food', done: false },
      { text: '15 min walk', done: false },
    ],
    done: false,
  },
  {
    id: 'd6',
    startTime: '14:00',
    endTime: '15:30',
    title: 'Client Presentation Prep',
    category: 'Work',
    note: 'Q4 metrics deck for Acme Corp',
    subtasks: [
      { text: 'Finalize slides', done: false },
      { text: 'Practice pitch', done: false },
      { text: 'Send calendar invite', done: false },
    ],
    done: false,
  },
  {
    id: 'd7',
    startTime: '16:00',
    endTime: '17:00',
    title: 'Read 30 Pages of Book',
    category: 'Learning',
    note: 'Atomic Habits by James Clear - Chapter 8',
    subtasks: [
      { text: 'Read chapter', done: false },
      { text: 'Take notes', done: false },
    ],
    done: false,
  },
  {
    id: 'd8',
    startTime: '18:00',
    endTime: '19:00',
    title: 'Instagram Content Creation',
    category: 'Social media',
    note: 'Reel editing + story design for brand',
    subtasks: [
      { text: 'Shoot reel', done: false },
      { text: 'Edit & add captions', done: false },
      { text: 'Schedule post', done: false },
    ],
    done: false,
  },
  {
    id: 'd9',
    startTime: '21:00',
    endTime: '21:30',
    title: 'Journal & Reflection',
    category: 'Creative',
    note: 'Gratitude journal + day review',
    subtasks: [
      { text: 'Write 3 things grateful for', done: false },
      { text: 'Plan tomorrow', done: false },
    ],
    done: false,
  },
];

export const INITIAL_ON_PROGRESS_GOALS: Goal[] = [
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
    progress: '55%',
    createdAt: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
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
    progress: '80%',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 days ago
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
    progress: '30%',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10, // 10 days ago
  },
];

export const INITIAL_DONE_GOALS: Goal[] = [
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
    progress: '100%',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 45, // 45 days ago
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
    progress: '100%',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 400, // 400 days ago (last year)
  },
];

export const INITIAL_HELP_ITEMS: HelpItem[] = [
  {
    q: 'How do I create a new goal?',
    a: "Click the \"+ Add Goal\" button in the top-right corner of the Goal Timeline page. Fill in the goal name, dates, target, and description, then click \"Add Goal\" to save.",
  },
  {
    q: 'Can I edit an existing goal?',
    a: "Yes! Click on any goal row to open the Goal Detail panel. You can view all the details and use the edit icon next to the goal name to modify it.",
  },
  {
    q: 'How do routines work?',
    a: 'Routines are organized into a Daily view with subtasks, notes, and time tracking. Click the edit icon to modify any task, add subtasks, or write notes.',
  },
  {
    q: 'Where can I see my progress reports?',
    a: "Navigate to the \"Report\" section from the sidebar. You'll find visual charts showing your goal completion rate, category breakdown, and daily activity.",
  },
  {
    q: 'How do I mark a goal as done?',
    a: 'When a goal reaches 100% progress, it automatically moves to the "Goal Done" section. You can also manually update progress from the Goal Detail panel.',
  },
  {
    q: 'Can I delete a goal?',
    a: 'Currently, goals can be archived by marking them as done. Full delete functionality will be available in a future update.',
  },
  {
    q: 'How is the achievement count calculated?',
    a: 'Achievements are counted based on the number of goals that have reached 100% completion and moved to the "Goal Done" section.',
  },
  {
    q: 'Is my data saved?',
    a: 'In this demo version, data is stored in the browser session. For production use, data will sync to your cloud account automatically.',
  },
];

export const INITIAL_STRATEGY_PLANS: StrategyPlan[] = [
  {
    goalId: 2,
    goalTitle: 'Android Studio Course',
    phases: [
      {
        id: 'p1',
        name: 'Foundation',
        timeframe: 'Week 1-2',
        status: 'done',
        milestones: [
          { text: 'Install Android Studio & configure SDK', done: true },
          { text: 'Complete Kotlin basics tutorial', done: true },
          { text: 'Build first Hello World app', done: true },
        ],
        keyActions: 'Complete 2 hrs daily study sessions',
        risks: 'Setup issues on older hardware',
      },
      {
        id: 'p2',
        name: 'Core Concepts',
        timeframe: 'Week 3-4',
        status: 'active',
        milestones: [
          { text: 'Learn Activity lifecycle', done: true },
          { text: 'Master RecyclerView & Adapters', done: false },
          { text: 'Implement Navigation component', done: false },
        ],
        keyActions: 'Build 1 mini-project per concept',
        risks: 'Complexity jump from basics',
      },
      {
        id: 'p3',
        name: 'Intermediate Projects',
        timeframe: 'Week 5-7',
        status: 'upcoming',
        milestones: [
          { text: 'Build a To-Do app with Room DB', done: false },
          { text: 'Integrate REST API with Retrofit', done: false },
          { text: 'Add authentication with Firebase', done: false },
        ],
        keyActions: 'Complete full project each week',
        risks: 'API integration debugging',
      },
      {
        id: 'p4',
        name: 'Final Capstone',
        timeframe: 'Week 8',
        status: 'upcoming',
        milestones: [
          { text: 'Design capstone app UI', done: false },
          { text: 'Implement all features', done: false },
          { text: 'Test & deploy to Play Store', done: false },
        ],
        keyActions: 'Full-time development sprint',
        risks: 'Scope creep - keep MVP focused',
      },
    ],
  },
];
