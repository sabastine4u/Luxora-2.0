import { PageLayout, Container, Section, PageHeader, Breadcrumb } from '../../components/layout';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { GoldButton } from '../../components/ui/ui';

export default function ContactPage() {
  return (
    <PageLayout>
      <Container className="pt-24 md:pt-32">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Contact Us' }]} />
        <PageHeader 
          title="Get in Touch"
          description="Have a question or looking to list your premium property? Our dedicated team is here to help."
        />
      </Container>

      <Section noPadding className="pb-24 md:pb-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            
            {/* Contact Info & Map */}
            <div className="space-y-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 backdrop-blur-md">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-400/10 text-gold-400 mb-4">
                    <Phone className="h-6 w-6" />
                  </div>
                  <h3 className="font-heading font-semibold text-cream mb-1">Phone</h3>
                  <p className="text-sm text-ink/60">+234 800 LUXORA 00</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 backdrop-blur-md">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-400/10 text-gold-400 mb-4">
                    <Mail className="h-6 w-6" />
                  </div>
                  <h3 className="font-heading font-semibold text-cream mb-1">Email</h3>
                  <p className="text-sm text-ink/60">concierge@luxora.com</p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 backdrop-blur-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-400/10 text-gold-400 mb-4">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="font-heading font-semibold text-cream mb-1">Headquarters</h3>
                <p className="text-sm text-ink/60 mb-6">14 Eko Pearl Tower, Eko Atlantic City, Lagos, Nigeria</p>
                
                {/* Map Placeholder */}
                <div className="h-64 w-full rounded-xl bg-navy-900 overflow-hidden relative border border-white/5">
                  <div className="absolute inset-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center grayscale" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex items-center justify-center h-10 w-10 bg-gold-400 rounded-full shadow-lux text-navy-900">
                      <MapPin className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="rounded-3xl border border-white/10 bg-navy-800/30 p-8 backdrop-blur-md">
              <h2 className="font-heading text-2xl font-bold text-cream mb-6">Send us a message</h2>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-ink/70">First Name</label>
                    <input type="text" className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-3 px-4 text-cream focus:border-gold-400/50 focus:outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-ink/70">Last Name</label>
                    <input type="text" className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-3 px-4 text-cream focus:border-gold-400/50 focus:outline-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink/70">Email Address</label>
                  <input type="email" className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-3 px-4 text-cream focus:border-gold-400/50 focus:outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink/70">Inquiry Type</label>
                  <select className="w-full appearance-none rounded-xl border border-white/10 bg-navy-900/50 py-3 px-4 text-cream focus:border-gold-400/50 focus:outline-none">
                    <option>General Inquiry</option>
                    <option>Buying a Property</option>
                    <option>Listing a Property</option>
                    <option>Partnerships</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink/70">Message</label>
                  <textarea rows={5} className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-3 px-4 text-cream focus:border-gold-400/50 focus:outline-none resize-none"></textarea>
                </div>
                <GoldButton size="lg" className="w-full justify-center">
                  Send Message <Send className="h-4 w-4 ml-2" />
                </GoldButton>
              </form>
            </div>
          </div>
        </Container>
      </Section>
    </PageLayout>
  );
}
