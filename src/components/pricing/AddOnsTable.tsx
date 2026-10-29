import { has } from "@/lib/utils";
import { formatAddOnPrice } from "@/lib/format-price";
import SmartLink from "@/components/ui/SmartLink";
import { SectionHead } from "@/components/ui/Section";
import type { AddOn } from "@/types/strapi";

/** Add-ons with formatted prices ("$249/mo", "$497 one-time", "$100 each"). Anchor: #add-ons. */
export default function AddOnsTable({ heading, addOns }: { heading?: string | null; addOns: AddOn[] }) {
  if (!addOns.length) return null;
  return (
    <section className="as-section as-addons-sec" id="add-ons" aria-labelledby="add-ons-title">
      <div className="as-container">
        <SectionHead id="add-ons-title" title={heading || "Add-ons"} />
        <ul className="as-addons">
          {addOns.map((addOn) => {
            const price = formatAddOnPrice(addOn.price, addOn.priceSuffix);
            const link = addOn.link;
            return (
              <li key={addOn.documentId} className="as-addon as-reveal">
                <div className="as-addon-main">
                  <h3 className="as-h4">{addOn.name}</h3>
                  {has(addOn.description) && <p>{addOn.description}</p>}
                  {link && has(link.url) && has(link.label) && (
                    <SmartLink className="as-addon-link" href={link.url as string}>
                      {link.label}
                    </SmartLink>
                  )}
                </div>
                <div className="as-addon-price">
                  {price && <b>{price}</b>}
                  {has(addOn.priceNote) && <span>{addOn.priceNote}</span>}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
