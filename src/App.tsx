import React from 'react';
import { AppProvider, useApp } from '@/context';
import { ErrorBoundary } from '@/components';
import {
  Sidebar,
  AddGoalModal,
  EditTaskModal,
  AddTaskModal,
  SettingsModal,
  ToastContainer,
  ChatBot,
} from '@/components';
import {
  GoalTimeline,
  DailyRoutine,
  Report,
  HelpCenter,
  StrategyPlanner,
  Scheduling,
} from '@/pages';

function PageContent() {
  const { activePage } = useApp();

  const renderPage = (): React.ReactNode => {
    switch (activePage) {
      case 'Goal Timeline':
        return <GoalTimeline />;
      case 'Daily Routine':
        return <DailyRoutine />;
      case 'Report':
        return <Report />;
      case 'Help center':
        return <HelpCenter />;
      case 'Strategy Planner':
        return <StrategyPlanner />;
      case 'Scheduling':
        return <Scheduling />;
      default:
        return <GoalTimeline />;
    }
  };

  return (
    <main
      className="flex-1 bg-[#f0fdf4] h-full overflow-y-auto rounded-none border-l border-[#dcfce7] transition-colors duration-300"
      role="main"
    >
      <div className="animate-fade-in" key={activePage}>
        {renderPage()}
      </div>
    </main>
  );
}

function AppContent() {
  const { toasts, removeToast } = useApp();

  return (
    <div className="bg-[#f0fdf4] text-[#0f172a] font-sans h-screen flex overflow-hidden relative transition-colors duration-300">
      <Sidebar />
      <PageContent />

      <AddGoalModal />
      <EditTaskModal />
      <AddTaskModal />
      <SettingsModal />
      <ChatBot />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
