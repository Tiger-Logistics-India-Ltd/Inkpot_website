import { Resend } from "resend";
import QRCode from "qrcode";

let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY!);
  return _resend;
}

interface TicketEmailParams {
  to: string;
  buyerName: string;
  ticketNumber: number;
  seatNumbers: number[];
  qty: number;
  ticketId: string;
  amount: number;
  siteUrl: string;
  mealPreferences?: string[];
}

export async function sendTicketConfirmation({
  to,
  buyerName,
  ticketNumber,
  seatNumbers,
  qty,
  ticketId,
  amount,
  siteUrl,
  mealPreferences = [],
}: TicketEmailParams): Promise<void> {
  // Generate QR as a PNG buffer — embedded as inline CID attachment so it
  // renders in Gmail (which strips data: URIs) and every other client.
  const qrBuffer = await QRCode.toBuffer(`${siteUrl}/ticket/${ticketId}`, {
    width: 400,
    margin: 2,
    color: { dark: "#1a1a1a", light: "#ffffff" },
  });
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const numPadded  = String(ticketNumber).padStart(4, "0");
  const seatsLabel = qty > 1
    ? seatNumbers.map(n => `TLT-${String(n).padStart(4, "0")}`).join(", ")
    : `TLT-${numPadded}`;
  const amountFormatted = `₹${(amount / 100).toLocaleString("en-IN")}`;

  const mealLabel = (m: string): string => m === "veg" ? "Vegetarian" : "Non-Vegetarian";
  const mealsRow = mealPreferences.length > 0
    ? `
          <!-- Meal Preferences -->
          <tr>
            <td style="padding:16px 48px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F4EFE6;padding:16px 28px;">
                <tr>
                  <td>
                    <span style="font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(0,0,0,0.4);display:block;margin-bottom:8px;">Meal Preference${qty > 1 ? "s" : ""}</span>
                    ${qty === 1
                      ? `<span style="font-size:13px;color:#1a1a1a;">${mealLabel(mealPreferences[0] ?? "non-veg")}</span>`
                      : mealPreferences.map((m, i) => `<span style="font-size:12px;color:#1a1a1a;display:block;line-height:1.9;">Guest ${i + 1}: ${mealLabel(m)}</span>`).join("")
                    }
                  </td>
                </tr>
              </table>
            </td>
          </tr>`
    : "";

  await getResend().emails.send({
    from: "Inkpot India <tickets@tickets.inkpotindia.com>",
    to,
    subject: `Your Seat at The Living Table — 28th June`,
    attachments: [
      {
        filename: "entry-qr.png",
        content: qrBuffer,
        content_type: "image/png",
      },
    ],
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Ticket — The Living Table</title>
</head>
<body style="margin:0;padding:0;background:#F4EFE6;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F4EFE6;padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#ffffff;border-top:3px solid #901A1C;">

          <!-- Header -->
          <tr>
            <td style="padding:48px 48px 0;text-align:center;">
              <p style="margin:0 0 6px;font-size:9px;letter-spacing:0.32em;text-transform:uppercase;color:#901A1C;">
                Inkpot India presents
              </p>
              <h1 style="margin:0 0 6px;font-size:32px;font-weight:400;color:#1a1a1a;font-style:italic;font-family:Georgia,serif;line-height:1.15;">
                The Living Table
              </h1>
              <p style="margin:0;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(0,0,0,0.4);">
                28th June, 2026 &nbsp;&middot;&nbsp; New Delhi
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:32px 48px 0;">
              <div style="height:1px;background:rgba(0,0,0,0.08);"></div>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:32px 48px 0;">
              <p style="margin:0 0 16px;font-size:15px;color:#1a1a1a;line-height:1.7;">
                Dear ${esc(buyerName)},
              </p>
              <p style="margin:0;font-size:14px;color:rgba(0,0,0,0.55);line-height:1.85;">
                Your booking is confirmed. We look forward to welcoming you to the table on 28th June.
              </p>
            </td>
          </tr>

          <!-- Ticket details -->
          <tr>
            <td style="padding:28px 48px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F4EFE6;padding:24px 28px;">
                <tr>
                  <td style="padding-top:0;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="width:50%;padding:4px 0;">
                          <span style="font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(0,0,0,0.4);display:block;margin-bottom:3px;">Date</span>
                          <span style="font-size:13px;color:#1a1a1a;">28th June, 2026</span>
                        </td>
                        <td style="width:50%;padding:4px 0;">
                          <span style="font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(0,0,0,0.4);display:block;margin-bottom:3px;">Time</span>
                          <span style="font-size:13px;color:#1a1a1a;">6:30 PM onwards</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${mealsRow}

          <!-- QR code -->
          <tr>
            <td style="padding:32px 48px 0;text-align:center;">
              <p style="margin:0 0 12px;font-size:9px;letter-spacing:0.26em;text-transform:uppercase;color:rgba(0,0,0,0.38);">
                Your entry QR code
              </p>
              <p style="margin:0 0 20px;font-size:13px;color:rgba(0,0,0,0.55);line-height:1.7;">
                Your QR code is <strong style="color:#1a1a1a;">attached to this email</strong> as <em>entry-qr.png</em>.<br />Open the attachment and show it at the door.
              </p>
              <a href="${siteUrl}/ticket/${ticketId}"
                style="display:inline-block;background:#901A1C;color:#ffffff;text-decoration:none;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;padding:14px 32px;">
                View My Ticket &rarr;
              </a>
              <p style="margin:16px 0 0;font-size:10px;color:rgba(0,0,0,0.35);letter-spacing:0.05em;">
                Opens your ticket page with a scannable QR code.
              </p>
            </td>
          </tr>

          <!-- Venue note -->
          <tr>
            <td style="padding:28px 48px 0;">
              <div style="border-left:2px solid #901A1C;padding-left:16px;">
                <p style="margin:0 0 6px;font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(0,0,0,0.4);">Venue</p>
                <p style="margin:0;font-size:13px;color:#1a1a1a;line-height:1.8;font-weight:500;">Kathika Cultural Centre</p>
                <p style="margin:4px 0 0;font-size:12px;color:rgba(0,0,0,0.5);line-height:1.7;">Gali Khatikan, Kucha Pati Ram<br />Sitaram Bazar, Delhi</p>
              </div>
            </td>
          </tr>

          <!-- Programme -->
          <tr>
            <td style="padding:32px 48px 0;">
              <p style="margin:0 0 20px;font-size:9px;letter-spacing:0.26em;text-transform:uppercase;color:rgba(0,0,0,0.38);">The Evening</p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid rgba(0,0,0,0.07);">
                    <span style="font-size:10px;color:rgba(0,0,0,0.38);letter-spacing:0.06em;font-weight:600;">6:30 PM</span>
                    <p style="margin:4px 0 0;font-size:13px;color:#1a1a1a;line-height:1.6;">Arrival &amp; Welcome</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid rgba(0,0,0,0.07);">
                    <span style="font-size:10px;color:rgba(0,0,0,0.38);letter-spacing:0.06em;font-weight:600;">7:00 PM</span>
                    <p style="margin:4px 0 0;font-size:13px;color:#1a1a1a;line-height:1.6;">A conversation tracing the journey of North Indian food through the lens of partition and memory, with Monish Gujral, Sadaf Hussain, and Salma Husain, moderated by Simar Malhotra.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid rgba(0,0,0,0.07);">
                    <span style="font-size:10px;color:rgba(0,0,0,0.38);letter-spacing:0.06em;font-weight:600;">8:00 PM</span>
                    <p style="margin:4px 0 0;font-size:13px;color:#1a1a1a;line-height:1.6;">The bar opens and the dining experience begins at Neem Ki Haveli.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;">
                    <span style="font-size:10px;color:rgba(0,0,0,0.38);letter-spacing:0.06em;font-weight:600;">10:00 PM</span>
                    <p style="margin:4px 0 0;font-size:13px;color:#1a1a1a;line-height:1.6;">The evening concludes.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:40px 48px 0;">
              <div style="height:1px;background:rgba(0,0,0,0.08);"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:28px 48px 40px;text-align:center;">
              <p style="margin:0 0 6px;font-size:12px;color:#1a1a1a;font-family:Georgia,serif;font-style:italic;">Inkpot India</p>
              <p style="margin:0 0 4px;font-size:11px;color:rgba(0,0,0,0.35);">
                Questions? <a href="mailto:info@inkpotindia.com" style="color:#901A1C;text-decoration:none;">info@inkpotindia.com</a>
              </p>
              <p style="margin:0;font-size:11px;color:rgba(0,0,0,0.35);">
                Sumeet (Manager) &nbsp;&middot;&nbsp; <a href="tel:+919953228456" style="color:#901A1C;text-decoration:none;">+91 99532 28456</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`,
  });
}
