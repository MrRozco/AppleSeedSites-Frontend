"use client";

/** Shown only when a page has never been generated and Strapi can't be reached. */
export default function Error({ reset }) {
  return (
    <header className="as-hero is-compact as-status">
      <div className="as-hero-bg" aria-hidden="true" />
      <div className="as-container as-hero-in">
        <div className="as-hero-copy">
          <p className="as-eyebrow">Temporarily unavailable</p>
          <h1 className="as-h1 is-compact">This page didn&rsquo;t load</h1>
          <p className="as-lead">Please try again in a moment.</p>
          <div className="as-btn-row">
            <button type="button" className="as-btn as-btn-primary as-btn-lg" onClick={() => reset()}>
              Try again
            </button>
            <a className="as-btn as-btn-secondary as-btn-lg" href="/">
              Back to home
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
