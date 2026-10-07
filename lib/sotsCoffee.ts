/**
 * Songs of the Stone — Chapter Three — Coffee & food pre-order configuration.
 *
 * One small event-side stall (not the ticketed main event). Single source of
 * truth for the menu, sessions, caps and the promo rules — same role as
 * lib/editions.ts plays for The Living Table. Edit prices/items here; no DB
 * migration needed for that (sessions/caps are a different story — see
 * supabase/add_session_to_coffee_orders.sql).
 */

export type SessionId = "oct10-evening" | "oct11-morning";

export interface SessionInfo {
  id: SessionId;
  label: string;      // short — used in toggles/badges
  dateLabel: string;  // full — used in confirmations
}

export const SESSIONS: SessionInfo[] = [
  { id: "oct10-evening", label: "10th Evening", dateLabel: "10 October, 7 PM onwards" },
  { id: "oct11-morning", label: "11th Morning", dateLabel: "11 October, 6 AM onwards" },
];

export function isSessionId(v: unknown): v is SessionId {
  return v === "oct10-evening" || v === "oct11-morning";
}

export function getSession(id: SessionId): SessionInfo {
  return SESSIONS.find(s => s.id === id) ?? SESSIONS[0];
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

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  priceRupees: number;
  category: "coffee" | "food";
  /** Food items only exist for one session. Coffee has no session restriction (capped per-session instead). */
  session?: SessionId;
}

export const MENU_ITEMS: MenuItem[] = [
  { id: "hot-americano",  name: "Hot Americano",  description: "Espresso, hot water.",           priceRupees: 200, category: "coffee" },
  { id: "hot-latte",      name: "Hot Latte",      description: "Espresso, steamed milk.",        priceRupees: 200, category: "coffee" },
  { id: "iced-americano", name: "Iced Americano", description: "Espresso, water, served over ice.", priceRupees: 200, category: "coffee" },
  { id: "iced-latte",     name: "Iced Latte",     description: "Espresso, cold milk, served over ice.", priceRupees: 200, category: "coffee" },
  { id: "toast-cookie",   name: "Sourdough Guacamole Toast + Oat-Raisin Cookie", description: "Eggless.", priceRupees: 300, category: "food", session: "oct10-evening" },
  { id: "toast-teacake",  name: "Sourdough Guacamole Toast + Almond Teacake",    description: "Eggless.", priceRupees: 300, category: "food", session: "oct11-morning" },
];

/** Caps — coffee is one shared pool across all 4 drinks per session; each food item has its own pool. */
export const CAPS = {
  coffeePerSession: 380,
  foodPerItem: 200,
};

export function getMenuItem(id: string): MenuItem | undefined {
  return MENU_ITEMS.find(i => i.id === id);
}

/** Items orderable for a given session — all coffee + that session's one food item. */
export function itemsForSession(session: SessionId): MenuItem[] {
  return MENU_ITEMS.filter(i => i.category === "coffee" || i.session === session);
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
  category: "coffee" | "food";
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
 * Promo rule: the N (= COFFEE_PROMO.freeUnits) CHEAPEST individual units across
 * the whole cart are free — deterministic regardless of cart/add order, and
 * resolves in the customer's favour (avoids counter disputes at the event).
 * Session eligibility (does this food item belong to this session?) and
 * capacity caps are NOT checked here — that needs a DB read, so it happens
 * in the create-order route, which also owns the authoritative item lookup.
 *
 * This module is imported by the CLIENT page for the live cart preview, so
 * everything exported from here ships in the public JS bundle — do NOT add
 * the internal RUPEE1 test-code logic here (see lib/sotsCoffeeServer.ts,
 * which is server-only and applies that override on top of this function).
 */
export function priceOrder(cart: CartLine[], couponCode?: string): PricedOrder {
  const resolved = cart
    .map(line => {
      const item = getMenuItem(line.id);
      return item ? { id: item.id, name: item.name, category: item.category, unitPriceRupees: item.priceRupees, qty: Math.max(1, Math.floor(line.qty)) } : null;
    })
    .filter((l): l is { id: string; name: string; category: "coffee" | "food"; unitPriceRupees: number; qty: number } => l !== null);

  const normalizedCode = couponCode?.trim().toUpperCase();
  const promoApplied = normalizedCode === COFFEE_PROMO.code;
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
      id: l.id, qty: l.qty, name: l.name, category: l.category, unitPriceRupees: l.unitPriceRupees,
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
