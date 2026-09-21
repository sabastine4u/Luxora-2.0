import { useState, useEffect } from 'react';
import {
  Quote,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  Container,
  Section,
} from '../../../components/layout';
import type { ServiceData } from '../types';
import { ServiceImage } from './ServiceImage';

export function Testimonials({
  data,
}: {
  data: ServiceData;
}) {
  const [active, setActive] =
    useState(0);

  useEffect(() => {
    if (
      !data.testimonials ||
      data.testimonials.length === 0
    ) {
      return;
    }

    const t = setInterval(() => {
      setActive(
        (p) =>
          (p + 1) %
          data.testimonials.length,
      );
    }, 6000);

    return () => clearInterval(t);
  }, [data.testimonials]);

  if (
    !data.testimonials ||
    data.testimonials.length === 0
  ) {
    return null;
  }

  const next = () =>
    setActive(
      (p) =>
        (p + 1) %
        data.testimonials.length,
    );

  const prev = () =>
    setActive(
      (p) =>
        (p - 1 +
          data.testimonials.length) %
        data.testimonials.length,
    );

  const activeTestimonial =
    data.testimonials[active];

  return (
    <Section className="overflow-hidden border-t border-white/5 bg-navy-900">
      <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/5 blur-[120px]" />

      <Container className="relative">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-heading text-3xl font-bold text-cream md:text-4xl">
            Trusted by Leaders
          </h2>

          <p className="text-lg text-ink/70">
            Hear from those who have experienced the{' '}
            {data.name} difference.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="relative rounded-3xl border border-white/10 bg-navy-800/50 p-8 md:p-12">
            <Quote className="absolute right-8 top-8 h-12 w-12 text-gold-400/15" />

            <div className="relative flex min-h-[160px] flex-col justify-center">
              <p className="mb-8 font-heading text-xl font-medium leading-relaxed text-cream md:text-2xl">
                "{activeTestimonial.quote}"
              </p>

              <div className="mt-auto flex items-center gap-4">
                {activeTestimonial.avatarUrl && (
                  <ServiceImage
                    src={
                      activeTestimonial.avatarUrl
                    }
                    alt={
                      activeTestimonial.author
                    }
                    loading="lazy"
                    wrapperClassName="h-14 w-14 shrink-0 rounded-full ring-2 ring-gold-400/30"
                    className="h-full w-full rounded-full object-cover"
                  />
                )}

                <div>
                  <div className="font-heading text-base font-semibold text-cream">
                    {activeTestimonial.author}
                  </div>

                  <div className="text-sm text-ink/50">
                    {activeTestimonial.role}
                    {activeTestimonial.company &&
                      ` at ${activeTestimonial.company}`}
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            {data.testimonials.length >
              1 && (
              <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
                <div className="flex gap-2">
                  {data.testimonials.map(
                    (_, i) => (
                      <button
                        key={i}
                        onClick={() =>
                          setActive(i)
                        }
                        className={`h-2 rounded-full transition-all ${
                          i === active
                            ? 'w-8 bg-gold-400'
                            : 'w-2 bg-white/20 hover:bg-white/40'
                        }`}
                      />
                    ),
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={prev}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-ink/70 transition-all hover:border-gold-400/30 hover:text-cream"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <button
                    onClick={next}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-ink/70 transition-all hover:border-gold-400/30 hover:text-cream"
                    aria-label="Next testimonial"
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