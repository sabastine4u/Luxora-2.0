import { UserCircle, MapPin, Globe, Calendar, FileText } from 'lucide-react';

interface ProfileTabProps {
  vendorId: string;
}

export function ProfileTab({ vendorId }: ProfileTabProps) {
  // Use vendorId to prevent TS6133 unused variable error if it's reserved for future integration
  void vendorId;
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2 space-y-6">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <h3 className="font-heading text-lg font-semibold text-cream mb-4 flex items-center gap-2">
            <UserCircle className="h-5 w-5 text-gold-400" /> Company Information
          </h3>
          <div className="grid grid-cols-2 gap-y-4 text-sm">
            <div>
              <span className="text-ink/60 block mb-1">Legal Name</span>
              <span className="text-cream font-medium">Global Tech Supplies Nigeria Ltd.</span>
            </div>
            <div>
              <span className="text-ink/60 block mb-1">Registration Number</span>
              <span className="text-cream font-medium">RC-1425667</span>
            </div>
            <div>
              <span className="text-ink/60 block mb-1 flex items-center gap-1"><MapPin className="h-3 w-3" /> Address</span>
              <span className="text-cream font-medium">14 Victoria Island, Lagos</span>
            </div>
            <div>
              <span className="text-ink/60 block mb-1 flex items-center gap-1"><Globe className="h-3 w-3" /> Website</span>
              <a href="#" className="text-gold-400 font-medium hover:underline">www.globaltech.com.ng</a>
            </div>
          </div>
        </div>
        
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <h3 className="font-heading text-lg font-semibold text-cream mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-400" /> Recent Transactions
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm p-3 rounded-xl bg-navy-900/50">
              <span className="text-cream font-medium">PO-9921: Dell XPS Laptops (x5)</span>
              <span className="text-gold-400 font-bold">₦8,500,000</span>
            </div>
            <div className="flex items-center justify-between text-sm p-3 rounded-xl bg-navy-900/50">
              <span className="text-cream font-medium">PO-8812: Cisco Routers</span>
              <span className="text-gold-400 font-bold">₦1,200,000</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <h3 className="font-heading text-lg font-semibold text-cream mb-4">Performance</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-ink/60">Quality Rating</span>
                <span className="text-emerald-400 font-bold">4.8 / 5.0</span>
              </div>
              <div className="h-2 bg-navy-900 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 w-[96%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-ink/60">On-Time Delivery</span>
                <span className="text-emerald-400 font-bold">98%</span>
              </div>
              <div className="h-2 bg-navy-900 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 w-[98%]"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 text-sm">
          <h3 className="font-heading text-lg font-semibold text-cream mb-4">Key Dates</h3>
          <div className="flex items-center justify-between mb-3">
             <span className="text-ink/60 flex items-center gap-1"><Calendar className="h-4 w-4" /> Onboarded</span>
             <span className="text-cream font-medium">Jan 12, 2024</span>
          </div>
          <div className="flex items-center justify-between">
             <span className="text-ink/60 flex items-center gap-1"><Calendar className="h-4 w-4" /> Contract Expiry</span>
             <span className="text-cream font-medium">Jan 12, 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
