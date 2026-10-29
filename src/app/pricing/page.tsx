import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { has } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import { seoMetadata } from "@/lib/seo";
import { getAddOns, getPlans, getPricingPage } from "@/lib/cms-data";
import { Eyebrow, Paragraphs } from "@/components/ui/Section";
import { BillingProvider } from "@/components/pricing/BillingContext";
import PricingToggle from "@/components/pricing/PricingToggle";
import PlanGrid from "@/components/pricing/PlanGrid";
import WhichPlan from "@/components/pricing/WhichPlan";
import ComparisonTable from "@/components/pricing/ComparisonTable";
import AddOnsTable from "@/components/pricing/AddOnsTable";
import CostComparison from "@/components/pricing/CostComparison";
import CtaBand from "@/components/shared/CtaBand";
import GuaranteeBand from "@/components/shared/GuaranteeBand";
import Faq from "@/components/sections/Faq";
import type { SharedCta } from "@/types/strapi";

const FROM = "pricing";

export async function generateMetadata(): Promise<Metadata> {
  let page = null;
  try {
    page = await getPricingPage();
  } catch {
    // Static fallback below.
  }
  return seoMetadata(page?.seo, {
    title: "Pricing | AppleSeed Sites",
    description: ROUTES.pricing.description,
    path: ROUTES.pricing.path,
  });
}

/** shared.cta → CtaBand props. */
const ctaBand = (cta: SharedCta) => ({
  heading: cta.title,
  body: cta.description,
  primary: { label: cta.primaryLabel, href: cta.primaryUrl },
  secondary: { label: cta.secondaryLabel, href: cta.secondaryUrl },
});

export default async function PricingPage() {
  const [page, plans, addOns] = await Promise.all([getPricingPage(), getPlans(), getAddOns()]);
  if (!page) notFound();
  const { hero, planFinder, comparison, costComparison, guarantee, faq, closingCta } = page;
  const ecommerce = page.addOns?.cta;

  return (
    <BillingProvider>
      <header className="as-hero is-compact as-pricing-hero">
        <div className="as-hero-bg" aria-hidden="true" />
        <div className="as-container as-hero-in">
          <div className="as-hero-copy">
            <Eyebrow text={hero?.eyebrow} />
            <h1 className="as-h1 is-compact">{hero?.title || "Pricing"}</h1>
            <Paragraphs text={hero?.description} className="as-lead" />
            {plans.length > 0 && <PricingToggle upfrontLabel={hero?.upfrontLabel} zeroDownLabel={hero?.zeroDownLabel} />}
          </div>
        </div>
      </header>

      <section className="as-section as-pricing as-plans-sec" aria-label="Plans">
        <div className="as-container">
          <PlanGrid plans={plans} from={FROM} />
          {has(hero?.belowCardsNote) && <p className="as-below-cards">{hero?.belowCardsNote}</p>}
        </div>
      </section>

      <WhichPlan heading={planFinder?.title} rows={planFinder?.matches || []} plans={plans} />
      <ComparisonTable heading={comparison?.title || undefined} features={comparison?.features || []} plans={plans} />
      <AddOnsTable heading={page.addOns?.title} addOns={addOns} />
      {ecommerce && <CtaBand id="ecommerce" {...ctaBand(ecommerce)} />}
      <CostComparison heading={costComparison?.title} rows={costComparison?.rows || []} />
      <GuaranteeBand heading={guarantee?.title} body={guarantee?.description} />
      {faq && <Faq data={{ ...faq, title: faq.title || "Pricing questions" }} anchor="faq" />}
      {closingCta && <CtaBand id="get-started" {...ctaBand(closingCta)} />}
    </BillingProvider>
  );
}
