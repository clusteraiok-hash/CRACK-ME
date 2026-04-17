import { memo } from 'react';
import { Modal, Button } from '@/components';
import { useApp } from '@/context';

const LANGUAGES = ['English', 'Spanish', 'French', 'German'];

export const SettingsModal = memo(function SettingsModal() {
  const { isSettingsOpen, setIsSettingsOpen, settingsForm, setSettingsForm, addToast } = useApp();

  const updateSettings = (field: string, value: string | boolean) => {
    setSettingsForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsSettingsOpen(false);
    addToast('success', 'Settings saved successfully!');
  };

  return (
    <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="Account Settings" width="480px">
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-[#022c22]/40 mb-2">Display Name</label>
          <input
            type="text"
            value={settingsForm.name}
            onChange={(e) => updateSettings('name', e.target.value)}
            className="w-full bg-[#f0fdf4] border border-[#dcfce7] rounded-xl px-4 py-3 text-sm focus:border-[#022c22]/30 outline-none transition-all text-[#022c22] font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-[#022c22]/40 mb-2">Email Address</label>
          <input
            type="email"
            value={settingsForm.email}
            onChange={(e) => updateSettings('email', e.target.value)}
            className="w-full bg-[#f0fdf4] border border-[#dcfce7] rounded-xl px-4 py-3 text-sm focus:border-[#022c22]/30 outline-none transition-all text-[#022c22] font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-[#022c22]/40 mb-2">Interface Language</label>
          <select
            value={settingsForm.language}
            onChange={(e) => updateSettings('language', e.target.value)}
            className="w-full bg-[#f0fdf4] border border-[#dcfce7] rounded-xl px-4 py-3 text-sm focus:border-[#022c22]/30 outline-none transition-all text-[#022c22] font-medium appearance-none"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#dcfce7]">
          <div>
            <div className="text-sm font-black uppercase tracking-tighter text-[#022c22]">Push Notifications</div>
            <div className="text-xs text-slate-500">Alerts for upcoming goals and tasks</div>
          </div>
          <button
            onClick={() => updateSettings('notifications', !settingsForm.notifications)}
            className={`w-12 h-6 rounded-full transition-all relative ${
              settingsForm.notifications ? 'bg-[#bef264]' : 'bg-[#dcfce7]'
            }`}
            aria-label="Toggle notifications"
          >
            <div
              className={`w-4 h-4 bg-white rounded-full shadow-sm absolute top-1 transition-transform ${
                settingsForm.notifications ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-[#dcfce7] flex gap-3">
        <Button onClick={handleSave} className="flex-1">
          Save Changes
        </Button>
        <Button onClick={() => setIsSettingsOpen(false)} variant="secondary" className="flex-1">
          Cancel
        </Button>
      </div>
    </Modal>
  );
});
