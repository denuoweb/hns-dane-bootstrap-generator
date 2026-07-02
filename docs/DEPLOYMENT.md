# Deployment

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm ci
npm test
npm run build
```

The static site is emitted to `dist/`.

## Static hosting

Deploy the `dist/` directory to any static host.

Required behavior:

- Serve `index.html`.
- Serve JavaScript and CSS assets.
- No backend is required.
- No secrets are required.

## Docker

```bash
docker build -t hns-dane-bootstrap-generator .
docker run --rm -p 8080:80 hns-dane-bootstrap-generator
```

Open `http://localhost:8080`.

## Security posture

- All generation runs in the browser.
- No private key is required.
- Pasted certificates and public keys are public material.
- DNSKEY is public DNSSEC material.
- The app does not submit wallet, registrar, or DNS updates.
- The app does not need analytics, accounts, or server storage.

## Suggested production headers

The included nginx config sets:

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: no-referrer`
- `Permissions-Policy: clipboard-write=(self)`

A stricter CSP can be added once the final hosting path and build asset names are known.
