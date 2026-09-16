import { Brain } from 'lucide-react';

export default function AIInsights() {

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream flex items-center gap-2">
             <Brain className="h-6 w-6 text-gold-400" /> AI Market Insights
          </h2>
          <p className="text-sm text-ink/60">AI-generated market observations are not currently supported by an approved Luxora data source.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-10 text-center text-ink/60">No AI insights are displayed. Use the deterministic Market Trends, Risk Analysis, Investment Scoring, and Market Alerts tabs for supported platform data.</div>
    </div>
  );
}
