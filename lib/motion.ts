export const MOTION_DURATION = {
  fast: 0.15,
  base: 0.4,
  slow: 0.65,
} as const;

export const MOTION_DURATION_MS = {
  fast: 150,
  base: 400,
  slow: 650,
} as const;

export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const REVEAL_DISTANCE = {
  sm: 16,
  base: 20,
  lg: 24,
} as const;

export const STAGGER_STEP = 0.07;
