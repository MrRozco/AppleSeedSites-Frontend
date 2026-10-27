import { has } from "@/lib/utils";
import { SectionHead } from "@/components/ui/Section";
import type { PricingCostRow } from "@/types/strapi";

/** "What a website really costs": option / price / outcome. The AppleSeed row is highlighted. */
export default function CostComparison({ heading, rows }: { heading?: string | null; rows: PricingCostRow[] }) {
  const list = rows.filter((r) => has(r?.option));
  if (!list.length) return null;
  return (
    <section className="as-section as-cost-sec" aria-labelledby="cost-title">
      <div className="as-container">
        <SectionHead id="cost-title" title={heading || "What a website really costs"} />
        <div className="as-card as-cost as-reveal">
          <table className="as-table as-cost-table">
            <thead>
              <tr>
                <th scope="col">Option</th>
                <th scope="col">Cost</th>
                <th scope="col">What you get</th>
              </tr>
            </thead>
            <tbody>
              {list.map((row, i) => (
                <tr key={row.id ?? i} className={/appleseed/i.test(row.option || "") ? "is-featured" : undefined}>
                  <th scope="row">{row.option}</th>
                  <td data-label="Cost">{row.price}</td>
                  <td data-label="What you get">{row.outcome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
