import { Award, Star } from 'lucide-react';
import { GoldButton } from '../../../components/ui/ui';

export const RecognitionCenter = () => {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-gray-50 dark:bg-ink-dark">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Award className="w-6 h-6 mr-3 text-gold-500" />
            Employee Recognition
          </h2>
          <p className="text-gray-500 mt-1">Celebrate milestones, service awards, and peer-to-peer recognition.</p>
        </div>
        <GoldButton><Star className="w-4 h-4 mr-2" /> Give Recognition</GoldButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Placeholder Award 1 */}
        <div className="bg-white dark:bg-ink rounded-xl border border-gold-200 dark:border-gold-900/30 p-6 flex items-start gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gold-100 to-transparent dark:from-gold-900/20 rounded-bl-full -mr-8 -mt-8 opacity-50 pointer-events-none" />
          <div className="w-12 h-12 rounded-full bg-gold-100 dark:bg-gold-900/30 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6 text-gold-600 dark:text-gold-400" />
          </div>
          <div className="relative z-10">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Salesperson of the Quarter</h3>
            <div className="text-sm text-gray-500 mb-2">Awarded to <span className="font-medium text-gray-900 dark:text-white">Aisha Bello</span> by Executive Team</div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">For closing the Banana Island Penthouse portfolio and exceeding quarterly targets by 240%.</p>
            <div className="mt-3 text-xs text-gray-400">June 2026</div>
          </div>
        </div>

        {/* Placeholder Award 2 */}
        <div className="bg-white dark:bg-ink rounded-xl border border-blue-200 dark:border-blue-900/30 p-6 flex items-start gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100 to-transparent dark:from-blue-900/20 rounded-bl-full -mr-8 -mt-8 opacity-50 pointer-events-none" />
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
            <Star className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="relative z-10">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">5 Years of Excellence</h3>
            <div className="text-sm text-gray-500 mb-2">Awarded to <span className="font-medium text-gray-900 dark:text-white">Alexander Sterling</span></div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Recognizing dedicated leadership and 5 years of transformative impact at Luxora.</p>
            <div className="mt-3 text-xs text-gray-400">January 2025</div>
          </div>
        </div>
      </div>
    </div>
  );
};
