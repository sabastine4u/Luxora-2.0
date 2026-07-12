import {
  Building2, Home, DoorOpen, BedDouble, DoorClosed, Key,
  GraduationCap, Home as HouseIcon, Trees, Warehouse, Briefcase, ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Reveal, SectionHeading } from '../ui/ui';
import { Section, Container } from '../layout';
import { categories } from '../../data/luxoraData';
import { ROUTES } from '../../constants/routes';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2, Home, DoorOpen, BedDouble, DoorClosed, Key,
  GraduationCap, House: HouseIcon, Trees, Warehouse, Briefcase,
};

export default function PropertyCategories() {
  const navigate = useNavigate();

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
                <button 
                  onClick={() => navigate(ROUTES.PROPERTIES)}
                  className="group relative flex h-52 w-full flex-col justify-end overflow-hidden rounded-2xl border border-white/10 text-left shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/50"
                >
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/40 to-navy-900/10" />
                  
                  <div className="absolute left-0 top-0 h-1 w-0 bg-gold-400 transition-all duration-300 group-hover:w-full" />

                  <div className="relative z-10 p-5">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gold-400/20 text-gold-400 backdrop-blur-md">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="font-heading text-lg font-semibold text-cream">{cat.name}</div>
                    <div className="mt-1 text-xs font-medium text-gold-200">{cat.count}</div>
                  </div>
                </button>
              </Reveal>
            );
          })}

          {/* View all card */}
          <Reveal delay={6 * 60}>
            <button 
              onClick={() => navigate(ROUTES.PROPERTIES)}
              className="group relative flex h-52 w-full flex-col justify-end overflow-hidden rounded-2xl border border-dashed border-gold-400/30 bg-gold-400/5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/50 hover:bg-gold-400/10"
            >
              <div className="relative z-10 p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gold-gradient text-navy-900">
                  <ArrowRight className="h-5 w-5" />
                </div>
                <div className="font-heading text-lg font-semibold text-cream">View All</div>
                <div className="mt-1 text-xs font-medium text-gold-200/70">Browse directory</div>
              </div>
            </button>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
