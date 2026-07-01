import {
  Building2, Home, DoorOpen, BedDouble, DoorClosed, Key,
  GraduationCap, Home as HouseIcon, Trees, Warehouse, Briefcase, ArrowRight,
} from 'lucide-react';
import { Reveal, SectionHeading } from '../ui/ui';
import { Section, Container } from '../layout';
import { categories } from '../../data/luxoraData';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2, Home, DoorOpen, BedDouble, DoorClosed, Key,
  GraduationCap, House: HouseIcon, Trees, Warehouse, Briefcase,
};

export default function PropertyCategories() {
  return (
    <Section id="rent">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Property Categories"
            title={<>Browse by <span className="gold-text">property type</span></>}
            subtitle="From luxury penthouses to student housing — find exactly what you're looking for."
          />
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat, i) => {
            const Icon = iconMap[cat.icon] ?? Building2;
            return (
              <Reveal key={cat.name} delay={(i % 6) * 60}>
                <button className="group flex h-full w-full flex-col items-center gap-3 rounded-2xl border border-white/10 bg-navy-800/50 p-5 text-center transition-all duration-300 hover:border-gold-400/30 hover:bg-navy-800/80 hover:-translate-y-1">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gold-400/20 bg-gold-400/5 text-gold-400 transition-all duration-300 group-hover:scale-110 group-hover:bg-gold-400/10">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-heading text-sm font-semibold text-cream">{cat.name}</div>
                    <div className="mt-0.5 text-[11px] text-ink/50">{cat.count}</div>
                  </div>
                </button>
              </Reveal>
            );
          })}

          {/* View all card */}
          <Reveal delay={6 * 60}>
            <button className="group flex h-full w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gold-400/30 bg-gold-400/5 p-5 text-center transition-all duration-300 hover:bg-gold-400/10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-gradient text-navy-900">
                <ArrowRight className="h-6 w-6" />
              </div>
              <div className="font-heading text-sm font-semibold text-cream">View All</div>
            </button>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
