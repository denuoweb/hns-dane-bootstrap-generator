#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=common.sh
source "$SCRIPT_DIR/common.sh"

configure_dnsdist() {
  require_root
  config_required

  ensure_dir 0755 "$(dirname "$HNS_DANE_DNSDIST_CONF")"
  cat > "$HNS_DANE_DNSDIST_CONF" <<EOF
-- Managed by hns-dane-appliance.
-- nginx terminates public HTTPS and forwards /dns-query to this loopback DoH listener.
setACL({'127.0.0.0/8', '::1/128'})
setSecurityPollSuffix("")

newServer({address="127.0.0.1:53", name="knot-local"})
addDOHLocal("$HNS_DANE_DNSDIST_LISTEN", nil, nil, "/dns-query", { reusePort=true })
EOF
  chmod 0644 "$HNS_DANE_DNSDIST_CONF"

  safe_systemctl enable dnsdist >/dev/null 2>&1 || true
  safe_systemctl restart dnsdist >/dev/null 2>&1 || true
  log "Configured dnsdist authoritative DoH listener at $HNS_DANE_DNSDIST_LISTEN."
}

if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
  configure_dnsdist "$@"
fi
