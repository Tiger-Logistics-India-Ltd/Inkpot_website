// Short thank-you emails sent to the visitor after the contact form and the
// newsletter signup. Shared so both carry the same look and contact block.

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function autoReplyHtml({ title, greeting, paragraphs }: { title: string; greeting: string; paragraphs: string[] }): string {
  const body = paragraphs
    .map((p) => `<p style="margin:0 0 14px;font-size:14px;line-height:1.7;color:#444;">${p}</p>`)
    .join("\n");
  return `<!DOCTYPE html><html><body style="margin:0;padding:32px 16px;background:#F4EFE6;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:460px;background:#fff;border-top:3px solid #8B1E20;">
<tr><td style="padding:32px 36px 8px;">
<p style="margin:0 0 4px;font-size:9px;letter-spacing:0.3em;text-transform:uppercase;color:#8B1E20;">Inkpot India</p>
<h1 style="margin:0 0 20px;font-size:22px;font-weight:400;color:#1a1a1a;font-family:Georgia,serif;font-style:italic;">${esc(title)}</h1>
<p style="margin:0 0 14px;font-size:14px;line-height:1.7;color:#1a1a1a;">${esc(greeting)}</p>
${body}
</td></tr>
<tr><td style="padding:0 36px 8px;">
<p style="margin:0 0 4px;font-size:9px;letter-spacing:0.24em;text-transform:uppercase;color:#8B1E20;">Email</p>
<p style="margin:0 0 14px;font-size:14px;color:#1a1a1a;"><a href="mailto:info@inkpotindia.com" style="color:#1a1a1a;">info@inkpotindia.com</a></p>
<p style="margin:0 0 4px;font-size:9px;letter-spacing:0.24em;text-transform:uppercase;color:#8B1E20;">WhatsApp</p>
<p style="margin:0;font-size:14px;color:#1a1a1a;">Inkpot India &middot; <a href="https://wa.me/919205304666" style="color:#1a1a1a;">+91 92053 04666</a></p>
</td></tr>
<tr><td style="padding:24px 36px 32px;">
<p style="margin:0;font-size:14px;line-height:1.7;color:#444;">Warm regards,<br/>Team Inkpot India</p>
</td></tr></table></td></tr></table></body></html>`;
}
