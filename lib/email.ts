import { Resend } from "resend";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import { getEdition } from "@/lib/editions";

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
  /** Edition slug — selects date / venue / programme. Defaults to the inaugural edition. */
  edition?: string;
}

interface QrTestEmailParams {
  to: string;
  buyerName: string;
  ticketId: string;
  siteUrl: string;
}

export async function sendQrTest({ to, buyerName, ticketId, siteUrl }: QrTestEmailParams): Promise<void> {
  const qrBuffer = await QRCode.toBuffer(`${siteUrl}/ticket/${ticketId}`, {
    width: 500,
    margin: 3,
    color: { dark: "#000000", light: "#ffffff" },
  });
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const firstName = esc(buyerName.split(" ")[0]);
  const ticketUrl = `${siteUrl}/ticket/${ticketId}`;

  await getResend().emails.send({
    from: "Inkpot India <tickets@tickets.inkpotindia.com>",
    to,
    subject: "Scanner Test QR — The Living Table",
    attachments: [{ filename: "scan-test-qr.png", content: qrBuffer, contentType: "image/png" }],
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>Scanner Test QR</title></head>
<body style="margin:0;padding:0;background:#F4EFE6;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F4EFE6;padding:48px 16px;">
  <tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;background:#ffffff;border-top:3px solid #901A1C;">

      <tr><td style="padding:40px 40px 0;text-align:center;">
        <p style="margin:0 0 4px;font-size:9px;letter-spacing:0.32em;text-transform:uppercase;color:#901A1C;">Inkpot India · Admin</p>
        <h1 style="margin:0;font-size:22px;font-weight:400;color:#1a1a1a;font-family:Georgia,serif;font-style:italic;line-height:1.3;">Scanner Test QR</h1>
      </td></tr>

      <tr><td style="padding:28px 40px 0;">
        <div style="background:#F4EFE6;padding:16px 20px;">
          <p style="margin:0 0 4px;font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(0,0,0,0.4);">Ticket used for this test</p>
          <p style="margin:0;font-size:14px;color:#1a1a1a;">${firstName}</p>
        </div>
      </td></tr>

      <tr><td style="padding:28px 40px 0;text-align:center;">
        <p style="margin:0 0 16px;font-size:12px;color:rgba(0,0,0,0.5);line-height:1.6;">
          Open the attached <strong>scan-test-qr.png</strong> on one device,<br/>
          then scan it with the door scanner on another.
        </p>
        <a href="${ticketUrl}" style="display:inline-block;background:#901A1C;color:#ffffff;text-decoration:none;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;padding:13px 28px;">
          Open Ticket Page &rarr;
        </a>
        <p style="margin:14px 0 0;font-size:10px;color:rgba(0,0,0,0.3);word-break:break-all;">${ticketUrl}</p>
      </td></tr>

      <tr><td style="padding:32px 40px 40px;text-align:center;">
        <p style="margin:0;font-size:10px;color:rgba(0,0,0,0.3);">This is a test email from the Inkpot admin dashboard.</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`,
  });
}

interface GuidelinesEmailParams {
  to: string;
  buyerName: string;
  ticketId: string;
  siteUrl: string;
  /** Edition slug — selects date / venue. Defaults to the inaugural edition. */
  edition?: string;
}

export async function sendGuidelines({
  to,
  buyerName,
  ticketId,
  siteUrl,
  edition,
}: GuidelinesEmailParams): Promise<void> {
  const ev = getEdition(edition);
  const isInaugural = ev.slug === "june-2026";
  const qrBuffer = await QRCode.toBuffer(`${siteUrl}/ticket/${ticketId}`, {
    width: 400,
    margin: 2,
    color: { dark: "#1a1a1a", light: "#ffffff" },
  });
  const pdfBuffer = fs.readFileSync(
    path.join(process.cwd(), "public/images/thelivingtable/Guest_Guidelines-TheLivingTable.pdf")
  );
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const firstName = esc(buyerName.split(" ")[0]);
  const venueLine = `${esc(ev.venueName)}${ev.venueAddressLines.length ? `, ${esc(ev.venueAddressLines.join(", "))}` : ""}`;
  const mapSearch = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.mapQuery)}`;

  await getResend().emails.send({
    from: "Inkpot India <tickets@tickets.inkpotindia.com>",
    to,
    subject: `Guest Guidelines — ${ev.brand} · ${ev.dateLabel}`,
    attachments: [
      { filename: "Guest_Guidelines-TheLivingTable.pdf", content: pdfBuffer, contentType: "application/pdf" },
      { filename: "entry-qr.png", content: qrBuffer, contentType: "image/png" },
    ],
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1.0" /><title>Guest Guidelines — The Living Table</title></head>
<body style="margin:0;padding:0;background:#F4EFE6;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F4EFE6;padding:48px 16px;">
  <tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#ffffff;border-top:3px solid #901A1C;">

      <tr><td style="padding:48px 48px 0;text-align:center;">
        <p style="margin:0 0 6px;font-size:9px;letter-spacing:0.32em;text-transform:uppercase;color:#901A1C;">Inkpot India presents</p>
        <h1 style="margin:0 0 6px;font-size:32px;font-weight:400;color:#1a1a1a;font-style:italic;font-family:Georgia,serif;line-height:1.15;">${esc(ev.brand)}</h1>
        <p style="margin:0;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(0,0,0,0.4);">${esc(ev.dateLabel)} &nbsp;&middot;&nbsp; ${esc(ev.cityLabel)}</p>
      </td></tr>

      <tr><td style="padding:32px 48px 0;"><div style="height:1px;background:rgba(0,0,0,0.08);"></div></td></tr>

      <tr><td style="padding:32px 48px 0;">
        <p style="margin:0 0 24px;font-size:15px;color:#1a1a1a;line-height:1.7;">Dear ${firstName},</p>
        <p style="margin:0 0 18px;font-size:14px;color:rgba(0,0,0,0.72);line-height:1.85;">We look forward to welcoming you to ${esc(ev.brand)} on ${esc(ev.dateLabel)}, from ${esc(ev.timeLabel)} at ${venueLine}.</p>
        <p style="margin:0 0 18px;font-size:14px;color:rgba(0,0,0,0.72);line-height:1.85;">Please find the attached Guest Guidelines to help make your arrival and experience seamless and enjoyable.</p>
        <p style="margin:0 0 24px;font-size:14px;color:rgba(0,0,0,0.72);line-height:1.85;">Kindly keep your QR ticket handy at the front desk for a smooth check-in experience.</p>

        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F4EFE6;padding:20px 24px;margin-bottom:24px;">
          <tr><td>
            ${isInaugural
              ? `<p style="margin:0 0 10px;font-size:14px;color:rgba(0,0,0,0.72);line-height:1.85;">Location Pin: <a href="https://www.google.com/maps/place/28%C2%B038'46.0%22N+77%C2%B013'38.8%22E/@28.6461,77.227438,17z" style="color:#901A1C;text-decoration:underline;">https://www.google.com/maps/place/28%C2%B038'46.0%22N+77%C2%B013'38.8%22E/@28.6461,77.227438,17z</a></p>
            <p style="margin:0;font-size:14px;color:rgba(0,0,0,0.72);line-height:1.85;">Parking Pin: <a href="https://www.google.com/maps/place/28%C2%B038'35.3%22N+77%C2%B013'40.1%22E" style="color:#901A1C;text-decoration:underline;">https://www.google.com/maps/place/28%C2%B038'35.3%22N+77%C2%B013'40.1%22E</a></p>`
              : `<p style="margin:0 0 6px;font-size:14px;color:#1a1a1a;line-height:1.85;font-weight:600;">${esc(ev.venueName)}</p>
            <p style="margin:0 0 10px;font-size:14px;color:rgba(0,0,0,0.72);line-height:1.85;">${esc(ev.venueAddressLines.join(", "))}</p>
            <p style="margin:0;font-size:14px;color:rgba(0,0,0,0.72);line-height:1.85;">Map &amp; directions: <a href="${mapSearch}" style="color:#901A1C;text-decoration:underline;">${mapSearch}</a></p>`}
          </td></tr>
        </table>

        <p style="margin:0 0 24px;font-size:14px;color:rgba(0,0,0,0.72);line-height:1.85;">For any assistance, feel free to reach us at ${isInaugural
          ? `<a href="tel:+918700730130" style="color:#901A1C;text-decoration:none;">+91 8700730130</a>`
          : `<a href="mailto:info@inkpotindia.com" style="color:#901A1C;text-decoration:none;">info@inkpotindia.com</a>`}</p>
        <p style="margin:0 0 4px;font-size:14px;color:rgba(0,0,0,0.72);line-height:1.85;">Warm regards,</p>
        <p style="margin:0;font-size:15px;color:#1a1a1a;font-family:Georgia,serif;font-style:italic;">Inkpot India</p>
      </td></tr>

      <tr><td style="padding:40px 48px 0;"><div style="height:1px;background:rgba(0,0,0,0.08);"></div></td></tr>

      <tr><td style="padding:28px 48px 40px;text-align:center;">
        <p style="margin:0 0 6px;font-size:12px;color:#1a1a1a;font-family:Georgia,serif;font-style:italic;">Inkpot India</p>
        <p style="margin:0;font-size:11px;color:rgba(0,0,0,0.35);">Questions? <a href="mailto:info@inkpotindia.com" style="color:#901A1C;text-decoration:none;">info@inkpotindia.com</a></p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`,
  });
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
  edition,
}: TicketEmailParams): Promise<void> {
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const ev = getEdition(edition);
  const venueHtml = ev.venueAddressLines.map(esc).join("<br />");
  const programmeRows = ev.programme
    .map(
      (p, i) => `
                <tr>
                  <td style="padding:12px 0;${i < ev.programme.length - 1 ? "border-bottom:1px solid rgba(0,0,0,0.07);" : ""}">
                    <span style="font-size:10px;color:rgba(0,0,0,0.38);letter-spacing:0.06em;font-weight:600;">${esc(p.title)}</span>
                    ${p.body ? `<p style="margin:4px 0 0;font-size:13px;color:#1a1a1a;line-height:1.6;">${esc(p.body)}</p>` : ""}
                  </td>
                </tr>`,
    )
    .join("");
  const presentedByHtml = ev.presentedBy
    ? `<p style="margin:6px 0 0;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(0,0,0,0.35);">In Association with ${esc(ev.presentedBy)}</p>`
    : "";

  // Generate QR as a PNG buffer — embedded as inline CID attachment so it
  // renders in Gmail (which strips data: URIs) and every other client.
  const qrBuffer = await QRCode.toBuffer(`${siteUrl}/ticket/${ticketId}`, {
    width: 400,
    margin: 2,
    color: { dark: "#1a1a1a", light: "#ffffff" },
  });
  const numPadded  = String(ticketNumber).padStart(4, "0");
  const seatsLabel = qty > 1
    ? seatNumbers.map(n => `TLT-${String(n).padStart(4, "0")}`).join(", ")
    : `TLT-${numPadded}`;
  const amountFormatted = `₹${(amount / 100).toLocaleString("en-IN")}`;

  await getResend().emails.send({
    from: "Inkpot India <tickets@tickets.inkpotindia.com>",
    to,
    subject: `Your Seat at ${ev.brand} — ${ev.dateLabel}`,
    attachments: [
      {
        filename: "entry-qr.png",
        content: qrBuffer,
        contentType: "image/png",
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
              <h1 style="margin:0 0 4px;font-size:32px;font-weight:400;color:#1a1a1a;font-style:italic;font-family:Georgia,serif;line-height:1.15;">
                ${esc(ev.brand)}
              </h1>
              <p style="margin:0 0 10px;font-size:15px;color:rgba(0,0,0,0.6);font-family:Georgia,serif;">
                ${esc(ev.editionTitle)}
              </p>
              <p style="margin:0;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(0,0,0,0.4);">
                ${esc(ev.dateLabel)} &nbsp;&middot;&nbsp; ${esc(ev.cityLabel)}
              </p>
              ${presentedByHtml}
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
              <p style="margin:0 0 14px;font-size:14px;color:rgba(0,0,0,0.55);line-height:1.85;">
                Your booking is confirmed. We look forward to welcoming you to the table on ${esc(ev.dateLabel)}.
              </p>
              ${ev.tagline ? `<p style="margin:0;font-size:14px;color:rgba(0,0,0,0.55);line-height:1.85;font-style:italic;font-family:Georgia,serif;">${esc(ev.tagline)}</p>` : ""}
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
                          <span style="font-size:13px;color:#1a1a1a;">${esc(ev.dateLabel)}</span>
                        </td>
                        <td style="width:50%;padding:4px 0;">
                          <span style="font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(0,0,0,0.4);display:block;margin-bottom:3px;">Time</span>
                          <span style="font-size:13px;color:#1a1a1a;">${esc(ev.timeLabel)}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

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
                style="display:inline-block;background:#901A1C;color:#ffffff;text-decoration:none;font-size:13px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;padding:18px 48px;">
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
                <p style="margin:0;font-size:13px;color:#1a1a1a;line-height:1.8;font-weight:500;">${esc(ev.venueName)}</p>
                <p style="margin:4px 0 0;font-size:12px;color:rgba(0,0,0,0.5);line-height:1.7;">${venueHtml}</p>
              </div>
            </td>
          </tr>

          <!-- Programme -->
          <tr>
            <td style="padding:32px 48px 0;">
              <p style="margin:0 0 20px;font-size:9px;letter-spacing:0.26em;text-transform:uppercase;color:rgba(0,0,0,0.38);">The Evening</p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">${programmeRows}
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
