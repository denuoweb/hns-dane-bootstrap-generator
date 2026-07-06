# Deploy To denuoweb-vm

The public generator is deployed manually to the Google Cloud VM `denuoweb-vm` in zone `us-west1-b`.

Live URL:

```text
https://hns.denuoweb.com/dane-generator/
```

Remote web root:

```text
/var/www/denuoweb/dane-generator
```

Build locally:

```bash
npm run build
```

Deploy the contents of `dist/` to the VM web root, replacing old generated assets and keeping a timestamped backup on the VM first.

This repository intentionally does not use GitHub Actions for deployment. Do not add `.github/workflows/*`; deployment should stay explicit from the maintainer shell with `gcloud compute ssh` and `gcloud compute scp`.
