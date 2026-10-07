/**
 * SERVER-ONLY. Do not import this from any "use client" component — the
 * whole point of this file is to keep COFFEE_TEST_PROMO out of the public
 * JS bundle. Only app/api/coffee/create-order/route.ts (a server route)
 * should import from here.
 */
import { priceOrder, type CartLine, type PricedOrder } from "./sotsCoffee";

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
}

export function priceOrderServer(cart: CartLine[], couponCode?: string): PricedOrderServer {
  const normalizedCode = couponCode?.trim().toUpperCase();
  const testOverride = normalizedCode === COFFEE_TEST_PROMO.code;

  // SONGS and RUPEE1 are mutually exclusive — if someone typos into the test
  // code's territory they get the normal promo path, never both at once.
  const priced = priceOrder(cart, testOverride ? undefined : couponCode);

  if (!testOverride || priced.totalQty === 0) {
    return { ...priced, testOverride: false };
  }

  const payableTotalRupees = Math.min(priced.payableTotalRupees, COFFEE_TEST_PROMO.flatRupees);
  return {
    ...priced,
    payableTotalRupees,
    discountRupees: priced.originalTotalRupees - payableTotalRupees,
    testOverride: true,
  };
}
