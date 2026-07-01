import { PageLayout, Container, Section, PageHeader, Breadcrumb } from '../../components/layout';
import { HelpCircle, ChevronDown } from 'lucide-react';

const faqs = [
  {
    category: "General",
    questions: [
      { q: "What is Luxora?", a: "Luxora is Africa's premier luxury real estate platform, offering verified high-end properties for discerning buyers and renters." },
      { q: "How do you verify properties?", a: "We utilize a strict multi-point physical and legal verification process. A property only earns our 'Verified' badge after passing inspections by our in-house experts and legal partners." }
    ]
  },
  {
    category: "For Buyers",
    questions: [
      { q: "How do I schedule a viewing?", a: "You can schedule a viewing directly from any property details page. Simply click 'Request Tour' and select your preferred date and time." },
      { q: "Are the prices negotiable?", a: "Prices are set by the listing agents and owners. However, you can submit an offer through our platform once you have completed a viewing." }
    ]
  },
  {
    category: "For Agents",
    questions: [
      { q: "How can I list properties on Luxora?", a: "Agents must apply to join our network. We review applications based on market experience, portfolio quality, and professional standing." },
      { q: "What is the fee structure?", a: "We operate on a transparent tier-based subscription model for agents, plus a nominal verification fee per property." }
    ]
  }
];

export default function FAQPage() {
  return (
    <PageLayout>
      <Container className="pt-24 md:pt-32">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'FAQ' }]} />
        <PageHeader 
          title="Frequently Asked Questions"
          description="Find answers to common questions about Luxora, our verification process, and our services."
        />
      </Container>

      <Section className="pb-24">
        <Container>
          <div className="mx-auto max-w-3xl space-y-12">
            {faqs.map((group, idx) => (
              <div key={idx}>
                <h2 className="font-heading text-2xl font-bold text-cream mb-6 flex items-center gap-3">
                  <HelpCircle className="h-6 w-6 text-gold-400" />
                  {group.category}
                </h2>
                <div className="space-y-4">
                  {group.questions.map((faq, i) => (
                    <details key={i} className="group rounded-2xl border border-white/10 bg-navy-800/30 p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer">
                      <summary className="flex items-center justify-between font-semibold text-cream">
                        {faq.q}
                        <ChevronDown className="h-5 w-5 text-ink/50 transition-transform group-open:rotate-180" />
                      </summary>
                      <p className="mt-4 text-ink/70 leading-relaxed">
                        {faq.a}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </PageLayout>
  );
}
