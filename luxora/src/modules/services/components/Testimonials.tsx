import { useState, useEffect } from 'react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Container, Section } from '../../../components/layout';
import type { ServiceData } from '../types';

export function Testimonials({ data }: { data: ServiceData }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!data.testimonials || data.testimonials.length === 0) return;
    const t = setInterval(() => {
      setActive((p) => (p + 1) % data.testimonials.length);
    }, 6000);
    return () => clearInterval(t);
  }, [data.testimonials]);


  if (!data.testimonials || data.testimonials.length === 0) return null;

  const next = () => setActive((p) => (p + 1) % data.testimonials.length);

  const prev = () => setActive((p) => (p - 1 + data.testimonials.length) % data.testimonials.length);

  return (
    <Section className="overflow-hidden bg-navy-900 border-t border-white/5">
      <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/5 blur-[120px]" />
      
      <Container className="relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-cream mb-4">
            Trusted by Leaders
          </h2>
          <p className="text-lg text-ink/70">
            Hear from those who have experienced the {data.name} difference.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="relative rounded-3xl border border-white/10 bg-navy-800/50 p-8 md:p-12">
            <Quote className="absolute right-8 top-8 h-12 w-12 text-gold-400/15" />

            <div className="relative min-h-[160px] flex flex-col justify-center">
              <p className="font-heading text-xl font-medium leading-relaxed text-cream md:text-2xl mb-8">
                "{data.testimonials[active].quote}"
              </p>

              <div className="flex items-center gap-4 mt-auto">
                {data.testimonials[active].avatarUrl && (
                  <img
                    src={data.testimonials[active].avatarUrl}
                    alt={data.testimonials[active].author}
                    loading="lazy"
                    className="h-14 w-14 rounded-full object-cover ring-2 ring-gold-400/30"
                  />
                )}
                <div>
                  <div className="font-heading text-base font-semibold text-cream">
                    {data.testimonials[active].author}
                  </div>
                  <div className="text-sm text-ink/50">
                    {data.testimonials[active].role}
                    {data.testimonials[active].company && ` at ${data.testimonials[active].company}`}
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            {data.testimonials.length > 1 && (
              <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
                <div className="flex gap-2">
                  {data.testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      className={`h-2 rounded-full transition-all ${
                        i === active ? 'w-8 bg-gold-400' : 'w-2 bg-white/20 hover:bg-white/40'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={prev}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-ink/70 transition-all hover:border-gold-400/30 hover:text-cream"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={next}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-ink/70 transition-all hover:border-gold-400/30 hover:text-cream"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
