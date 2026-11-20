export function sanitizeQuery(raw: string, maxLen = 60): string {
  return raw
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // strip control chars & null bytes
    .replace(/[\u202A-\u202E\u2066-\u2069]/g, '')       // strip Unicode direction overrides
    .replace(/[<>`"'\\;]/g, '')
    .replace(/\s+/g, ' ')
    .slice(0, maxLen);
}

export function formatRegistration(
  fullReg: string,
  maskedReg: string,
  canViewFull: boolean
): string {
  return canViewFull ? fullReg : maskedReg;
}
