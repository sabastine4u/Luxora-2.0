import { FileCheck, Search, Download, Upload } from 'lucide-react';
import { GoldButton } from '../../../components/ui/ui';

export default function Documents() {
  const docs = [
    { id: 'DOC-901', name: 'Lease Agreement - T.Ayo Balogun.pdf', type: 'Contract', property: 'Victoria Island Villa', uploaded: 'Jan 02, 2025' },
    { id: 'DOC-902', name: 'Move-in Inspection Form.pdf', type: 'Inspection Form', property: 'Lekki Studio Apt', uploaded: 'Dec 05, 2024' },
    { id: 'DOC-903', name: 'HOA Regulations 2025.pdf', type: 'Compliance', property: 'Abuja Central Office', uploaded: 'Feb 10, 2025' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Document Repository</h2>
          <p className="text-sm text-ink/60">Secure storage for leases, compliance files, and property records.</p>
        </div>
        <GoldButton className="flex items-center gap-2"><Upload className="h-4 w-4" /> Upload File</GoldButton>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input 
            type="text" 
            placeholder="Search documents..." 
            className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-2 pl-9 pr-4 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-navy-800/50">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-900/50 text-xs uppercase text-ink/50 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-semibold">Document Name</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold">Associated Property</th>
              <th className="px-6 py-4 font-semibold">Upload Date</th>
              <th className="px-6 py-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {docs.map((doc) => (
              <tr key={doc.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-semibold text-cream flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-ink/40" /> {doc.name}
                </td>
                <td className="px-6 py-4 text-ink/60">
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold text-cream">
                    {doc.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-ink/60">{doc.property}</td>
                <td className="px-6 py-4 text-ink/60">{doc.uploaded}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-gold-400 hover:text-gold-300 transition-colors">
                    <Download className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
