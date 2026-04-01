/** Geometric mark inspired by minimal SVG shapes ([shapes.gallery](https://www.shapes.gallery/)) — soft tile + rounded plus */
export function LogoMark({ className = "", size = 30 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden
    >
      <rect
        x="2"
        y="2"
        width="28"
        height="28"
        rx="9"
        fill="currentColor"
        opacity="0.12"
      />
      <rect
        x="2"
        y="2"
        width="28"
        height="28"
        rx="9"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.35"
      />
      <path
        d="M16 9v14M9 16h14"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
    </svg>
  )
}
