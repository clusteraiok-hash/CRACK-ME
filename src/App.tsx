import React, { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
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
import { Landing } from '@/pages/Landing';
import { Login, Signup } from '@/pages/Auth';

type AppRoute = 'landing' | 'login' | 'signup' | 'dashboard';

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

function DashboardContent() {
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

function AuthenticatedApp() {
  return (
    <AppProvider>
      <DashboardContent />
    </AppProvider>
  );
}

function AppRouter() {
  const { user, loading } = useAuth();
  const [route, setRoute] = useState<AppRoute>(user ? 'dashboard' : 'landing');

  // Sync route when auth state changes
  React.useEffect(() => {
    if (user && (route === 'landing' || route === 'login' || route === 'signup')) {
      setRoute('dashboard');
    }
    if (!user && !loading && route === 'dashboard') {
      setRoute('landing');
    }
  }, [user, loading, route]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0fdf4] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="text-[#bef264] text-lg">■</span>
            <span className="ml-1 uppercase tracking-[0.15em] text-sm font-black text-[#022c22]">Clauseal</span>
            <span className="text-[#bef264] font-light -mt-2 ml-0.5">+</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#022c22]/30 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-[#022c22]/30 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-[#022c22]/30 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  if (user) {
    return <AuthenticatedApp />;
  }

  switch (route) {
    case 'login':
      return <Login onNavigate={(page) => setRoute(page)} />;
    case 'signup':
      return <Signup onNavigate={(page) => setRoute(page)} />;
    default:
      return <Landing onNavigate={(page) => setRoute(page)} />;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
      <Analytics />
    </ErrorBoundary>
  );
}
