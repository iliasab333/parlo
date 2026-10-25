#!/usr/bin/env bash
#
# Point Lingora at a domain you have just bought.
#
#   ./scripts/switch-domain.sh practicewithnatives.com
#
# Three things have to agree or the site half-works in ways that are
# easy to miss:
#
#   1. Vercel has to serve the domain       (otherwise: SSO redirect)
#   2. NEXT_PUBLIC_SITE_URL has to match    (otherwise: canonical tags
#      point at the old domain and the new one never gets indexed)
#   3. ALLOWED_ORIGINS on Render has to     (otherwise: every page
#      include it                            returns 200 and the chat
#                                            silently 403s)
#
# Steps 1 and 2 are automated here. Step 3 is a Render dashboard edit:
# the free plan has no API key and the connection is read-only.

set -euo pipefail

DOMAIN="${1:-}"
if [[ -z "$DOMAIN" ]]; then
  echo "uso: $0 <dominio>   p.ej. $0 practicewithnatives.com" >&2
  exit 1
fi

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

say() { printf '\n\033[1m%s\033[0m\n' "$*"; }

say "1/4  Comprobando que el dominio es tuyo en Vercel"
if ! npx --yes vercel domains ls 2>/dev/null | grep -q "$DOMAIN"; then
  echo "  '$DOMAIN' no aparece entre tus dominios."
  echo "  Cómpralo primero:  npx vercel domains buy $DOMAIN"
  exit 1
fi
echo "  ✓ encontrado"

say "2/4  Asignándolo al proyecto"
npx --yes vercel domains add "$DOMAIN" parlo 2>&1 | tail -1 || true

say "3/4  Fijando el canonical y redesplegando la web"
npx --yes vercel env rm NEXT_PUBLIC_SITE_URL production --yes >/dev/null 2>&1 || true
printf 'https://%s' "$DOMAIN" | npx --yes vercel env add NEXT_PUBLIC_SITE_URL production
npx --yes vercel deploy --prod

# Keep the repo in step with reality, so the next person reading
# render.yaml sees the origins that are actually allowed.
ORIGINS="https://${DOMAIN},https://golingora.vercel.app,https://parlo-seven.vercel.app"
python3 - "$ORIGINS" <<'PY'
import pathlib, re, sys
origins = sys.argv[1]
p = pathlib.Path('render.yaml'); s = p.read_text()
s = re.sub(r'(- key: ALLOWED_ORIGINS\n\s*value: ).*', lambda m: m.group(1) + origins, s, count=1)
p.write_text(s)
print(f"  render.yaml actualizado")
PY

say "4/4  PASO MANUAL — el chat da 403 hasta que lo hagas"
cat <<EOF
  Render no permite escribir variables sin API key, así que este queda
  para ti. Son 30 segundos:

    1. https://dashboard.render.com/web/srv-dbes3tlg1s2s73dkj8eg/env
    2. Edit -> ALLOWED_ORIGINS -> pega esto:

       ${ORIGINS}

    3. "Save, rebuild, and deploy"

  Luego comprueba que el emparejamiento funciona de verdad:

    node scripts/verify-domain.mjs ${DOMAIN}
EOF
