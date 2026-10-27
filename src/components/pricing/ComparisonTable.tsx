import Icon from "@/components/ui/Icon";
import type { Plan, PricingComparisonFeature } from "@/types/strapi";
import ResponsiveDetails from "./ResponsiveDetails";

const YES = "✓";
const NO = "—";

function Cell({ value }: { value: string | undefined }) {
  const v = value?.trim();
  if (!v || v === NO || v === "-") {
    return (
      <>
        <span aria-hidden="true" className="as-cmp-no">
          {NO}
        </span>
        <span className="as-sr">Not included</span>
      </>
    );
  }
  if (v === YES) {
    return (
      <>
        <span className="as-check" aria-hidden="true">
          <Icon name="check" size={13} />
        </span>
        <span className="as-sr">Included</span>
      </>
    );
  }
  return <>{v}</>;
}

/**
 * Plan comparison matrix: pricing-page.comparisonFeatures (rows) × each plan's comparisonValues
 * (matched by featureKey). Collapsed behind "Compare every feature" on mobile; open with a
 * sticky header row on desktop.
 */
export default function ComparisonTable({
  features,
  plans,
  heading = "Compare every feature",
}: {
  features: PricingComparisonFeature[];
  plans: Plan[];
  heading?: string;
}) {
  const rows = features.filter((f) => f?.key && f?.label);
  if (!rows.length || !plans.length) return null;
  const values = plans.map((plan) => new Map((plan.comparisonValues || []).map((v) => [v.featureKey, v.value])));

  return (
    <section className="as-section as-compare-sec" aria-labelledby="compare-title">
      <div className="as-container">
        <h2 className="as-h2 as-sr" id="compare-title">
          {heading}
        </h2>
        <ResponsiveDetails
          className="as-compare"
          summary={
            <>
              <span>{heading}</span>
              <Icon name="chevron" size={18} className="as-chev" />
            </>
          }
        >
          <div className="as-compare-scroll">
            <table className="as-table as-compare-table">
              <caption className="as-sr">Features included in each plan</caption>
              <thead>
                <tr>
                  <th scope="col">
                    <span className="as-sr">Feature</span>
                  </th>
                  {plans.map((plan) => (
                    <th scope="col" key={plan.documentId} className={plan.isHighlighted ? "is-featured" : undefined}>
                      <a href={`#${plan.slug}`}>{plan.name}</a>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.key}>
                    <th scope="row">{row.label}</th>
                    {plans.map((plan, i) => (
                      <td key={plan.documentId} className={plan.isHighlighted ? "is-featured" : undefined}>
                        <Cell value={values[i].get(row.key)} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ResponsiveDetails>
      </div>
    </section>
  );
}
