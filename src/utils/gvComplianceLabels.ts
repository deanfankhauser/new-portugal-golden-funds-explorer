/**
 * Centralized Golden Visa Compliance Labels
 * 
 * These labels ensure we do not claim to determine eligibility,
 * per our disclaimer that only Portuguese legal counsel can confirm eligibility.
 */

export const GV_LABELS = {
  /** Short label for badges */
  SHORT: 'GV-intended',
  /** Full badge label with attribution */
  BADGE: 'GV-intended (manager-stated)',
  /** Label for count displays */
  COUNT_LABEL: 'GV-intended',
  /** Tooltip/disclaimer text */
  TOOLTIP: 'Eligibility must be confirmed with Portuguese legal counsel. Labels reflect fund documentation and/or manager statements, not legal advice.',
} as const;

export const GV_PHRASES = {
  /** Replace "eligible for Golden Visa" */
  ELIGIBLE_FOR_GV: 'marketed for the Golden Visa route (manager-stated)',
  /** Replace "Golden Visa qualifying investment" */
  QUALIFYING_INVESTMENT: 'marketed as a Golden Visa investment (manager-stated)',
  /** Replace "GV Eligible" in counts */
  COUNT_FORMAT: (eligible: number, total: number) => 
    `${eligible} of ${total} GV-intended (manager-stated)`,
} as const;
