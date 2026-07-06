#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=test-lib.sh
source "$SCRIPT_DIR/test-lib.sh"

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
make_test_env "$tmp"
seed_config

"$TEST_ROOT/lib/configure-dnsdist.sh"

assert_file_contains 'newServer({address="127.0.0.1:53", name="knot-local"})' "$HNS_DANE_DNSDIST_CONF" "dnsdist forwards to Knot"
assert_file_contains 'addDOHLocal("127.0.0.1:8053", nil, nil, "/dns-query", { reusePort=true })' "$HNS_DANE_DNSDIST_CONF" "dnsdist DoH listener"
assert_file_contains "setACL({'127.0.0.0/8', '::1/128'})" "$HNS_DANE_DNSDIST_CONF" "dnsdist loopback ACL"

printf 'ok - dnsdist-config\n'
