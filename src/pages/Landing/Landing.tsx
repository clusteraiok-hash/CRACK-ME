import { memo } from 'react';

const FEATURES = [
  { icon: 'solar:target-linear', title: 'Goal Tracking', desc: 'Set objectives with deadlines, milestones, and measurable key metrics. Track progress in real-time.' },
  { icon: 'solar:sun-2-linear', title: 'Daily Routines', desc: 'Build structured daily habits with subtask gating, time blocks, and auto-reset at midnight.' },
  { icon: 'solar:routing-2-linear', title: 'Strategy Planner', desc: 'Break goals into phased strategies with milestones, key actions, and risk assessment.' },
  { icon: 'solar:chat-round-dots-bold-duotone', title: 'AI Assistant', desc: 'Get intelligent recommendations and accountability prompts from your AI productivity coach.' },
  { icon: 'solar:document-text-linear', title: 'Reports & Analytics', desc: 'Visualize progress with contribution grids, category breakdowns, streaks, and completion metrics.' },
  { icon: 'solar:calendar-date-linear', title: 'Smart Scheduling', desc: 'Weekly calendar view with drag events, time-block visualization, and goal deadline overlays.' },
];

const LOGOS = ['Nexora', 'Stratify', 'Veloxia', 'Quantis', 'Apexion'];

interface LandingProps {
  onNavigate: (page: 'login' | 'signup') => void;
}

export const Landing = memo(function Landing({ onNavigate }: LandingProps) {
  return (
    <div className="min-h-screen bg-[#f0fdf4] text-[#022c22] font-sans overflow-x-hidden">
      {/* ─── Navbar ─────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#dcfce7]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-1 font-bold tracking-tighter text-lg">
            <span className="text-[#bef264] text-sm">■</span>
            <span className="ml-1 uppercase tracking-[0.15em] text-xs font-black text-[#022c22]">Clauseal</span>
            <span className="text-[#bef264] font-light -mt-1.5 ml-0.5 text-sm">+</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {['How it works', 'Features', 'Pricing', 'FAQ'].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-sm font-medium text-[#022c22]/60 hover:text-[#022c22] transition-colors"
              >
                {link}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('login')}
              className="px-5 py-2 text-sm font-bold text-[#022c22]/70 hover:text-[#022c22] transition-colors rounded-xl hover:bg-[#f0fdf4]"
            >
              Log in
            </button>
            <button
              onClick={() => onNavigate('signup')}
              className="px-5 py-2.5 text-sm font-bold bg-[#022c22] text-white rounded-xl hover:bg-[#064e40] transition-all active:scale-[0.98] shadow-sm"
            >
              Sign up free
            </button>
          </div>
        </div>
      </nav>

      {/* ─── Hero ───────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background gradient blobs */}
        <div className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#bef264]/20 via-[#dcfce7]/30 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#022c22]/5 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Left — Copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#bef264]/20 border border-[#bef264]/40 text-[10px] font-black uppercase tracking-[0.2em] text-[#064e3b] mb-8">
              <iconify-icon icon="solar:star-bold" width="12" height="12" />
              AI-Powered Productivity
            </div>

            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black tracking-tighter leading-[0.95] mb-8">
              <span className="bg-gradient-to-r from-[#022c22] via-[#065f46] to-[#bef264] bg-clip-text text-transparent">
                Strategic
              </span>
              <br />
              goal tracking
              <br />
              <span className="text-[#022c22]/40">for achievers</span>
            </h1>

            <p className="text-lg text-[#022c22]/60 leading-relaxed max-w-lg mb-10 font-medium">
              Clauseal+ transforms your ambitions into structured strategies with daily routines, milestone tracking, and AI-powered insights — all in one premium dashboard.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <button
                onClick={() => onNavigate('signup')}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-[#bef264] text-[#022c22] rounded-2xl font-black text-sm uppercase tracking-wide hover:brightness-105 transition-all active:scale-[0.98] shadow-[0_4px_20px_-4px_rgba(190,242,100,0.5)]"
              >
                <iconify-icon icon="solar:play-circle-bold" width="20" height="20" className="group-hover:scale-110 transition-transform" />
                Start for free
              </button>
              <button
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#022c22] rounded-2xl font-bold text-sm border border-[#dcfce7] hover:border-[#022c22]/20 transition-all"
              >
                Contact us
              </button>
            </div>

            <div className="flex items-center gap-6 text-[11px] font-bold text-[#022c22]/40 uppercase tracking-widest">
              <span className="flex items-center gap-1.5">
                <iconify-icon icon="solar:check-circle-bold" width="14" height="14" className="text-[#10b981]" />
                Free plan available
              </span>
              <span className="flex items-center gap-1.5">
                <iconify-icon icon="solar:check-circle-bold" width="14" height="14" className="text-[#10b981]" />
                No credit card
              </span>
              <span className="flex items-center gap-1.5">
                <iconify-icon icon="solar:check-circle-bold" width="14" height="14" className="text-[#10b981]" />
                Cancel anytime
              </span>
            </div>
          </div>

          {/* Right — Dashboard Preview Cards */}
          <div className="relative hidden lg:block">
            <div className="relative w-full h-[520px]">
              {/* Main card — Goal */}
              <div className="absolute top-8 left-4 w-72 bg-white rounded-2xl border border-[#dcfce7] shadow-[0_8px_40px_-12px_rgba(2,44,34,0.12)] p-6 transform rotate-[-2deg] hover:rotate-0 transition-all duration-500 z-20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#f0fdf4] border border-[#dcfce7] flex items-center justify-center">
                    <iconify-icon icon="solar:target-linear" width="20" height="20" className="text-[#022c22]" />
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-tighter text-[#022c22]">Q4 Business Growth</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active · 72%</div>
                  </div>
                </div>
                <div className="w-full bg-[#dcfce7] rounded-full h-2 mb-3">
                  <div className="bg-[#022c22] h-2 rounded-full w-[72%] transition-all duration-1000" />
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <span>3 phases</span>
                  <span className="text-[#10b981]">On track</span>
                </div>
              </div>

              {/* Task card */}
              <div className="absolute top-44 right-0 w-64 bg-white rounded-2xl border border-[#dcfce7] shadow-[0_8px_40px_-12px_rgba(2,44,34,0.12)] p-5 transform rotate-[3deg] hover:rotate-0 transition-all duration-500 z-30">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#022c22]/30 mb-3">Today's Tasks</div>
                {['Stand-up Meeting', 'Code Review', 'Client Pitch'].map((task, i) => (
                  <div key={task} className="flex items-center gap-3 py-2">
                    <div className={`w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center ${i === 0 ? 'bg-[#bef264] border-[#bef264]' : 'border-slate-300'}`}>
                      {i === 0 && <iconify-icon icon="solar:check-read-linear" width="10" height="10" />}
                    </div>
                    <span className={`text-xs font-bold ${i === 0 ? 'line-through text-slate-400' : 'text-[#022c22]'}`}>{task}</span>
                  </div>
                ))}
              </div>

              {/* Stats badge */}
              <div className="absolute top-0 right-20 bg-[#022c22] text-white rounded-2xl px-5 py-4 shadow-lg transform rotate-[5deg] hover:rotate-0 transition-all duration-500 z-10">
                <div className="text-[10px] font-black uppercase tracking-widest text-[#bef264]/60 mb-1">Streak</div>
                <div className="text-2xl font-black flex items-center gap-1.5">
                  <iconify-icon icon="solar:fire-bold" width="20" height="20" className="text-[#bef264]" />
                  14 days
                </div>
              </div>

              {/* Contribution mini-grid */}
              <div className="absolute bottom-8 left-8 bg-white rounded-2xl border border-[#dcfce7] shadow-[0_8px_40px_-12px_rgba(2,44,34,0.12)] p-5 transform rotate-[-1deg] hover:rotate-0 transition-all duration-500 z-10">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#022c22]/30 mb-3">Activity</div>
                <div className="flex gap-1">
                  {Array.from({ length: 7 }).map((_, w) => (
                    <div key={w} className="flex flex-col gap-1">
                      {Array.from({ length: 4 }).map((_, d) => {
                        const colors = ['bg-slate-100', 'bg-[#dcfce7]', 'bg-[#bbf7d0]', 'bg-[#86efac]', 'bg-[#bef264]'];
                        return (
                          <div
                            key={d}
                            className={`w-3 h-3 rounded-[2px] ${colors[Math.floor(Math.random() * colors.length)]}`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* AI chat bubble */}
              <div className="absolute bottom-16 right-4 bg-white rounded-2xl border border-[#dcfce7] shadow-[0_8px_40px_-12px_rgba(2,44,34,0.12)] p-4 max-w-[200px] transform rotate-[2deg] hover:rotate-0 transition-all duration-500 z-20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-[#bef264] flex items-center justify-center">
                    <iconify-icon icon="solar:cpu-bolt-bold-duotone" width="12" height="12" className="text-[#022c22]" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#022c22]/40">AI Coach</span>
                </div>
                <p className="text-[11px] font-medium text-[#022c22]/70 leading-relaxed">
                  "You're 14% ahead of schedule. Consider adding a stretch goal for this sprint."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Social Proof ───────────────────────────────────────── */}
      <section className="border-y border-[#dcfce7] bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-2 text-sm font-bold text-[#022c22]/30 whitespace-nowrap">
              <iconify-icon icon="solar:star-bold" width="14" height="14" className="text-[#bef264]" />
              Trusted by teams at
            </div>
            <div className="flex items-center justify-end gap-12 flex-1 overflow-hidden">
              {LOGOS.map((name) => (
                <div key={name} className="flex items-center gap-2 text-[#022c22]/20 hover:text-[#022c22]/40 transition-colors whitespace-nowrap">
                  <iconify-icon icon="solar:buildings-2-linear" width="20" height="20" />
                  <span className="text-sm font-black uppercase tracking-widest">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features Grid ──────────────────────────────────────── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#bef264]/20 border border-[#bef264]/40 text-[10px] font-black uppercase tracking-[0.2em] text-[#064e3b] mb-6">
              Platform Capabilities
            </div>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-[#022c22] mb-4">
              Everything you need to <span className="bg-gradient-to-r from-[#022c22] to-[#bef264] bg-clip-text text-transparent">execute</span>
            </h2>
            <p className="text-lg text-[#022c22]/50 max-w-2xl mx-auto font-medium">
              A complete productivity operating system designed for ambitious individuals and teams.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="group bg-white rounded-2xl border border-[#dcfce7] p-8 hover:border-[#022c22]/20 hover:shadow-[0_8px_40px_-12px_rgba(2,44,34,0.1)] transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#f0fdf4] border border-[#dcfce7] flex items-center justify-center mb-6 group-hover:bg-[#022c22] group-hover:border-[#022c22] transition-all duration-300">
                  <iconify-icon
                    icon={feature.icon}
                    width="24"
                    height="24"
                    className="text-[#022c22] group-hover:text-[#bef264] transition-colors duration-300"
                  />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tighter text-[#022c22] mb-3">{feature.title}</h3>
                <p className="text-sm text-[#022c22]/50 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto bg-[#022c22] rounded-3xl p-12 lg:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#bef264]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#bef264]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-3xl lg:text-4xl font-black tracking-tighter text-white mb-4">
              Ready to transform your productivity?
            </h2>
            <p className="text-[#bef264]/60 mb-10 text-lg font-medium max-w-xl mx-auto">
              Join thousands of achievers who track their goals, build habits, and execute strategies with Clauseal+.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => onNavigate('signup')}
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#bef264] text-[#022c22] rounded-2xl font-black text-sm uppercase tracking-wide hover:brightness-105 transition-all active:scale-[0.98]"
              >
                <iconify-icon icon="solar:play-circle-bold" width="20" height="20" />
                Get started — it's free
              </button>
              <button
                className="inline-flex items-center gap-2 px-8 py-4 text-white/80 rounded-2xl font-bold text-sm border border-white/10 hover:bg-white/5 transition-all"
              >
                View demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t border-[#dcfce7] bg-white py-8 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm">
            <span className="text-[#bef264] text-xs">■</span>
            <span className="ml-1 uppercase tracking-[0.15em] text-[10px] font-black text-[#022c22]/40">Clauseal+</span>
          </div>
          <div className="text-xs text-[#022c22]/30 font-medium">
            © {new Date().getFullYear()} Clauseal+. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
});
