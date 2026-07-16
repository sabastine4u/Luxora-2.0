import { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Reveal, SectionHeading } from '../ui/ui';
import { Section, Container } from '../layout';
import { testimonials } from '../../data/luxoraData';

export default function Testimonials() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setActive((p) => (p + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  const next = () => setActive((p) => (p + 1) % testimonials.length);
  const prev = () => setActive((p) => (p - 1 + testimonials.length) % testimonials.length);

  return (
    <Section className="overflow-hidden">
      <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/5 blur-[120px]" />
      
      <Container className="relative">
        <Reveal>
          <SectionHeading
            eyebrow="Testimonials"
            title={<>Trusted by <span className="gold-text">thousands</span></>}
            subtitle="From first-time buyers to seasoned investors — hear what our community says."
          />
        </Reveal>

        <Reveal delay={50}>
          <div className="mx-auto mt-10 max-w-3xl">
            <div className="relative rounded-3xl border border-white/10 bg-navy-800/50 p-8 md:p-12">
              <Quote className="absolute right-8 top-8 h-12 w-12 text-gold-400/15" />

              <div className="relative">
                {/* Stars */}
                <div className="mb-6 flex gap-1">
                  {Array.from({ length: testimonials[active].rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-gold-400 text-gold-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="font-heading text-xl font-medium leading-relaxed text-cream md:text-2xl">
                  "{testimonials[active].quote}"
                </p>

                {/* Author */}
                <div className="mt-8 flex items-center gap-4">
                  <img
                    src={testimonials[active].avatar}
                    alt={testimonials[active].name}
                    loading="lazy"
                    className="h-14 w-14 rounded-full object-cover ring-2 ring-gold-400/30"
                  />
                  <div>
                    <div className="font-heading text-base font-semibold text-cream">{testimonials[active].name}</div>
                    <div className="text-sm text-ink/50">{testimonials[active].role}</div>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
                <div className="flex gap-2">
                  {testimonials.map((_, i) => (
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
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
