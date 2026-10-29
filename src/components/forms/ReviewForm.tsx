"use client";

import type { LeadFormFields } from "@/types/strapi";
import LeadForm from "./LeadForm";

/**
 * Free site review form for /web-ops: website + email only, saved with need = site-review.
 */
export default function ReviewForm({
  fields,
  submitLabel = "Get My Free Site Review",
}: {
  fields?: Partial<LeadFormFields> | null;
  submitLabel?: string;
}) {
  return (
    <LeadForm
      kind="review"
      variant="compact"
      submitLabel={submitLabel}
      labels={{ website: "Your website", contact: "Email" }}
      fields={{ underButtonText: fields?.underButtonText, privacyText: fields?.privacyText }}
    />
  );
}
