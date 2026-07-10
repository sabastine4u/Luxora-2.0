import { useState } from 'react';
import { Settings, Bell, Mail, Smartphone, MessageSquare } from 'lucide-react';
import { GoldButton } from '../../../components/ui/ui';

export const NotificationPreferences = () => {
  const [preferences, setPreferences] = useState({
    deals: { inApp: true, email: true, push: true, sms: false },
    properties: { inApp: true, email: false, push: true, sms: false },
    finance: { inApp: true, email: true, push: true, sms: true },
    compliance: { inApp: true, email: true, push: true, sms: true },
    system: { inApp: true, email: false, push: false, sms: false },
    marketing: { inApp: true, email: false, push: false, sms: false }
  });

  const togglePref = (category: keyof typeof preferences, channel: keyof typeof preferences['deals']) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [channel]: !prev[category][channel]
      }
    }));
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-ink-dark/30">
      <div className="h-16 border-b border-gray-100 dark:border-ink-light bg-white dark:bg-ink flex items-center justify-between px-6 shrink-0">
        <div>
          <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white">Notification Preferences</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full">
        
        <div className="bg-white dark:bg-ink rounded-2xl border border-gray-200 dark:border-ink-light overflow-hidden shadow-sm">
          
          <div className="grid grid-cols-5 p-4 border-b border-gray-200 dark:border-ink-light bg-gray-50/50 dark:bg-ink-light/10 text-sm font-semibold text-gray-500 uppercase tracking-wider">
             <div className="col-span-1">Category</div>
             <div className="flex items-center justify-center"><Bell className="w-4 h-4 mr-2" /> In-App</div>
             <div className="flex items-center justify-center"><Mail className="w-4 h-4 mr-2" /> Email</div>
             <div className="flex items-center justify-center"><Smartphone className="w-4 h-4 mr-2" /> Push (App)</div>
             <div className="flex items-center justify-center"><MessageSquare className="w-4 h-4 mr-2" /> SMS</div>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-ink-light">
            {(Object.keys(preferences) as Array<keyof typeof preferences>).map((category) => (
              <div key={category} className="grid grid-cols-5 p-4 items-center hover:bg-gray-50 dark:hover:bg-ink-light/20 transition-colors">
                <div className="col-span-1 font-medium text-gray-900 dark:text-white capitalize">
                  {category}
                </div>
                {(['inApp', 'email', 'push', 'sms'] as const).map(channel => (
                  <div key={channel} className="flex justify-center">
                    <button 
                      onClick={() => togglePref(category, channel)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${preferences[category][channel] ? 'bg-gold-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                    >
                      <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${preferences[category][channel] ? 'translate-x-5' : 'translate-x-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>

        </div>
        
        <div className="mt-8 flex justify-end">
           <GoldButton>
             <Settings className="w-4 h-4 mr-2" />
             Save Preferences
           </GoldButton>
        </div>

      </div>
    </div>
  );
};
