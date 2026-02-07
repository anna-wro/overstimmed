# Email templates

Source HTML for Supabase Auth email templates, styled to match the Overstimmed app (sand/lavender palette).

## Hosted Supabase

1. Open [Dashboard → Authentication → Email Templates](https://supabase.com/dashboard/project/_/auth/templates).
2. Paste each template into its Dashboard slot: `confirmation.html` → Confirm signup; `magic-link.html` → Magic Link; `email-change.html` → Change email address; `recovery.html` → Reset password; `reauthentication.html` → Reauthentication.
3. Set the subject for each if desired.

## Local Supabase (CLI)

Use `supabase/config.toml` and point `content_path` at the template file. Example for the confirmation template:

```toml
[auth.email.template.confirmation]
subject = "Confirm your signup"
content_path = "./supabase/email-templates/confirmation.html"

[auth.email.template.magic_link]
subject = "Your magic link"
content_path = "./supabase/email-templates/magic-link.html"

[auth.email.template.email_change]
subject = "Confirm change of email"
content_path = "./supabase/email-templates/email-change.html"

[auth.email.template.recovery]
subject = "Reset password"
content_path = "./supabase/email-templates/recovery.html"

[auth.email.template.reauthentication]
subject = "Confirm reauthentication"
content_path = "./supabase/email-templates/reauthentication.html"
```

After changing templates, restart: `supabase stop && supabase start`.
