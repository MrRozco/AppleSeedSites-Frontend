import { has } from "@/lib/utils";
import Icon from "@/components/ui/Icon";
import { Paragraphs } from "@/components/ui/Section";

/** shared.guarantee: a single highlighted promise (heading + body). */
export default function GuaranteeBand({ heading, body }: { heading?: string | null; body?: string | null }) {
  if (!has(heading)) return null;
  return (
    <section className="as-section as-guarantee-sec" aria-labelledby="guarantee-title">
      <div className="as-container">
        <div className="as-card as-guarantee as-reveal">
          <span className="as-icon-tile as-guarantee-ic" aria-hidden="true">
            <Icon name="check" size={24} />
          </span>
          <div className="as-guarantee-copy">
            <h2 className="as-h3" id="guarantee-title">
              {heading}
            </h2>
            <Paragraphs text={body} className="as-muted" />
          </div>
        </div>
      </div>
    </section>
  );
}
