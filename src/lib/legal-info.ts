export const legalInfo = {
  product: "Harlo",
  operator: "Harlo Social",
  location: "Victoria, Australia",
  privacyEmail: "privacy@harlosocial.com",
  governingLaw: "Victoria, Australia",
  lastUpdated: "24 August 2026",
  // Partner-program figures — each has its own confirmed flag, since terms
  // are being approved one at a time rather than all at once. Only render a
  // figure on /partners or /legal/partner-terms when its own flag is true;
  // otherwise those pages fall back to non-specific wording. Flip a flag to
  // true (and update the value if needed) once that specific term is
  // actually signed off — do not flip one without the other.
  partnerCommission: "20%",
  partnerCommissionConfirmed: true,
  partnerReferralWindow: "30 days",
  partnerReferralWindowConfirmed: false,
  partnerValidationPeriod: "30 days",
  partnerValidationPeriodConfirmed: false,
  partnerPayoutSchedule: "Monthly",
  partnerPayoutScheduleConfirmed: false,
} as const;
