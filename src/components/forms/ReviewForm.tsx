"use client";

import type { LeadFormContent } from "@/types/strapi";
import LeadForm from "./LeadForm";

/**
 * Free site review form for /web-ops: website + email only, saved with need = site-review.
 */
export default function ReviewForm({
  content,
  submitLabel = "Get My Free Site Review",
}: {
  content?: Partial<LeadFormContent> | null;
  submitLabel?: string;
}) {
  return (
    <LeadForm
      kind="review"
      variant="compact"
      submitLabel={submitLabel}
      labels={{ website: "Your website", contact: "Email" }}
      content={{ underButtonText: content?.underButtonText, privacyText: content?.privacyText }}
    />
  );
}
