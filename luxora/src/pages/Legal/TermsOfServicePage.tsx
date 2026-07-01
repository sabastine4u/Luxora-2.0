import { PageLayout, Container, Section, PageHeader, Breadcrumb } from '../../components/layout';

export default function TermsOfServicePage() {
  return (
    <PageLayout>
      <Container className="pt-24 md:pt-32">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Terms of Service' }]} />
        <PageHeader 
          title="Terms of Service"
          description="Last updated: October 1, 2026"
        />
      </Container>

      <Section className="pb-24">
        <Container>
          <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-navy-800/30 p-8 md:p-12 text-ink/70 prose prose-invert prose-gold">
            <h2 className="text-xl font-bold text-cream mb-4">1. Agreement to Terms</h2>
            <p className="mb-6">
              By accessing our website and utilizing our services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>

            <h2 className="text-xl font-bold text-cream mb-4 mt-8">2. Use License</h2>
            <p className="mb-6">
              Permission is granted to temporarily download one copy of the materials (information or software) on Luxora's website for personal, non-commercial transitory viewing only.
            </p>

            <h2 className="text-xl font-bold text-cream mb-4 mt-8">3. Property Listings and Verification</h2>
            <p className="mb-6">
              While Luxora makes every effort to verify the properties listed on our platform, we do not guarantee the absolute accuracy of every detail provided by third-party agents. Buyers are strongly encouraged to conduct their own due diligence before entering into any binding agreements.
            </p>

            <h2 className="text-xl font-bold text-cream mb-4 mt-8">4. Limitations</h2>
            <p className="mb-6">
              In no event shall Luxora or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Luxora's website.
            </p>

            <p className="mt-12 text-sm text-ink/50 italic">
              This is a placeholder terms of service document for demonstration purposes only.
            </p>
          </div>
        </Container>
      </Section>
    </PageLayout>
  );
}
