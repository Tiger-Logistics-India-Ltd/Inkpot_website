/**
 * SERVER-ONLY. Do not import this from any "use client" component — the
 * whole point of this file is to keep COFFEE_TEST_PROMO out of the public
 * JS bundle. Only app/api/coffee/create-order/route.ts (a server route)
 * should import from here.
 */
import { priceOrder, COFFEE_PROMO, type CartLine, type PricedOrder } from "./sotsCoffee";

/**
 * Internal-only test code — forces the payable total to ₹1 regardless of
 * cart contents, so the live Razorpay path (same keys as production) can be
 * verified end-to-end without moving a real amount. Not meant for customers.
 * Kept out of lib/sotsCoffee.ts specifically because that module is imported
 * by the client page for the live cart preview, and would ship this string
 * in plaintext in the browser bundle otherwise.
 */
export const COFFEE_TEST_PROMO = {
  code: "RUPEE1",
  flatRupees: 1,
  maxUses: 5, // hard cap, counted across paid + pending — enforced in create-order (needs a DB read)
};

export interface PricedOrderServer extends PricedOrder {
  testOverride: boolean;
  /** Generic, code-agnostic status for the client preview — never names which code matched. */
  codeState: "none" | "valid" | "invalid";
  codeMessage: string | null;
}

export function priceOrderServer(cart: CartLine[], couponCode?: string): PricedOrderServer {
  const trimmed = couponCode?.trim() ?? "";
  const normalizedCode = trimmed.toUpperCase();
  const testOverride = normalizedCode === COFFEE_TEST_PROMO.code;

  // SONGS and RUPEE1 are mutually exclusive — if someone typos into the test
  // code's territory they get the normal promo path, never both at once.
  const priced = priceOrder(cart, testOverride ? undefined : couponCode);

  let codeState: "none" | "valid" | "invalid" = "none";
  let codeMessage: string | null = null;
  if (trimmed) {
    if (testOverride) { codeState = "valid"; codeMessage = "Code applied."; }
    else if (priced.discountRupees > 0) { codeState = "valid"; codeMessage = COFFEE_PROMO.description; }
    else { codeState = "invalid"; codeMessage = "Invalid code."; }
  }

  if (!testOverride || priced.totalQty === 0) {
    return { ...priced, testOverride: false, codeState, codeMessage };
  }

  const payableTotalRupees = Math.min(priced.payableTotalRupees, COFFEE_TEST_PROMO.flatRupees);
  return {
    ...priced,
    payableTotalRupees,
    discountRupees: priced.originalTotalRupees - payableTotalRupees,
    testOverride: true,
    codeState, codeMessage,
  };
}
