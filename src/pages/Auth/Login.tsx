import { memo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface LoginProps {
  onNavigate: (page: 'landing' | 'signup') => void;
}

export const Login = memo(function Login({ onNavigate }: LoginProps) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) { setError('Email is required'); return; }
    if (!password) { setError('Password is required'); return; }

    setLoading(true);
    const { error: authError } = await signIn(email, password);
    setLoading(false);

    if (authError) {
      setError(authError.message || 'Invalid email or password');
    }
    // On success, AuthContext updates and App.tsx re-routes automatically
  };

  return (
    <div className="min-h-screen bg-[#f0fdf4] flex font-sans">
      {/* Left — Branding Panel */}
      <div className="hidden lg:flex lg:w-[480px] bg-[#022c22] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#bef264]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#bef264]/5 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-1 mb-16">
            <span className="text-[#bef264] text-sm">■</span>
            <span className="ml-1 uppercase tracking-[0.15em] text-xs font-black text-white">Clauseal</span>
            <span className="text-[#bef264] font-light -mt-1.5 ml-0.5 text-sm">+</span>
          </div>

          <h2 className="text-4xl font-black tracking-tighter text-white leading-tight mb-6">
            Welcome back,
            <br />
            <span className="text-[#bef264]">achiever.</span>
          </h2>
          <p className="text-white/40 text-sm leading-relaxed font-medium max-w-sm">
            Log in to access your goals, daily routines, and strategic plans. Your productivity journey continues here.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 pt-8 border-t border-white/10">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-[#bef264]/20 border-2 border-[#022c22] flex items-center justify-center text-[10px] text-[#bef264] font-bold">
                {String.fromCharCode(64 + i)}
              </div>
            ))}
          </div>
          <span className="text-xs text-white/30 font-bold">2,400+ users achieving goals</span>
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 text-sm font-bold text-[#022c22]/40 hover:text-[#022c22] transition-colors mb-10"
          >
            <iconify-icon icon="solar:alt-arrow-left-linear" width="18" height="18" />
            Back to home
          </button>

          <h1 className="text-3xl font-black tracking-tighter text-[#022c22] mb-2">Sign in</h1>
          <p className="text-sm text-[#022c22]/40 font-medium mb-10">
            Enter your credentials to access your dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-rose-50 border border-rose-100 text-sm text-rose-600 font-medium">
                <iconify-icon icon="solar:close-circle-linear" width="18" height="18" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#022c22]/40 mb-3">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full bg-white border border-[#dcfce7] rounded-xl px-4 py-3.5 text-sm focus:border-[#022c22]/30 outline-none transition-all placeholder-slate-300 text-[#022c22] font-bold"
                autoFocus
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#022c22]/40 mb-3">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-[#dcfce7] rounded-xl px-4 py-3.5 text-sm focus:border-[#022c22]/30 outline-none transition-all placeholder-slate-300 text-[#022c22] font-bold"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#022c22] text-white rounded-xl font-black text-sm uppercase tracking-wide hover:bg-[#064e40] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-soft"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <iconify-icon icon="solar:refresh-linear" width="18" height="18" className="animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-[#022c22]/40 mt-8 font-medium">
            Don't have an account?{' '}
            <button
              onClick={() => onNavigate('signup')}
              className="text-[#022c22] font-black hover:text-[#064e40] transition-colors underline underline-offset-4 decoration-[#bef264]"
            >
              Sign up for free
            </button>
          </p>
        </div>
      </div>
    </div>
  );
});
