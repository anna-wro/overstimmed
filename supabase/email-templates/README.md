# Email templates

Source HTML for Supabase Auth email templates, styled to match the Overstimmed app (sand/lavender palette).

## Generating the HTML files

The layout (shell, “Overstimmed” title, card styles) and per-email content are defined in `shared.ts`. To regenerate all HTML files from that source:

```bash
npm run email-templates:generate
```

Or run the script directly (requires `tsx`):

```bash
npx tsx supabase/email-templates/generate.ts
```

Edit `shared.ts` to change copy, styles, or add templates; then run the generator again. Output is written to the `generated/` subfolder. The generated `.html` files keep Supabase’s Go template variables (e.g. `{{ .ConfirmationURL }}`). The script only overwrites a file when its content has changed.

### Adding a new template

1. In `shared.ts`, add a new object to the `EMAILS` array with `output`, `pageTitle`, and `body` (and optional `heading` if it should differ from the page title).
2. Run `npm run email-templates:generate`.
3. For local Supabase: add a corresponding `[auth.email.template.*]` block in `supabase/config.toml` with `subject` and `content_path = "./supabase/email-templates/generated/<output>"`.
4. For hosted Supabase: paste the new file from `generated/` into the matching Dashboard slot.

## Hosted Supabase

1. Open [Dashboard → Authentication → Email Templates](https://supabase.com/dashboard/project/_/auth/templates).
2. Paste each template from `generated/` into its Dashboard slot: `confirmation.html` → Confirm signup; `magic-link.html` → Magic Link; `email-change.html` → Change email address; `recovery.html` → Reset password; `reauthentication.html` → Reauthentication.
3. Set the subject for each if desired.

## Local Supabase (CLI)

Use `supabase/config.toml` and point `content_path` at the generated template file:

```toml
[auth.email.template.confirmation]
subject = "Confirm your signup"
content_path = "./supabase/email-templates/generated/confirmation.html"

[auth.email.template.magic_link]
subject = "Your magic link"
content_path = "./supabase/email-templates/generated/magic-link.html"

[auth.email.template.email_change]
subject = "Confirm change of email"
content_path = "./supabase/email-templates/generated/email-change.html"

[auth.email.template.recovery]
subject = "Reset password"
content_path = "./supabase/email-templates/generated/recovery.html"

[auth.email.template.reauthentication]
subject = "Confirm reauthentication"
content_path = "./supabase/email-templates/generated/reauthentication.html"
```

After changing templates, restart: `supabase stop && supabase start`.
