import { memo, useState, useMemo } from 'react';
import { INITIAL_HELP_ITEMS } from '@/constants/initialData';
import { useApp } from '@/context';

const HELP_CATEGORIES = [
  { icon: 'solar:book-2-linear', title: 'Start Operation', desc: 'System fundamentals', tag: 'start' },
  { icon: 'solar:settings-linear', title: 'System Settings', desc: 'Tactical configuration', tag: 'settings' },
  { icon: 'solar:shield-check-linear', title: 'Security Protocol', desc: 'Data encryption protocols', tag: 'privacy' },
];

export const HelpCenter = memo(function HelpCenter() {
  const { openFaq, setOpenFaq } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    let items = INITIAL_HELP_ITEMS;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        item => item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
      );
    }
    return items;
  }, [searchQuery]);

  return (
    <>
      <div className="px-12 py-10 border-b border-[#dcfce7] bg-white shadow-sm">
        <h1 className="text-4xl tracking-tighter font-black uppercase text-[#022c22]">Help Center</h1>
        <p className="text-sm text-slate-500 mt-1">System documentation and tactical support</p>
      </div>

      <div className="px-12 pt-8 pb-4">
        <div className="relative max-w-lg">
          <iconify-icon
            icon="solar:magnifer-linear"
            width="18"
            height="18"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search operational documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f0fdf4] border border-[#dcfce7] rounded-xl pl-11 pr-4 py-3.5 text-sm outline-none focus:border-[#022c22]/30 placeholder-slate-300 text-[#022c22] font-bold transition-all"
            aria-label="Search help articles"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#022c22]"
            >
              <iconify-icon icon="mingcute:close-line" width="18" height="18" />
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="text-[10px] font-black uppercase tracking-widest text-[#022c22]/40 mt-3 ml-1">{filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''} established</p>
        )}
      </div>

      <div className="px-12 py-6 grid grid-cols-3 gap-6">
        {HELP_CATEGORIES.map((item, i) => (
          <button
            key={i}
            onClick={() => setActiveCategory(activeCategory === item.tag ? null : item.tag)}
            className={`rounded-premium p-6 cursor-pointer transition-all text-left border shadow-soft ${
              activeCategory === item.tag
                ? 'bg-[#f0fdf4] border-[#022c22] shadow-[0_0_15px_rgba(2,44,34,0.1)]'
                : 'bg-white border-[#dcfce7] hover:border-[#022c22]/30 hover:shadow-[0_0_15px_rgba(2,44,34,0.05)]'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${activeCategory === item.tag ? 'bg-[#022c22] text-[#bef264]' : 'bg-[#f0fdf4] text-[#022c22]'}`}>
              <iconify-icon icon={item.icon} width="24" height="24" />
            </div>
            <div className="text-sm font-black uppercase tracking-tighter text-[#022c22]">{item.title}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1.5">{item.desc}</div>
          </button>
        ))}
      </div>

      <div className="px-12 py-8 pb-20">
        <h2 className="text-2xl tracking-tighter font-black uppercase mb-8 text-[#022c22] flex items-center gap-2">
            <span className="text-[#bef264] text-lg">■</span>
            Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => {
              const originalIndex = INITIAL_HELP_ITEMS.indexOf(item);
              const isOpen = openFaq === originalIndex;
              return (
                <div key={originalIndex} className={`border rounded-premium overflow-hidden transition-all duration-300 ${isOpen ? 'border-[#022c22] shadow-soft' : 'border-[#dcfce7] hover:border-[#022c22]/30'}`}>
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : originalIndex)}
                    className={`w-full flex justify-between items-center px-6 py-5 text-left transition-colors ${isOpen ? 'bg-[#f0fdf4]' : 'bg-white hover:bg-[#f0fdf4]'}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${originalIndex}`}
                  >
                    <span className="text-sm font-black uppercase tracking-tighter text-[#022c22]">{item.q}</span>
                    <iconify-icon
                      icon={isOpen ? 'solar:alt-arrow-up-linear' : 'solar:alt-arrow-down-linear'}
                      width="20"
                      height="20"
                      className={`flex-shrink-0 ml-4 transition-colors ${isOpen ? 'text-[#022c22]' : 'text-slate-400'}`}
                    />
                  </button>
                  {isOpen && (
                    <div id={`faq-answer-${originalIndex}`} className="px-6 pb-6 text-sm text-[#022c22]/70 font-medium leading-relaxed bg-[#f0fdf4] pt-2">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center font-bold text-slate-400 border border-dashed border-[#dcfce7] rounded-premium">
              No protocol documentation found for &quot;{searchQuery}&quot;
            </div>
          )}
        </div>
      </div>
    </>
  );
});
