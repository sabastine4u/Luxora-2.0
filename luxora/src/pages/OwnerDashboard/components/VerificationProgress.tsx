import { ShieldCheck, FileCheck, MapPin, CheckCircle2, Clock } from 'lucide-react';
import { properties } from '../../../data/luxoraData';

export default function VerificationProgress() {
  const property = properties[0];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-cream">Verification Progress</h2>
        <p className="text-sm text-ink/60">Track the verification status of your submitted properties.</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
        <div className="mb-6 flex flex-col sm:flex-row gap-6">
          <img src={property.image} alt={property.title} className="h-24 w-32 rounded-xl object-cover" />
          <div>
            <h3 className="font-heading text-lg font-semibold text-cream">{property.title}</h3>
            <p className="text-sm text-ink/60">{property.location}</p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-yellow-400/10 border border-yellow-400/20 px-3 py-1.5 text-xs font-semibold text-yellow-400">
              <Clock className="h-4 w-4" /> In Progress (Step 2 of 4)
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-white/10" />
          <div className="space-y-8 relative">
            
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 border-navy-800 bg-emerald-400 text-navy-900">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="flex-1 pt-2">
                <h4 className="font-semibold text-cream text-lg">Initial Submission</h4>
                <p className="text-sm text-ink/60 mt-1">Property details and basic media uploaded.</p>
                <div className="mt-2 text-xs text-ink/40">Completed: Oct 12, 2025</div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 border-navy-800 bg-gold-400 text-navy-900">
                <FileCheck className="h-5 w-5" />
              </div>
              <div className="flex-1 pt-2">
                <h4 className="font-semibold text-cream text-lg">Document Verification</h4>
                <p className="text-sm text-ink/60 mt-1">Our legal team is reviewing the title deed and ownership documents.</p>
                <div className="mt-3 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-cream">Title Deed</span>
                    <span className="text-xs font-semibold text-emerald-400">Approved</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-cream">C of O</span>
                    <span className="text-xs font-semibold text-yellow-400">Under Review</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 border-navy-800 bg-white/10 text-ink/40">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="flex-1 pt-2">
                <h4 className="font-semibold text-ink/50 text-lg">Physical Inspection</h4>
                <p className="text-sm text-ink/60 mt-1">A Luxora agent will visit the property to verify its condition.</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4">
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 border-navy-800 bg-white/10 text-ink/40">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="flex-1 pt-2">
                <h4 className="font-semibold text-ink/50 text-lg">Final Certification</h4>
                <p className="text-sm text-ink/60 mt-1">Property receives the Luxora Verified badge and goes live.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
