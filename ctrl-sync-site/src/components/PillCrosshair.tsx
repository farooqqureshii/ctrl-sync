import { motion } from "framer-motion"
import type { ComponentProps } from "react"

type Props = Omit<ComponentProps<typeof motion.svg>, "children"> & {
  size?: number
  color?: string
}

/** Four rounded-bar crosshair with gap at center — inspired by UI reticles / [shapes.gallery](https://www.shapes.gallery/) style marks */
export function PillCrosshair({
  className = "",
  size = 48,
  color = "currentColor",
  ...motionProps
}: Props) {
  const sw = Math.max(1.8, size * 0.09)
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
      {...motionProps}
    >
      <g stroke={color} strokeWidth={sw} strokeLinecap="round">
        <line x1="12" y1="1.85" x2="12" y2="9.15" />
        <line x1="12" y1="14.85" x2="12" y2="22.15" />
        <line x1="1.85" y1="12" x2="9.15" y2="12" />
        <line x1="14.85" y1="12" x2="22.15" y2="12" />
      </g>
    </motion.svg>
  )
}
