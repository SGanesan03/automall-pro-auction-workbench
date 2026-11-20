import { describe, expect, it } from 'vitest';
import { canPerform } from '../auth-rbac/auctionRbac';
import { formatRegistration, sanitizeQuery } from '../shared/utils/security';

describe('AutoMall Pro RBAC & Vehicle Privacy Guards', () => {
  it('enforces persona separation across BUYER, SELLER_NBFC, and OPS_ADMIN', () => {
    expect(canPerform('BUYER', 'PLACE_BID')).toBe(true);
    expect(canPerform('BUYER', 'VIEW_SELLER_RESERVE')).toBe(false);
    expect(canPerform('BUYER', 'APPROVE_WINNING_BID')).toBe(false);

    expect(canPerform('SELLER_NBFC', 'VIEW_SELLER_RESERVE')).toBe(true);
    expect(canPerform('SELLER_NBFC', 'APPROVE_WINNING_BID')).toBe(true);
    expect(canPerform('SELLER_NBFC', 'UPDATE_VEHICLE_SERVICES')).toBe(false);

    expect(canPerform('OPS_ADMIN', 'UPDATE_VEHICLE_SERVICES')).toBe(true);
    expect(canPerform('OPS_ADMIN', 'VIEW_AUDIT_LOG')).toBe(true);
  });

  it('masks vehicle registration plates for unauthorized roles', () => {
    expect(formatRegistration('TN-09-BQ-4821', 'TN-09-XX-4821', false)).toBe('TN-09-XX-4821');
    expect(formatRegistration('TN-09-BQ-4821', 'TN-09-XX-4821', true)).toBe('TN-09-BQ-4821');
  });

  it('sanitizes search queries against script injection', () => {
    const clean = sanitizeQuery(`<img src=x onerror=alert(1)>; Creta`);
    expect(clean).not.toContain('<');
    expect(clean).not.toContain('>');
    expect(clean).not.toContain(';');
  });
});
