import { PageLayout, Container, Section } from '../../components/layout';
import { GoldButton } from '../../components/ui/ui';
import { Compass, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export default function NotFoundPage() {
  return (
    <PageLayout>
      <Section className="min-h-[70vh] flex items-center justify-center">
        <Container>
          <div className="mx-auto max-w-lg text-center">
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-navy-800 border border-white/10 shadow-lux">
              <Compass className="h-12 w-12 text-gold-400" />
            </div>
            <h1 className="font-heading text-6xl font-bold text-cream mb-4">404</h1>
            <h2 className="font-heading text-2xl font-semibold text-gold-300 mb-6">Page Not Found</h2>
            <p className="text-ink/70 mb-10 text-lg">
              It seems you've ventured off the map. The page or property you are looking for does not exist or has been moved.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={ROUTES.HOME} className="w-full sm:w-auto">
                <GoldButton size="lg" className="w-full justify-center">
                  Return Home
                </GoldButton>
              </Link>
              <Link to={ROUTES.SEARCH} className="w-full sm:w-auto">
                <button className="w-full justify-center flex items-center gap-2 rounded-xl bg-navy-800 px-6 py-3 font-semibold text-cream transition-colors hover:bg-navy-700 border border-white/10">
                  Search Properties <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </PageLayout>
  );
}
