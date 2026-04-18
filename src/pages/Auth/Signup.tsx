import { memo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface SignupProps {
  onNavigate: (page: 'landing' | 'login') => void;
}

export const Signup = memo(function Signup({ onNavigate }: SignupProps) {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) { setError('Name is required'); return; }
    if (!email.trim()) { setError('Email is required'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }

    setLoading(true);
    const { error: authError, needsConfirmation } = await signUp(email, password, name);
    setLoading(false);

    if (authError) {
      setError(authError.message || 'Failed to create account');
      return;
    }

    if (needsConfirmation) {
      setSuccess(true);
    }
    // If no confirmation needed, AuthContext auto-redirects
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#f0fdf4] flex items-center justify-center px-6 font-sans">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 rounded-3xl bg-[#bef264]/20 border border-[#bef264] flex items-center justify-center mx-auto mb-8">
            <iconify-icon icon="solar:letter-linear" width="36" height="36" className="text-[#022c22]" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-[#022c22] mb-4">Check your email</h1>
          <p className="text-sm text-[#022c22]/50 font-medium leading-relaxed mb-8 max-w-sm mx-auto">
            We've sent a confirmation link to <strong className="text-[#022c22]">{email}</strong>.
            Click the link to activate your account and start tracking your goals.
          </p>
          <button
            onClick={() => onNavigate('login')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#022c22] text-white rounded-xl font-black text-sm uppercase tracking-wide hover:bg-[#064e40] transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

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
            Start your
            <br />
            <span className="text-[#bef264]">journey.</span>
          </h2>
          <p className="text-white/40 text-sm leading-relaxed font-medium max-w-sm">
            Create your account and begin tracking goals, building habits, and executing strategies with AI-powered insights.
          </p>
        </div>

        <div className="relative z-10">
          <div className="space-y-4 pt-8 border-t border-white/10">
            {['Set unlimited goals', 'Daily routine tracking', 'AI productivity coach'].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#bef264]/10 flex items-center justify-center">
                  <iconify-icon icon="solar:check-circle-bold" width="14" height="14" className="text-[#bef264]" />
                </div>
                <span className="text-xs text-white/50 font-bold uppercase tracking-widest">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Signup Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 text-sm font-bold text-[#022c22]/40 hover:text-[#022c22] transition-colors mb-10"
          >
            <iconify-icon icon="solar:alt-arrow-left-linear" width="18" height="18" />
            Back to home
          </button>

          <h1 className="text-3xl font-black tracking-tighter text-[#022c22] mb-2">Create account</h1>
          <p className="text-sm text-[#022c22]/40 font-medium mb-10">
            Free forever plan — no credit card required
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-rose-50 border border-rose-100 text-sm text-rose-600 font-medium">
                <iconify-icon icon="solar:close-circle-linear" width="18" height="18" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#022c22]/40 mb-3">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-white border border-[#dcfce7] rounded-xl px-4 py-3.5 text-sm focus:border-[#022c22]/30 outline-none transition-all placeholder-slate-300 text-[#022c22] font-bold"
                autoFocus
                autoComplete="name"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#022c22]/40 mb-3">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full bg-white border border-[#dcfce7] rounded-xl px-4 py-3.5 text-sm focus:border-[#022c22]/30 outline-none transition-all placeholder-slate-300 text-[#022c22] font-bold"
                autoComplete="email"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#022c22]/40 mb-3">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-[#dcfce7] rounded-xl px-4 py-3.5 text-sm focus:border-[#022c22]/30 outline-none transition-all placeholder-slate-300 text-[#022c22] font-bold"
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#022c22]/40 mb-3">Confirm</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-[#dcfce7] rounded-xl px-4 py-3.5 text-sm focus:border-[#022c22]/30 outline-none transition-all placeholder-slate-300 text-[#022c22] font-bold"
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#022c22] text-white rounded-xl font-black text-sm uppercase tracking-wide hover:bg-[#064e40] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-soft"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <iconify-icon icon="solar:refresh-linear" width="18" height="18" className="animate-spin" />
                  Creating account...
                </span>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-[#022c22]/40 mt-8 font-medium">
            Already have an account?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="text-[#022c22] font-black hover:text-[#064e40] transition-colors underline underline-offset-4 decoration-[#bef264]"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
});
