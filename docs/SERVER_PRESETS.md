# Server Presets

Presets are starter text, not a full DNS hosting system. The generated records remain the source of truth.

## Generic zone file

Use this when the admin will adapt the result to BIND, Knot, NSD, or a provider import tool.

## Hosted DNS provider panel

Good when the site already uses hosted DNS. The provider must support authoritative DNS hosting, DNSSEC signing, DS or DNSKEY export, and custom TLSA records.

## PowerDNS Authoritative

Good for database/API workflows. Create the zone, add NS/A/AAAA/TLSA records, enable DNSSEC, then publish the DS at the parent.

## Knot DNS

Good modern default when the admin wants automatic signing with concise config.

## BIND 9

Useful when the admin is already on a standard Linux DNS stack or needs abundant documentation.

## NSD

Useful for a small authoritative server. Sign the zone externally, then serve the signed zone.
