import { memo } from 'react';
import { NAV_ICONS, NAV_LINKS } from '@/constants';
import { useApp } from '@/context';
import { getISTShortDate } from '@/utils/dateUtils';
import type { PageType } from '@/types';

export const Sidebar = memo(function Sidebar() {
  const { activePage, setActivePage, setIsSettingsOpen, strategyPlans } = useApp();

  const handleNavClick = (label: PageType) => {
    setActivePage(label);
  };

  return (
    <aside className="w-[300px] flex-shrink-0 flex flex-col justify-between pt-12 pb-6 px-6 overflow-y-auto bg-[#022c22] text-white">
      <div>
        <div className="flex items-center gap-1 mb-8 px-4 font-bold tracking-tighter text-2xl">
          <span className="text-[#bef264]">■</span>
          <span className="ml-2 uppercase tracking-[0.2em] text-sm font-black">Clauseal</span>
          <span className="text-[#d4ff00] font-light -mt-2 ml-1">+</span>
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

      <div className="space-y-6 px-4 mt-6">
        <div className="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
            alt="User avatar"
            className="w-8 h-8 rounded-full bg-gray-200 object-cover"
            loading="lazy"
          />
          <div>
            <span className="text-[10px] text-gray-400">{getISTShortDate()}</span>
          </div>
        </div>

        <button
          onClick={() => setIsSettingsOpen(true)}
          className="w-full flex items-center gap-3 text-white/40 hover:text-[#bef264] transition-colors pt-6 border-t border-white/5"
        >
          <iconify-icon icon="solar:settings-linear" width="22" height="22" aria-hidden="true" />
          <span className="text-sm font-bold tracking-tight">Settings</span>
        </button>
      </div>
    </aside>
  );
});
