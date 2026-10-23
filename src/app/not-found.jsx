import Button from "@/components/ui/Button";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <header className="as-hero is-compact as-status">
      <div className="as-hero-bg" aria-hidden="true" />
      <div className="as-container as-hero-in">
        <div className="as-hero-copy">
          <p className="as-eyebrow">404</p>
          <h1 className="as-h1 is-compact">We couldn&rsquo;t find that page</h1>
          <p className="as-lead">The page may have moved, or the link may be out of date.</p>
          <div className="as-btn-row">
            <Button href="/" size="lg">
              Back to home
            </Button>
            <Button href="/contact" variant="secondary" size="lg">
              Contact us
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
