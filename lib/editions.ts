/**
 * The Living Table — per-edition configuration.
 *
 * One shared `living_table_tickets` table serves every edition; rows carry an
 * `edition` column (see supabase/migrations/20260909_add_edition.sql). Every
 * ticket route resolves an edition here and scopes its queries by it, so price,
 * capacity and the sold-out gate are defined ONCE, in this file.
 *
 * This module is plain data — safe to import from both server routes and client
 * components (the event page reads the same venue/date/programme it emails).
 */

export type EditionSlug = "june-2026" | "lost-grains-of-india";

export interface Edition {
  slug: EditionSlug;

  /* ── Commerce (authoritative — the payment path reads these) ── */
  pricePaise: number;      // per seat, in paise
  priceRupees: number;     // convenience for display, must equal pricePaise / 100
  maxTickets: number;      // sell-out point (paid + pending, non-archived)
  maxPerEmail: number;     // per-buyer seat cap across all their orders
  soldOut: boolean;        // hard gate — true short-circuits count + create-order

  /* ── Identity / display / email ── */
  brand: string;           // "The Living Table"
  editionTitle: string;    // "Lost Grains of India" / "The Inaugural Edition"
  tagline?: string;        // one-line description, used in the confirmation email
  presentedBy?: string;    // sponsor credit; rendered as "In Association with <this>"

  dateLabel: string;       // "26th September, 2026"
  dayLabel: string;        // "Saturday"
  timeLabel: string;       // "6:30 PM onwards"
  cityLabel: string;       // "New Delhi"

  venueName: string;
  venueAddressLines: string[];
  mapQuery: string;        // fed to a keyless Google Maps embed / link

  /** Order of the evening. `title` is the line's label (a time, or a segment name); `body` is the optional description. */
  programme: { title: string; body?: string }[];

  /** Path to the live booking page (for links in email etc.). */
  path: string;
}

export const EDITIONS: Record<EditionSlug, Edition> = {
  /* ── Inaugural edition — FROZEN. Event is past, bookings closed.
        Do not change these values; the archive page + its routes depend on
        the behaviour being byte-identical to before the edition refactor. ── */
  "june-2026": {
    slug: "june-2026",
    pricePaise: 650000,
    priceRupees: 6500,
    maxTickets: 30,
    maxPerEmail: 8,
    soldOut: true,
    brand: "The Living Table",
    editionTitle: "The Inaugural Edition",
    dateLabel: "28th June, 2026",
    dayLabel: "Sunday",
    timeLabel: "6:30 PM onwards",
    cityLabel: "New Delhi",
    venueName: "Kathika Cultural Centre",
    venueAddressLines: ["Gali Khatikan, Kucha Pati Ram", "Sitaram Bazar, Delhi"],
    mapQuery: "Kathika Cultural Centre, Sitaram Bazar, Delhi",
    programme: [
      { title: "6:30 PM", body: "Arrival & Welcome" },
      {
        title: "7:00 PM",
        body:
          "A conversation tracing the journey of North Indian food through the lens of partition and memory, with Monish Gujral, Sadaf Hussain, and Salma Husain, moderated by Simar Malhotra.",
      },
      { title: "8:00 PM", body: "The bar opens and the dining experience begins at Neem Ki Haveli." },
      { title: "10:00 PM", body: "The evening concludes." },
    ],
    path: "/the-living-table/archive/june-2026",
  },

  /* ── Chapter Two — LIVE, bookings open.
        Price ₹4,500, capacity 40, time, programme and sponsor are confirmed.
        Only the full street address of the venue is still to be confirmed. ── */
  "lost-grains-of-india": {
    slug: "lost-grains-of-india",
    pricePaise: 450000,
    priceRupees: 4500,
    maxTickets: 40,
    maxPerEmail: 8,
    soldOut: false,
    brand: "The Living Table",
    editionTitle: "Lost Grains of India",
    tagline: "A conversation on India’s food history, fusion music, a little mystery, and a table where the past finds a new expression.",
    presentedBy: "Dewar’s Experiences",
    dateLabel: "26th September, 2026",
    dayLabel: "Saturday",
    timeLabel: "6:30 PM onwards",
    cityLabel: "New Delhi",
    venueName: "Greenr Café",
    venueAddressLines: ["Greater Kailash 1", "New Delhi"], // TODO confirm full street address
    mapQuery: "Greenr Cafe, Greater Kailash 1, New Delhi",
    programme: [
      {
        title: "Fireside Chat — Lost Grains of India",
        body: "A conversation spanning the eating habits from the Indus Valley Civilisation to pre-Independent India and the grains finding their way back to our tables today.",
      },
      {
        title: "Fusion Music",
        body: "Indian sounds meeting contemporary influences through a live musical experience.",
      },
      {
        title: "Letters at the Table",
        body: "A small, unexpected prompt to open the evening and the conversation.",
      },
      {
        title: "Five-Course Dinner",
        body: "A contemporary, plant-led menu by Greenr Café, drawing from Indian grains and bringing them into a global culinary vocabulary.",
      },
      {
        title: "Dewar’s Curated Cocktails",
        body: "Two cocktails pairing and an open bar crafted to complement the evening.",
      },
    ],
    path: "/the-living-table/lost-grains-of-india",
  },
};

/** The edition assumed when a caller passes nothing (keeps legacy routes intact). */
export const DEFAULT_EDITION: EditionSlug = "june-2026";

export function isEditionSlug(v: unknown): v is EditionSlug {
  return typeof v === "string" && Object.prototype.hasOwnProperty.call(EDITIONS, v);
}

/** Resolve a slug to its config, falling back to the inaugural edition. */
export function getEdition(slug?: unknown): Edition {
  return isEditionSlug(slug) ? EDITIONS[slug] : EDITIONS[DEFAULT_EDITION];
}
