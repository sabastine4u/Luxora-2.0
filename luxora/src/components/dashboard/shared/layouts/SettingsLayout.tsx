import type { ReactNode } from 'react';
import { Loader2, Check, CheckCircle2 } from 'lucide-react';
import { GoldButton } from '../../../../components/ui/ui';

interface SettingsLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  sidebar?: ReactNode;
  
  // Header save action (used in Owner/Admin)
  headerAction?: ReactNode;
  
  // Sticky footer save action (used in Agency/Agent)
  onSave?: () => void;
  isSaving?: boolean;
  isSaved?: boolean;
  
  // Toast notification (used in Owner)
  saveSuccess?: boolean;
  successMessage?: string;
}

export function SettingsLayout({
  title,
  subtitle,
  children,
  sidebar,
  headerAction,
  onSave,
  isSaving = false,
  isSaved = false,
  saveSuccess = false,
  successMessage = 'Settings saved successfully!'
}: SettingsLayoutProps) {
  return (
    <div className={`space-y-8 max-w-5xl relative ${onSave ? 'pb-24' : 'pb-12'}`}>
      {/* Toast Notification */}
      {saveSuccess && (
        <div className="fixed top-24 right-8 z-50 flex items-center gap-2 bg-emerald-500/90 text-white px-4 py-3 rounded-lg shadow-xl animate-fade-in-down">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-semibold text-sm">{successMessage}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">{title}</h2>
          <p className="text-sm text-ink/60">{subtitle}</p>
        </div>
        {headerAction && (
          <div>{headerAction}</div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {sidebar && (
          <div className="w-full lg:w-64 shrink-0">
            {sidebar}
          </div>
        )}
        <div className="flex-1 space-y-6 lg:space-y-8 min-w-0">
          {children}
        </div>
      </div>

      {/* SAVE ACTIONS (Fixed Bottom Bar) */}
      {onSave && (
        <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-navy-900/90 backdrop-blur-md border-t border-white/10 p-4 flex justify-end z-40">
           <div className="max-w-5xl w-full mx-auto flex justify-end">
              <GoldButton onClick={onSave} disabled={isSaving || isSaved} className="min-w-[140px]">
                 {isSaving ? (
                   <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</>
                 ) : isSaved ? (
                   <><Check className="h-4 w-4 mr-2" /> Saved</>
                 ) : (
                   'Save Settings'
                 )}
              </GoldButton>
           </div>
        </div>
      )}
    </div>
  );
}
