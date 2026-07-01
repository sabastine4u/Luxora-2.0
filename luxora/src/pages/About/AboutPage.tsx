import { PageLayout, Container, Section, PageHeader, Breadcrumb } from '../../components/layout';
import { ShieldCheck, Compass, Sparkles } from 'lucide-react';
import { Reveal } from '../../components/ui/ui';

export default function AboutPage() {
  return (
    <PageLayout>
      <Container className="pt-24 md:pt-32">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'About Us' }]} />
        <PageHeader 
          title="Redefining Luxury in Africa"
          description="Luxora is the premier destination for verified high-end real estate, connecting discerning buyers with the continent's most exclusive properties."
        />
      </Container>

      <Section>
        <Container>
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <Reveal>
              <div className="aspect-[4/5] overflow-hidden rounded-3xl border border-white/10">
                <img 
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200" 
                  alt="Modern Luxury Home"
                  className="h-full w-full object-cover"
                />
              </div>
            </Reveal>
            <div className="space-y-6 text-ink/70">
              <h2 className="font-heading text-3xl font-bold text-cream">Our Story</h2>
              <p>
                Founded in 2026, Luxora was born from a simple realization: the African luxury real estate market lacked a centralized, trustworthy, and premium digital experience. Finding high-end homes was a fragmented process fraught with unverified listings and opaque pricing.
              </p>
              <p>
                We set out to change that by building a platform that marries Apple-level design standards with rigorous property verification protocols. Today, Luxora is the most trusted name in African luxury real estate.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-navy-900 border-y border-white/5">
        <Container>
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl font-bold text-cream">The Luxora Standard</h2>
            <p className="mt-4 text-ink/60 max-w-2xl mx-auto">What sets us apart in a crowded marketplace.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { icon: ShieldCheck, title: "100% Verified", text: "Every property undergoes a rigorous multi-point physical and legal verification before being listed." },
              { icon: Compass, title: "Curated Selection", text: "We don't list everything. We only list the best. Quality over quantity is our guiding principle." },
              { icon: Sparkles, title: "Premium Experience", text: "From our digital platform to our white-glove viewing service, we provide luxury at every touchpoint." },
            ].map((feature, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-8 text-center backdrop-blur-md h-full">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-400/10 text-gold-400 mb-6">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-cream mb-4">{feature.title}</h3>
                  <p className="text-ink/60">{feature.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>
    </PageLayout>
  );
}
