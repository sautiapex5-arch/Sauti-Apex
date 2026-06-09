# Deployment

This project is intended to run on Vercel as a TanStack Start app with server
functions. It is not a plain static Vite site.

If the live custom domain shows:

```text
Index of /
Proudly Served by LiteSpeed Web Server
```

the request is not being served by the Vercel deployment. That page is generated
by a LiteSpeed web server, usually from a cPanel/hosting account or a misrouted
custom domain.

## Build

```bash
npm install
npm run build
```

Vercel should run this build from the repository and serve the generated server
bundle automatically.

## Vercel custom domain checklist

1. In Vercel, open the project and confirm
   `sautiapex.sautiyamkenya.co.ke` is assigned to this exact project.
2. In the DNS provider for `sautiyamkenya.co.ke`, make sure the subdomain record
   matches the value Vercel shows in the Domains tab.
3. Remove any old cPanel/LiteSpeed records for the same hostname.
4. In Supabase Auth, make sure the Site URL and Redirect URLs use the same
   working Vercel custom domain or the working `.vercel.app` deployment URL.

When the domain is routed correctly, responses should come from Vercel, not a
LiteSpeed directory index.
