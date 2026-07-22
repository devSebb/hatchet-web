import {
  companyLogos,
  type CompanyLogo as CompanyLogoData,
  type CompanyLogoSlug,
} from "@/lib/brand/logos";

/**
 * Logos are matched on optical weight rather than a shared height or bounding
 * box: a compact glyph set at a wordmark's height reads far heavier than it.
 * Height scales as aspect^-0.3 — a blend between equal-height (0) and equal-area
 * (-0.5), which over-shrinks long wordmarks. Bounds keep the extremes sane.
 */
const ASPECT_REFERENCE = 3.5;
const SCALE_EXPONENT = 0.3;
const SCALE_MIN = 0.8;
const SCALE_MAX = 1.5;

type CompanyLogoProps = {
  className?: string;
  /** Optical height in px before aspect correction. */
  height?: number;
  slug: CompanyLogoSlug;
};

export function CompanyLogo({
  className,
  height = 28,
  slug,
}: CompanyLogoProps) {
  const logo: CompanyLogoData = companyLogos[slug];
  const [, , boxWidth, boxHeight] = logo.viewBox.split(" ").map(Number);
  const aspect = boxWidth / boxHeight;
  const scale = Math.min(
    SCALE_MAX,
    Math.max(SCALE_MIN, (ASPECT_REFERENCE / aspect) ** SCALE_EXPONENT),
  );
  const renderedHeight = height * scale;

  // Quantize to a stable px string. `scale` derives from Math.pow, which can
  // differ by a few ULPs between the server (Node) and the browser engine —
  // enough to make React's raw-float style serialization mismatch on hydration.
  // Rounding to 2 decimals absorbs that divergence so both sides emit the same
  // value while staying sub-pixel precise.
  const px = (n: number) => `${Math.round(n * 100) / 100}px`;

  return (
    <svg
      aria-label={`${logo.name} logo`}
      className={className}
      fill="currentColor"
      role="img"
      style={{ height: px(renderedHeight), width: px(renderedHeight * aspect) }}
      viewBox={logo.viewBox}
      xmlns="http://www.w3.org/2000/svg"
    >
      {logo.paths.map((path) => (
        <path
          d={path.d}
          fill={path.fill}
          fillRule={logo.fillRule}
          key={path.d}
          transform={logo.transform}
        />
      ))}
    </svg>
  );
}
