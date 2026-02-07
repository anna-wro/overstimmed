/**
 * Shared layout and email definitions for Supabase Auth templates.
 * Generated files preserve Go template vars (e.g. {{ .ConfirmationURL }}) for Supabase.
 */

/** Colors (match app palette: tailwind lavender/sand). */
const COLORS = {
  background: '#f9f7f4',
  card: '#ffffff',
  brand: '#7c3aed',
  heading: '#302319',
  body: '#5a453a',
  footer: '#85634f',
  codeBg: '#f0ebe3',
} as const;

export interface EmailDef {
  output: string;
  pageTitle: string;
  /** Defaults to pageTitle if omitted. */
  heading?: string;
  body: string;
}

const LAYOUT_TOP = (pageTitle: string): string => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${pageTitle}</title>
</head>
<body style="margin: 0; padding: 24px; background-color: ${COLORS.background}; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 400px; margin: 0 auto; background-color: ${COLORS.card}; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); padding: 32px;">
    <p style="margin: 0 0 24px; font-size: 48px; font-weight: 700; letter-spacing: -0.025em; color: ${COLORS.brand};">Overstimmed</p>
`;

const BUTTON_STYLE = `display: inline-block; padding: 10px 20px; background-color: ${COLORS.brand}; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 500; border-radius: 8px;`;
const FOOTER_STYLE = `margin: 24px 0 0; font-size: 13px; color: ${COLORS.footer};`;
const H2_STYLE = `margin: 0 0 16px; font-size: 20px; font-weight: 600; color: ${COLORS.heading};`;
const BODY_STYLE = `margin: 0 0 24px; font-size: 15px; line-height: 1.5; color: ${COLORS.body};`;

export const EMAILS: EmailDef[] = [
  {
    output: 'magic-link.html',
    pageTitle: 'Magic Link',
    body: `
    <p style="${BODY_STYLE}">Follow this link to log in:</p>
    <p style="margin: 0;">
      <a href="{{ .ConfirmationURL }}" style="${BUTTON_STYLE}">Log in</a>
    </p>
    <p style="${FOOTER_STYLE}">If you didn't request this link, you can ignore this email.</p>`,
  },
  {
    output: 'confirmation.html',
    pageTitle: 'Confirm your signup',
    body: `
    <p style="${BODY_STYLE}">Follow this link to confirm your account:</p>
    <p style="margin: 0;">
      <a href="{{ .ConfirmationURL }}" style="${BUTTON_STYLE}">Confirm your email</a>
    </p>
    <p style="${FOOTER_STYLE}">If you didn't sign up for Overstimmed, you can ignore this email.</p>`,
  },
  {
    output: 'email-change.html',
    pageTitle: 'Confirm change of email',
    body: `
    <p style="${BODY_STYLE}">Follow this link to confirm the update of your email from {{ .Email }} to {{ .NewEmail }}:</p>
    <p style="margin: 0;">
      <a href="{{ .ConfirmationURL }}" style="${BUTTON_STYLE}">Change email</a>
    </p>
    <p style="${FOOTER_STYLE}">If you didn't request this change, you can ignore this email.</p>`,
  },
  {
    output: 'recovery.html',
    pageTitle: 'Reset password',
    body: `
    <p style="${BODY_STYLE}">Follow this link to reset your password:</p>
    <p style="margin: 0;">
      <a href="{{ .ConfirmationURL }}" style="${BUTTON_STYLE}">Reset password</a>
    </p>
    <p style="${FOOTER_STYLE}">If you didn't request a password reset, you can ignore this email.</p>`,
  },
  {
    output: 'reauthentication.html',
    pageTitle: 'Confirm reauthentication',
    body: `
    <p style="margin: 0 0 12px; font-size: 15px; line-height: 1.5; color: #5a453a;">Enter the code:</p>
    <p style="margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.15em; font-family: ui-monospace, monospace; color: ${COLORS.heading}; background-color: ${COLORS.codeBg}; padding: 12px 16px; border-radius: 8px; display: inline-block;">{{ .Token }}</p>
    <p style="${FOOTER_STYLE}">If you didn't request this code, you can ignore this email.</p>`,
  },
];

export function buildHtml(email: EmailDef): string {
  const heading = email.heading ?? email.pageTitle;
  const content = `    <h2 style="${H2_STYLE}">${heading}</h2>${email.body}
  </div>`;
  return LAYOUT_TOP(email.pageTitle) + content + '\n</body>\n</html>';
}
