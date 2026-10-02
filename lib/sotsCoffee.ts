/**
 * Songs of the Stone — Chapter Three — Coffee pre-order configuration.
 *
 * One small event-side stall (not the ticketed main event). Single source of
 * truth for the menu, the promo rule and the event details shown on the page
 * and used in emails/confirmations — same role as lib/editions.ts plays for
 * The Living Table. Edit prices/items here; no DB migration needed for that.
 */

export interface CoffeeItem {
  id: string;
  name: string;
  description: string;
  priceRupees: number;
}

export const SOTS_EVENT = {
  title: "Songs of the Stone",
  chapter: "Chapter Three — From Dusk to Dawn",
  artist: "Amrita Kaur",
  venue: "Purana Qila, New Delhi",
  dateLabel: "10–11 October 2026",
  presentedBy: "HSBC — Live The Legacy",
  supportedBy: "Delhi Tourism & Archaeological Survey of India",
};

export const COFFEE_ITEMS: CoffeeItem[] = [
  { id: "espresso",      name: "Espresso",                     description: "A single shot, pulled strong and short.",                     priceRupees: 100 },
  { id: "cappuccino",    name: "Cappuccino",                   description: "Espresso, steamed milk, a cap of foam.",                       priceRupees: 150 },
  { id: "cafe-latte",    name: "Café Latte",                   description: "Smooth and milky, for the long hours till dawn.",              priceRupees: 160 },
  { id: "cold-brew",     name: "Cold Brew",                    description: "Slow-steeped, served over ice.",                               priceRupees: 170 },
  { id: "filter-coffee", name: "Filter Coffee / Masala Chai",  description: "South Indian filter coffee or spiced chai — pick at the counter.", priceRupees: 120 },
];

/** Placeholder prices — adjust here before the event; no code changes needed elsewhere. */

export function getCoffeeItem(id: string): CoffeeItem | undefined {
  return COFFEE_ITEMS.find(i => i.id === id);
}

export const COFFEE_PROMO = {
  code: "SONGS",
  freeUnits: 2,
  description: "First 2 cups free with code SONGS.",
};

export interface CartLine {
  id: string;
  qty: number;
}

export interface PricedLine extends CartLine {
  name: string;
  unitPriceRupees: number;
  freeQty: number;
  payableQty: number;
  lineTotalRupees: number;
}

export interface PricedOrder {
  lines: PricedLine[];
  totalQty: number;
  originalTotalRupees: number;
  discountRupees: number;
  payableTotalRupees: number;
  freeUnitsApplied: number;
}

/**
 * Server-authoritative pricing. Never trust a client-sent total.
 * Promo rule: the N (= COFFEE_PROMO.freeUnits) CHEAPEST individual cups across
 * the whole cart are free — deterministic regardless of cart/add order, and
 * resolves in the customer's favour (avoids counter disputes at the event).
 */
export function priceOrder(cart: CartLine[], couponCode?: string): PricedOrder {
  const resolved = cart
    .map(line => {
      const item = getCoffeeItem(line.id);
      return item ? { id: item.id, name: item.name, unitPriceRupees: item.priceRupees, qty: Math.max(1, Math.floor(line.qty)) } : null;
    })
    .filter((l): l is { id: string; name: string; unitPriceRupees: number; qty: number } => l !== null);

  const promoApplied = couponCode?.trim().toUpperCase() === COFFEE_PROMO.code;
  let freeUnitsRemaining = promoApplied ? COFFEE_PROMO.freeUnits : 0;

  // Flatten to units, sort ascending by price, mark the cheapest N free —
  // then fold back into per-item free counts.
  const units = resolved.flatMap(l => Array.from({ length: l.qty }, () => ({ id: l.id, price: l.unitPriceRupees })));
  units.sort((a, b) => a.price - b.price);
  const freeUnitIdsInOrder: string[] = units.slice(0, freeUnitsRemaining).map(u => u.id);
  const freeCountByItem = new Map<string, number>();
  for (const id of freeUnitIdsInOrder) freeCountByItem.set(id, (freeCountByItem.get(id) ?? 0) + 1);

  const lines: PricedLine[] = resolved.map(l => {
    const freeQty = Math.min(l.qty, freeCountByItem.get(l.id) ?? 0);
    const payableQty = l.qty - freeQty;
    return {
      id: l.id, qty: l.qty, name: l.name, unitPriceRupees: l.unitPriceRupees,
      freeQty, payableQty, lineTotalRupees: payableQty * l.unitPriceRupees,
    };
  });

  const totalQty = lines.reduce((s, l) => s + l.qty, 0);
  const originalTotalRupees = lines.reduce((s, l) => s + l.qty * l.unitPriceRupees, 0);
  const payableTotalRupees = lines.reduce((s, l) => s + l.lineTotalRupees, 0);

  return {
    lines, totalQty, originalTotalRupees,
    discountRupees: originalTotalRupees - payableTotalRupees,
    payableTotalRupees,
    freeUnitsApplied: freeUnitIdsInOrder.length,
  };
}
