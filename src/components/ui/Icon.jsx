/* UI icons from the design package (appleseed-sites-design/js/appleseed.js). 24px grid, stroke icons. */
const PATHS = {
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  ext: <path d="M8 16 16 8M10 8h6v6" />,
  chevron: <path d="m6 9 6 6 6-6" />,
  left: <path d="m15 6-6 6 6 6" />,
  right: <path d="m9 6 6 6-6 6" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  spark: (
    <>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path d="M12 8.5 13.6 10.4 15.5 12l-1.9 1.6L12 15.5l-1.6-1.9L8.5 12l1.9-1.6z" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="m3.5 7 8.5 6.5L20.5 7" />
    </>
  ),
  phone: (
    <path d="M6.5 3.5h3l1.5 4.5-2 1.5a11 11 0 0 0 5.5 5.5l1.5-2 4.5 1.5v3a2 2 0 0 1-2 2A16.5 16.5 0 0 1 4.5 5.5a2 2 0 0 1 2-2z" />
  ),
  pin: (
    <>
      <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
  trend: (
    <>
      <path d="m3.5 17 6-6 4 4 7-7.5" />
      <path d="M15 7.5h5.5V13" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  alert: (
    <>
      <path d="M12 3.5 2.8 19.5h18.4z" />
      <path d="M12 10v4.5M12 17.2v.1" />
    </>
  ),
};

/** Five filled stars for a rating. Decorative: pair it with visible text and an sr-only label. */
export function Stars({ count = 5 }) {
  return (
    <span className="as-stars">
      {Array.from({ length: count }, (_, i) => (
        <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
          <path d="m12 2.8 2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" />
        </svg>
      ))}
    </span>
  );
}

export default function Icon({ name, size = 20, className }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name] || PATHS.spark}
    </svg>
  );
}

export function QuoteMark() {
  return (
    <svg viewBox="0 0 38 30" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M0 30V18.6C0 8.6 5.4 2.4 15.4 0l1.9 4.3C11.6 6 8.9 9.6 8.6 14.2H16V30zm21.6 0V18.6C21.6 8.6 27 2.4 37 0l1 4.3c-5.7 1.7-8.4 5.3-8.7 9.9h7.4V30z" />
    </svg>
  );
}

/** Pick a sensible stand-in icon for a contact link from its href. */
export function iconForHref(href = "") {
  if (/^mailto:/i.test(href)) return "mail";
  if (/^(tel|sms):/i.test(href)) return "phone";
  return "pin";
}
