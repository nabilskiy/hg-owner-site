/**
 * Shared animation presets. Islands that animate import `useReducedMotion`
 * from `motion/react` and skip transform or opacity motion when it is true.
 * Do not set opacity: 0 in server-rendered markup.
 */
export const motionPresets = {
  duration: {
    fast: 0.2,
    base: 0.45,
    slow: 0.7,
  },
  ease: {
    standard: [0.22, 1, 0.36, 1] as const,
    out: [0, 0, 0.2, 1] as const,
  },
  stagger: 0.08,
  spring: {
    stiffness: 180,
    damping: 24,
  },
} as const;
