# RFC and standards audit

This file records the standards assumptions used by the scaffold.

## Stable core

### DNSSEC records

Use RFC 4034 as the base for DNSKEY, DS, RRSIG, and NSEC formatting and DS/key-tag derivation. The scaffold implements DNSKEY parsing, DNSKEY RDATA construction, key-tag computation, canonical owner-name encoding, and DS digest construction.

### DS digest

Use digest type 2, SHA-256, as the default DS digest. SHA-256 DS is the conservative default. Digest type 4, SHA-384, is structurally supported in the helper and can be exposed later.

### TLSA / DANE

Use RFC 6698 plus RFC 7671. The scaffold defaults to:

```zone
TLSA 3 1 1 <spki-sha256>
```

That is DANE-EE, selector SPKI, matching SHA-256.

### Internationalized domain names

Use IDNA2008 as the standards anchor:

- RFC 5890 for definitions and the IDNA document framework.
- RFC 5891 for the IDNA protocol.
- RFC 5892 for IDNA code point tables.
- RFC 5893 for right-to-left label rules.
- RFC 5894 for rationale and registry guidance.
- RFC 3492 for Punycode A-label encoding.
- Unicode UTS #46 for compatibility mapping behavior used by browsers and URL implementations.

The app accepts Unicode domain input when it can be converted by the runtime URL implementation, then emits DNS owner names in ASCII A-label form. See [Internationalization standards](I18N_STANDARDS.md).

### UI localization

The app localizes the UI shell with a static translation table plus a result-localization pass. Localized text covers field labels, short help, status labels, notices, generated guidance, output explanations, FAQ text, and field-level "How to get this" guidance. Generated DNS records, command snippets, JSON, and protocol keywords are not translated.

## Future-proofing decisions

1. Keep usage/selector/matching fields in the model even though the UI defaults to `3 1 1`.
2. Keep digest type as a typed option and avoid SHA-1 generation.
3. Do not hard-code RSA assumptions. DNSSEC algorithm number is preserved from the DNSKEY input.
4. Warn when a DNSKEY does not look like a normal KSK/SEP key, but do not block advanced users.
5. Make HNS parent output separate from ICANN registrar output. HNS resource records are not normal registrar UI fields.
6. Keep server presets small. DNS server installation and service management are OS-specific.
7. Treat live validation as a future phase. The first production scaffold is deterministic and offline.
8. Treat certificate/key rollover as a future phase. The UI should eventually support current + next TLSA records so users can rotate keys without outage.
9. Keep Unicode labels out of generated DNS text. DNS output, verification commands, wallet fields, registrar fields, and server presets use A-labels.

## Next RFC features to consider

- SMTP DANE mode and MX-derived TLSA owner names.
- TLSA with SRV records.
- SVCB/HTTPS and DANE-adjacent service binding work if browser bootstrap grows toward HTTP/3.
- CDS/CDNSKEY automation for future parent DS update workflows.
- EAI/SMTPUTF8 support if mail presets are added. Track RFC 6530, RFC 6531, RFC 6532, and RFC 6533.

## Explicitly deferred

- Full DNSSEC zone signing.
- Authoritative server management.
- Live resolver validation.
- HNS proof verification.
- Automatic wallet or registrar updates.
- Private-key persistence.
- Registry-specific IDN policy checks.
- Confusable-character warnings.
