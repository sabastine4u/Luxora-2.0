export function formatCurrency(amount: number): string {
  return `₦${amount.toLocaleString()}`;
}

export function calculateMortgage(priceMillions: number, downPaymentPct: number, months: number): { principal: number; monthly: number } {
  const principal = (priceMillions * 1_000_000) * (1 - downPaymentPct / 100);
  const rateMap: Record<number, number> = { 12: 0.085, 24: 0.11, 36: 0.135, 60: 0.16 };
  const r = (rateMap[months] || 0.135) / 12;
  const monthly = Math.round((principal * r) / (1 - Math.pow(1 + r, -months)));
  return { principal, monthly };
}
