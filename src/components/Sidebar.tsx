import { memo } from 'react';
import { NAV_ICONS, NAV_LINKS } from '@/constants';
import { useApp } from '@/context';
import { useAuth } from '@/context/AuthContext';
import { getISTShortDate } from '@/utils/dateUtils';
import type { PageType } from '@/types';

export const Sidebar = memo(function Sidebar() {
  const { activePage, setActivePage, setIsSettingsOpen, strategyPlans } = useApp();
  const { user, signOut } = useAuth();

  const handleNavClick = (label: PageType) => {
    setActivePage(label);
  };

  const handleLogout = async () => {
    await signOut();
  };

  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'User';
  const displayEmail = user?.email || '';

  return (
    <aside className="w-[300px] flex-shrink-0 flex flex-col justify-between pt-12 pb-6 px-6 overflow-y-auto bg-[#022c22] text-white">
      <div>
        <div className="flex items-center gap-2 mb-8 px-4 font-bold tracking-tighter text-2xl">
          <iconify-icon icon="solar:verified-check-bold" width="32" height="32" className="text-[#bef264]" />
          <span className="uppercase tracking-[0.2em] text-sm font-black">CRACK-ME</span>
        </div>

        <nav className="space-y-1" role="navigation" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <button
              key={link}
              onClick={() => handleNavClick(link)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${
                activePage === link
                  ? 'bg-white/10 text-[#bef264] shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
              aria-current={activePage === link ? 'page' : undefined}
            >
              <div className="flex items-center gap-3">
                <iconify-icon
                  icon={NAV_ICONS[link]}
                  width="20"
                  height="20"
                  aria-hidden="true"
                />
                <span className="text-sm font-bold tracking-tight">{link}</span>
              </div>
              {link === 'Strategy Planner' && strategyPlans.length > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#bef264] text-[#064e3b]">
                  {strategyPlans.length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="space-y-4 px-4 mt-6">
        {/* User Info */}
        <div className="flex items-center gap-3 pb-4 border-b border-white/5">
          <div className="w-9 h-9 rounded-full bg-[#bef264]/20 border border-[#bef264]/30 flex items-center justify-center text-[#bef264] text-xs font-black uppercase">
            {displayName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white truncate">{displayName}</div>
            <div className="text-[10px] text-white/30 truncate">{displayEmail}</div>
          </div>
        </div>

        <div className="text-[10px] text-gray-400">{getISTShortDate()}</div>

        <button
          onClick={() => setIsSettingsOpen(true)}
          className="w-full flex items-center gap-3 text-white/40 hover:text-[#bef264] transition-colors py-2 rounded-xl hover:bg-white/5"
        >
          <iconify-icon icon="solar:settings-linear" width="20" height="20" aria-hidden="true" />
          <span className="text-sm font-bold tracking-tight">Settings</span>
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 text-white/40 hover:text-rose-400 transition-colors py-2.5 rounded-xl hover:bg-white/5 border border-white/5 hover:border-rose-400/20"
        >
          <iconify-icon icon="solar:logout-2-linear" width="18" height="18" aria-hidden="true" />
          <span className="text-xs font-bold tracking-tight">Log out</span>
        </button>
      </div>
    </aside>
  );
});
