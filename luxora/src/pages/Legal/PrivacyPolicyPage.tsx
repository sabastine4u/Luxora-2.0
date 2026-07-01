import { PageLayout, Container, Section, PageHeader, Breadcrumb } from '../../components/layout';

export default function PrivacyPolicyPage() {
  return (
    <PageLayout>
      <Container className="pt-24 md:pt-32">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Privacy Policy' }]} />
        <PageHeader 
          title="Privacy Policy"
          description="Last updated: October 1, 2026"
        />
      </Container>

      <Section className="pb-24">
        <Container>
          <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-navy-800/30 p-8 md:p-12 text-ink/70 prose prose-invert prose-gold">
            <h2 className="text-xl font-bold text-cream mb-4">1. Introduction</h2>
            <p className="mb-6">
              Luxora respects your privacy and is committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
            </p>

            <h2 className="text-xl font-bold text-cream mb-4 mt-8">2. Data We Collect</h2>
            <p className="mb-6">
              We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
              <li><strong>Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
              <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
            </ul>

            <h2 className="text-xl font-bold text-cream mb-4 mt-8">3. How We Use Your Data</h2>
            <p className="mb-6">
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
              <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
              <li>Where we need to comply with a legal obligation.</li>
            </ul>

            <p className="mt-12 text-sm text-ink/50 italic">
              This is a placeholder privacy policy for demonstration purposes only.
            </p>
          </div>
        </Container>
      </Section>
    </PageLayout>
  );
}
