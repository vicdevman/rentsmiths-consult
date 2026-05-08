import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

// sanitize user input for safe HTML embedding
const escapeHtml = (unsafe = "") =>
  String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const ContactSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  message: z.string().min(1).max(5000),
  phone: z.string().max(50).optional().or(z.literal("")),
  interest: z.string().max(120).optional().or(z.literal("")),
});

type ContactPayload = z.infer<typeof ContactSchema>;

function getAdminEmailTemplate(p: ContactPayload) {
  const safeName = escapeHtml(p.name);
  const safeEmail = escapeHtml(p.email);
  const safePhone = escapeHtml(p.phone || "");
  const safeInterest = escapeHtml(p.interest || "");
  const safeMessage = escapeHtml(p.message).replace(/\n/g, "<br />");

  const details = [
    `<tr><td style="padding:8px 0;color:#6b6257;font-size:12px;letter-spacing:.12em;text-transform:uppercase;width:110px;">Name: </td><td style="padding:8px 0;color:#6b6257;font-size:14px;">${safeName}</td></tr>`,
    `<tr><td style="padding:8px 0;color:#6b6257;font-size:12px;letter-spacing:.12em;text-transform:uppercase;">Email: </td><td style="padding:8px 0;color:#6b6257;font-size:14px;">${safeEmail}</td></tr>`,
    ...(safePhone ? [`<tr><td style="padding:8px 0;color:#6b6257;font-size:12px;letter-spacing:.12em;text-transform:uppercase;">Phone: </td><td style="padding:8px 0;color:#6b6257;font-size:14px;">${safePhone}</td></tr>`] : []),
    ...(safeInterest ? [`<tr><td style="padding:8px 0;color:#6b6257;font-size:12px;letter-spacing:.12em;text-transform:uppercase;">Interest: </td><td style="padding:8px 0;color:#6b6257;font-size:14px;">${safeInterest}</td></tr>`] : []),
  ].join("");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>New contact submission</title>
  </head>
  <body style="margin:0;padding:0;background:#f7f3ea;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f7f3ea;border-collapse:collapse;">
      <tr>
        <td align="center" style="padding:28px 12px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:680px;border-collapse:collapse;">
            <tr>
              <td style="background:#14110d;border-radius:20px;padding:22px 22px 20px;">
                <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial;color:#ffffff;">
                  <div style="font-size:12px;letter-spacing:.16em;text-transform:uppercase;opacity:.78;">Rentsmiths Consult</div>
                  <div style="margin-top:8px;font-size:22px;line-height:1.2;font-weight:800;">New contact submission</div>

                  <div style="height:14px;"></div>

                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:separate;border-spacing:0;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.10);border-radius:16px;">
                    <tr>
                      <td style="padding:16px 16px 10px;">
                        <div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;opacity:.78;">Contact details</div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:0 16px 16px;">
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
                          ${details}
                        </table>
                      </td>
                    </tr>
                  </table>

                  <div style="height:16px;"></div>

                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:separate;border-spacing:0;background:#ffffff;border-radius:16px;">
                    <tr>
                      <td style="padding:16px 16px 10px;">
                        <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#6b6257;">Message</div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:0 16px 16px;">
                        <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial;font-size:14px;line-height:1.7;color:#14110d;">${safeMessage}</div>
                      </td>
                    </tr>
                  </table>

                  <div style="height:16px;"></div>

                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
                    <tr>
                      <td style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial;font-size:12px;line-height:1.6;color:rgba(255,255,255,.78);">
                        Reply directly to
                        <span style="color:#ffffff;font-weight:700;">${safeEmail}</span>
                        to continue.
                      </td>
                    </tr>
                  </table>
                </div>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:14px 6px 0;">
                <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial;font-size:12px;line-height:1.6;color:#6b6257;opacity:.9;">
                  Generated from your website contact form.
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function getUserEmailTemplate(p: ContactPayload) {
  const safeName = escapeHtml(p.name);
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>We got your message</title>
  </head>
  <body style="margin:0;padding:0;background:#f7f3ea;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f7f3ea;border-collapse:collapse;">
      <tr>
        <td align="center" style="padding:28px 12px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:680px;border-collapse:collapse;">
            <tr>
              <td style="background:#ffffff;border:1px solid rgba(0,0,0,.08);border-radius:20px;padding:22px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
                  <tr>
                    <td>
                      <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial;">
                        <div style="display:flex;align-items:center;gap:12px;">
                          <span style="display:inline-block;height:40px;width:40px;border-radius:999px;background:#14110d;color:#ffffff;text-align:center;line-height:40px;font-weight:800;margin-right:10px;">R</span>
                          <div>
                            <div style="font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#6b6257;">Rentsmiths Consult</div>
                            <div style="margin-top:4px;font-size:16px;font-weight:800;color:#14110d;">Message received</div>
                          </div>
                        </div>

                        <div style="height:14px;"></div>

                        <h1 style="margin:0;font-size:22px;line-height:1.2;color:#14110d;">Thanks for reaching out, ${safeName}.</h1>
                        <p style="margin:10px 0 0;font-size:14px;line-height:1.75;color:#4b433a;">
                          We’ve received your message and a consultant will reply within one business day.
                        </p>

                        <div style="height:16px;"></div>

                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:separate;border-spacing:0;background:#f7f3ea;border-radius:16px;">
                          <tr>
                            <td style="padding:16px;">
                              <div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#6b6257;">What happens next</div>
                              <div style="height:8px;"></div>
                              <ol style="margin:0;padding-left:18px;color:#4b433a;font-size:14px;line-height:1.75;">
                                <li>We review your goals.</li>
                                <li>We reply with clear next steps and (if needed) a call time.</li>
                                <li>You get a plan you can act on immediately.</li>
                              </ol>
                            </td>
                          </tr>
                        </table>

                        <div style="height:16px;"></div>

                        <p style="margin:0;font-size:12px;line-height:1.7;color:#6b6257;">
                          If your request is urgent, reply to this email and we’ll prioritize it.
                        </p>

                        <div style="height:16px;"></div>

                        <div style="border-top:1px solid rgba(0,0,0,.08);padding-top:14px;font-size:12px;line-height:1.6;color:#6b6257;">
                          Rentsmiths Consult • Global education & career support
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function POST(request: NextRequest) {
  try {
    const raw = (await request.json()) as unknown;
    const parsed = ContactSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }
    const payload = parsed.data;

    const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, SMTP_FROM, ADMIN_EMAIL } = process.env;
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM || !ADMIN_EMAIL) {
      return NextResponse.json({ error: "Server email is not configured" }, { status: 500 });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number.parseInt(SMTP_PORT, 10),
      secure: SMTP_SECURE === "true",
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    // Send email to admin
    await transporter.sendMail({
      from: `"Rentsmiths Contact" <${SMTP_FROM}>`,
      to: ADMIN_EMAIL,
      replyTo: payload.email,
      subject: `New contact form submission from ${payload.name}`,
      html: getAdminEmailTemplate(payload),
    });

    // Send confirmation email to user
    await transporter.sendMail({
      from: `"Rentsmiths Consult" <${SMTP_FROM}>`,
      to: payload.email,
      subject: "Thanks for reaching out!",
      html: getUserEmailTemplate(payload),
    });

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }
}
