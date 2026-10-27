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
import FaqAccordion from "@/components/shared/FaqAccordion";

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

export default async function PricingPage() {
  const [page, plans, addOns] = await Promise.all([getPricingPage(), getPlans(), getAddOns()]);
  if (!page) notFound();

  return (
    <BillingProvider>
      <header className="as-hero is-compact as-pricing-hero">
        <div className="as-hero-bg" aria-hidden="true" />
        <div className="as-container as-hero-in">
          <div className="as-hero-copy">
            <Eyebrow text={page.eyebrow} />
            <h1 className="as-h1 is-compact">{page.heading || "Pricing"}</h1>
            <Paragraphs text={page.subheading} className="as-lead" />
            {plans.length > 0 && (
              <PricingToggle upfrontLabel={page.toggleUpfrontLabel} zeroDownLabel={page.toggleZeroDownLabel} />
            )}
          </div>
        </div>
      </header>

      <section className="as-section as-pricing as-plans-sec" aria-label="Plans">
        <div className="as-container">
          <PlanGrid plans={plans} from={FROM} />
          {has(page.belowCardsNote) && <p className="as-below-cards">{page.belowCardsNote}</p>}
        </div>
      </section>

      <WhichPlan heading={page.whichPlanHeading} rows={page.whichPlan || []} plans={plans} />
      <ComparisonTable features={page.comparisonFeatures || []} plans={plans} />
      <AddOnsTable heading={page.addOnsHeading} addOns={addOns} />

      {page.ecommerce && (
        <CtaBand
          id="ecommerce"
          heading={page.ecommerce.heading}
          body={page.ecommerce.body}
          primary={{ label: page.ecommerce.primaryLabel, href: page.ecommerce.primaryHref }}
          secondary={{ label: page.ecommerce.secondaryLabel, href: page.ecommerce.secondaryHref }}
        />
      )}

      <CostComparison heading={page.costComparisonHeading} rows={page.costComparison || []} />
      <GuaranteeBand heading={page.guarantee?.heading} body={page.guarantee?.body} />

      {(page.faqs?.length ?? 0) > 0 && (
        <section className="as-section as-faq-sec" aria-labelledby="pricing-faq-title">
          <div className="as-container">
            <div className="as-faq">
              <div className="as-faq-head as-reveal">
                <h2 className="as-h2" id="pricing-faq-title">
                  {page.faqHeading || "Pricing questions"}
                </h2>
              </div>
              <FaqAccordion
                items={(page.faqs || []).map((f) => ({ id: f.id, question: f.question, answerBlocks: f.answer }))}
              />
            </div>
          </div>
        </section>
      )}

      {page.closingCta && (
        <CtaBand
          id="get-started"
          heading={page.closingCta.heading}
          body={page.closingCta.body}
          primary={{ label: page.closingCta.primaryLabel, href: page.closingCta.primaryHref }}
          secondary={{ label: page.closingCta.secondaryLabel, href: page.closingCta.secondaryHref }}
        />
      )}
    </BillingProvider>
  );
}
