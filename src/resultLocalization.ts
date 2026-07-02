import type { BootstrapInput, BootstrapNotice, BootstrapResult, DnsServerPreset, GeneratedLine, StatusCheck } from './core/types';
import type { LanguageCode } from './i18n';

type CoreCopy = {
  notices: Record<string, string>;
  statusDetails: Record<string, string>;
  explanations: Record<string, string>;
  quickSteps: {
    inline: string[];
    delegated: {
      server: string;
      dnssec: string;
      dsReady: string;
      dsMissing: string;
      tlsaReady: string;
      tlsaMissing: string;
      parentHns: string;
      parentIcann: string;
    };
  };
  webNotes: {
    serve: string;
    noPlugin: string;
  };
  verify: {
    hnsInline: string;
    expectedAddress: string;
    hnsFullChain: string;
  };
  fallbackNotice: string;
  fallbackStatusDetail: string;
  fallbackExplanation: string;
  helpTips: {
    fastPath: string;
    tlsaPin: string;
    parentSplit: string;
    idna: string;
    hnsGlue: (nameserver: string, domain: string) => string;
    hnsInline: string;
    preset: Record<DnsServerPreset, string>;
  };
};

const en: CoreCopy = {
  notices: {},
  statusDetails: {},
  explanations: {},
  quickSteps: {
    inline: [
      '1. Copy SYNTH4/SYNTH6 into the HNS wallet.',
      '2. Make the web server answer on that IP.',
      '3. Switch to delegated mode for DNSSEC/DANE.'
    ],
    delegated: {
      server: '1. Put the server records on the authoritative DNS server.',
      dnssec: '2. Enable DNSSEC signing on the zone.',
      dsReady: '3. Copy the DS into the wallet or registrar.',
      dsMissing: '3. Paste the DNSKEY here, then copy the generated DS into the wallet or registrar.',
      tlsaReady: '4. Serve the matching HTTPS certificate/key.',
      tlsaMissing: '4. Paste the leaf certificate or PUBLIC KEY to generate TLSA.',
      parentHns: '5. Submit the HNS name-resource update.',
      parentIcann: '5. Save registrar nameserver, glue, and DS settings.'
    }
  },
  webNotes: {
    serve: 'Serve the certificate whose public key matches the TLSA SPKI hash.',
    noPlugin: 'Nginx/Apache/Caddy do not need a DANE plugin; DANE lives in DNS.'
  },
  verify: {
    hnsInline: '# After the HNS update confirms, test with an HNS-aware resolver/browser.',
    expectedAddress: '# Expected address',
    hnsFullChain: '# For HNS full-chain tests, query through your HNS-aware resolver after the wallet update confirms.'
  },
  fallbackNotice: '',
  fallbackStatusDetail: '',
  fallbackExplanation: '',
  helpTips: {
    fastPath: 'Fastest reliable path: create the authoritative zone, enable DNSSEC signing, paste DNSKEY here, then copy the generated DS to the wallet or registrar.',
    tlsaPin: 'TLSA 3 1 1 pins the service public key with SHA-256. Certificate renewal can be easy if the server keeps the same keypair.',
    parentSplit: 'Parent records and server records are different. The wallet or registrar delegates. The DNS server publishes the site records and TLSA.',
    idna: 'Internationalized names are accepted as input, but DNS records use IDNA A-labels such as xn--bcher-kva.example.',
    hnsGlue: (nameserver, domain) => `For HNS delegated mode, GLUE4/GLUE6 is needed when the nameserver lives under the HNS name itself, such as ${nameserver} for ${domain}/.`,
    hnsInline: 'HNS inline mode is the simplest IP-only setup. Use delegated mode when you want DNSSEC and DANE.',
    preset: {
      'generic-zone': 'Generic zone-file output works with BIND, Knot, NSD, and many DNS hosting import tools.',
      'hosted-dns': 'Hosted DNS is the shortest path if your provider supports DNSSEC, custom DS export, and TLSA records.',
      powerdns: 'PowerDNS is a short path when you want an admin API or database-backed DNS.',
      knot: 'Knot DNS is a clean modern authoritative server with simple DNSSEC automation.',
      bind: 'BIND 9 is widely documented and package-manager friendly, but its config is more verbose.',
      nsd: 'NSD is small and reliable, but DNSSEC signing is usually handled by a separate signing step.'
    }
  }
};

const noticesEn = {
  invalidDomain: 'Domain format is not valid for DNS output.',
  idna: 'Internationalized domain input is converted to DNS ASCII A-labels such as xn--... in generated records.',
  ttl: 'TTL should normally be between 60 and 86400 seconds.',
  inlineIcann: 'Inline SYNTH mode is HNS-only. ICANN output uses delegated DNS.',
  websiteIpv4: 'Website IPv4 address is not valid.',
  websiteIpv6: 'Website IPv6 address is not valid.',
  nsIpv4: 'Nameserver IPv4 address is not valid.',
  nsIpv6: 'Nameserver IPv6 address is not valid.',
  nsMissing: 'Delegated mode needs a nameserver hostname.',
  nsInvalid: 'Nameserver hostname is not valid.',
  noWebsiteIp: 'No website A or AAAA address was supplied.',
  glueRequired: 'The nameserver is inside the same zone, so glue is required. Add at least one nameserver IP address.',
  tlsaNoDs: 'TLSA is generated, but DNSSEC is incomplete until you publish a parent-side DS record.',
  tlsaUsage: 'TLSA usage 3 is the default for this onboarding flow. Other usages are advanced and depend on CA/TA handling.',
  tlsaError: 'Unable to generate TLSA record.',
  dsError: 'Unable to generate DS record from DNSKEY input.',
  dnskeyProtocol: 'DNSKEY protocol is normally 3. Check that the DNSKEY line was pasted correctly.',
  dnskeySep: 'The DNSKEY does not have the SEP/KSK flag. DS records are normally made from the KSK.',
  dnskeySha1: 'This DNSKEY uses an older RSA/SHA-1 family algorithm. Prefer modern DNSSEC algorithms when the DNS server supports them.'
} as const;

const detailsEn = {
  domainOk: 'Domain is normalized for DNS output.',
  domainMissing: 'Enter the HNS name or ICANN domain.',
  websiteOk: 'A/AAAA output can be generated.',
  websiteMissing: 'Add at least one website IPv4 or IPv6 address.',
  inlineOk: 'Only SYNTH4/SYNTH6 wallet output is needed.',
  daneInline: 'Use delegated mode for DNSSEC + TLSA/DANE.',
  nsOk: 'Delegation target is present.',
  nsMissing: 'Add the authoritative nameserver hostname.',
  glueInZone: 'Nameserver is inside the zone, so glue must be in the parent records.',
  glueExternal: 'Nameserver is external, so glue is handled by its own parent.',
  dsOk: 'Parent-side DS is generated from DNSKEY.',
  dsMissing: 'Paste DNSKEY after signing the authoritative zone.',
  tlsaOk: 'TLSA is generated from certificate/public key.',
  tlsaMissing: 'Paste a certificate or PUBLIC KEY to generate TLSA.'
} as const;

const explanationsEn = {
  inline4: 'HNS wallet-side direct IPv4 address record for the name.',
  inline6: 'HNS wallet-side direct IPv6 address record for the name.',
  glue4: 'HNS wallet-side glue record for the IPv4 address of your in-name authoritative nameserver.',
  glue6: 'HNS wallet-side glue record for the IPv6 address of your in-name authoritative nameserver.',
  hnsNs: 'HNS wallet-side delegation record pointing the name at an external authoritative nameserver.',
  hnsDs: 'HNS wallet-side DNSSEC delegation signer record derived from the child-zone DNSKEY.',
  dsPlaceholder: 'Placeholder: paste your authoritative-zone DNSKEY to generate the exact parent-side DS record.',
  registrarNs: 'Registrar-side nameserver delegation.',
  registrarGlue4: 'Registrar-side glue is needed because the nameserver is inside the delegated domain.',
  registrarGlue6: 'Registrar-side IPv6 glue is needed because the nameserver is inside the delegated domain.',
  registrarDs: 'Registrar-side DS record derived from the child-zone DNSKEY.',
  registrarDsPlaceholder: 'Placeholder: paste your authoritative-zone DNSKEY to generate the exact registrar-side DS record.',
  authNs: 'Authoritative-zone NS record naming the server responsible for this zone.',
  authA: 'Authoritative-zone IPv4 address for the website apex.',
  authAaaa: 'Authoritative-zone IPv6 address for the website apex.',
  authTlsa: 'Authoritative-zone DANE/TLSA record for the TLS service.',
  authTlsaPlaceholder: 'Placeholder: paste a PEM certificate or PUBLIC KEY to generate the exact TLSA association data.',
  webServe: 'If the certificate key changes, publish the new TLSA record before switching the web server to the new key.',
  webNoPlugin: 'The TLS server serves a normal certificate. A DANE-aware client verifies the DNSSEC-protected TLSA record.',
  serverPreset: 'Server-side starter snippet. Create the zone, publish NS/A/AAAA/TLSA, enable DNSSEC signing, then publish DS at the parent.',
  verifyDelegated: 'Commands to check that the authoritative server answers before and after parent-side delegation.',
  verifyInline: 'Inline SYNTH records do not require an authoritative DNS server test.',
  integrator: 'Machine-readable output for wallets, future APIs, or integration tests. It is not automatically submitted anywhere.',
  stepInline1: 'This points the HNS name directly at the web server IP.',
  stepInline2: 'No separate authoritative DNS server is needed for this mode.',
  stepInline3: 'DANE expects TLSA inside a signed authoritative DNS zone.',
  stepServer: 'Use the selected server preset or the generic zone-file output.',
  stepDnssec: 'The DNS server should manage the signing keys and signed zone.',
  stepDs: 'The DS connects the parent layer to the signed child zone.',
  stepTlsa: 'TLSA goes on the authoritative DNS server.',
  stepParent: 'This activates the parent-side delegation path.'
} as const;

function buildCopy(
  notices: Record<string, string>,
  statusDetails: Record<string, string>,
  explanations: Record<string, string>,
  rest: Omit<CoreCopy, 'notices' | 'statusDetails' | 'explanations'>
): CoreCopy {
  return {
    notices: Object.fromEntries(Object.entries(noticesEn).map(([key, value]) => [value, notices[key] ?? value])),
    statusDetails: Object.fromEntries(Object.entries(detailsEn).map(([key, value]) => [value, statusDetails[key] ?? value])),
    explanations: Object.fromEntries(Object.entries(explanationsEn).map(([key, value]) => [value, explanations[key] ?? value])),
    ...rest
  };
}

const copy: Record<LanguageCode, CoreCopy> = {
  en,
  es: buildCopy(
    {
      invalidDomain: 'El formato del dominio no es válido para salida DNS.',
      idna: 'La entrada de dominio internacionalizado se convierte a A-labels ASCII DNS como xn--... en los registros generados.',
      ttl: 'El TTL normalmente debe estar entre 60 y 86400 segundos.',
      inlineIcann: 'El modo SYNTH directo solo es para HNS. La salida ICANN usa DNS delegado.',
      websiteIpv4: 'La dirección IPv4 del sitio web no es válida.',
      websiteIpv6: 'La dirección IPv6 del sitio web no es válida.',
      nsIpv4: 'La dirección IPv4 del servidor DNS no es válida.',
      nsIpv6: 'La dirección IPv6 del servidor DNS no es válida.',
      nsMissing: 'El modo delegado necesita un hostname de servidor DNS.',
      nsInvalid: 'El hostname del servidor DNS no es válido.',
      noWebsiteIp: 'No se indicó ninguna dirección A o AAAA para el sitio web.',
      glueRequired: 'El servidor DNS está dentro de la misma zona, así que se requiere glue. Agrega al menos una IP del servidor DNS.',
      tlsaNoDs: 'TLSA está generado, pero DNSSEC queda incompleto hasta publicar un registro DS en el padre.',
      tlsaUsage: 'TLSA usage 3 es el valor por defecto de este flujo. Otros usos son avanzados y dependen de CA/TA.',
      tlsaError: 'No se pudo generar el registro TLSA.',
      dsError: 'No se pudo generar el registro DS desde la DNSKEY.',
      dnskeyProtocol: 'El protocolo DNSKEY normalmente es 3. Revisa que la línea DNSKEY se haya pegado correctamente.',
      dnskeySep: 'La DNSKEY no tiene la bandera SEP/KSK. Los registros DS normalmente se hacen desde la KSK.',
      dnskeySha1: 'Esta DNSKEY usa un algoritmo antiguo de la familia RSA/SHA-1. Prefiere algoritmos DNSSEC modernos cuando el servidor los soporte.'
    },
    {
      domainOk: 'El dominio está normalizado para salida DNS.',
      domainMissing: 'Introduce el nombre HNS o dominio ICANN.',
      websiteOk: 'Se puede generar salida A/AAAA.',
      websiteMissing: 'Agrega al menos una dirección IPv4 o IPv6 del sitio web.',
      inlineOk: 'Solo se necesita salida SYNTH4/SYNTH6 para la cartera.',
      daneInline: 'Usa modo delegado para DNSSEC + TLSA/DANE.',
      nsOk: 'El destino de delegación está presente.',
      nsMissing: 'Agrega el hostname del servidor DNS autoritativo.',
      glueInZone: 'El servidor DNS está dentro de la zona, así que glue debe estar en los registros padre.',
      glueExternal: 'El servidor DNS es externo, así que su propio padre gestiona el glue.',
      dsOk: 'El DS del padre se generó desde DNSKEY.',
      dsMissing: 'Pega DNSKEY después de firmar la zona autoritativa.',
      tlsaOk: 'TLSA se generó desde el certificado/clave pública.',
      tlsaMissing: 'Pega un certificado o PUBLIC KEY para generar TLSA.'
    },
    {
      inline4: 'Registro IPv4 directo del lado cartera HNS para el nombre.',
      inline6: 'Registro IPv6 directo del lado cartera HNS para el nombre.',
      glue4: 'Registro glue HNS para la IPv4 de tu servidor DNS autoritativo bajo el mismo nombre.',
      glue6: 'Registro glue HNS para la IPv6 de tu servidor DNS autoritativo bajo el mismo nombre.',
      hnsNs: 'Registro de delegación HNS que apunta el nombre a un servidor DNS autoritativo externo.',
      hnsDs: 'Registro DS de delegación DNSSEC HNS derivado de la DNSKEY de la zona hija.',
      dsPlaceholder: 'Pendiente: pega la DNSKEY de tu zona autoritativa para generar el DS exacto del padre.',
      registrarNs: 'Delegación de nameserver del lado registrador.',
      registrarGlue4: 'Glue del registrador necesario porque el servidor DNS está dentro del dominio delegado.',
      registrarGlue6: 'Glue IPv6 del registrador necesario porque el servidor DNS está dentro del dominio delegado.',
      registrarDs: 'Registro DS del registrador derivado de la DNSKEY de la zona hija.',
      registrarDsPlaceholder: 'Pendiente: pega la DNSKEY de tu zona autoritativa para generar el DS exacto del registrador.',
      authNs: 'Registro NS de la zona autoritativa que nombra el servidor responsable de esta zona.',
      authA: 'Dirección IPv4 de la zona autoritativa para el apex del sitio web.',
      authAaaa: 'Dirección IPv6 de la zona autoritativa para el apex del sitio web.',
      authTlsa: 'Registro DANE/TLSA de la zona autoritativa para el servicio TLS.',
      authTlsaPlaceholder: 'Pendiente: pega un certificado PEM o PUBLIC KEY para generar los datos TLSA exactos.',
      webServe: 'Si cambia la clave del certificado, publica el nuevo TLSA antes de cambiar el servidor web a la nueva clave.',
      webNoPlugin: 'El servidor TLS entrega un certificado normal. Un cliente DANE verifica el registro TLSA protegido por DNSSEC.',
      serverPreset: 'Ejemplo inicial del lado servidor. Crea la zona, publica NS/A/AAAA/TLSA, activa DNSSEC y luego publica DS en el padre.',
      verifyDelegated: 'Comandos para comprobar que el servidor autoritativo responde antes y después de la delegación padre.',
      verifyInline: 'Los registros SYNTH directos no requieren una prueba de servidor DNS autoritativo.',
      integrator: 'Salida legible por máquina para carteras, APIs futuras o pruebas de integración. No se envía automáticamente.',
      stepInline1: 'Esto apunta el nombre HNS directamente a la IP del servidor web.',
      stepInline2: 'No se necesita un servidor DNS autoritativo separado para este modo.',
      stepInline3: 'DANE espera TLSA dentro de una zona autoritativa firmada.',
      stepServer: 'Usa el preset elegido o la salida de archivo de zona genérico.',
      stepDnssec: 'El servidor DNS debe gestionar las claves de firma y la zona firmada.',
      stepDs: 'El DS conecta la capa padre con la zona hija firmada.',
      stepTlsa: 'TLSA va en el servidor DNS autoritativo.',
      stepParent: 'Esto activa la ruta de delegación del lado padre.'
    },
    {
      quickSteps: {
        inline: ['1. Copia SYNTH4/SYNTH6 en la cartera HNS.', '2. Haz que el servidor web responda en esa IP.', '3. Cambia a modo delegado para DNSSEC/DANE.'],
        delegated: {
          server: '1. Pon los registros del servidor en el DNS autoritativo.',
          dnssec: '2. Activa la firma DNSSEC en la zona.',
          dsReady: '3. Copia el DS en la cartera o registrador.',
          dsMissing: '3. Pega la DNSKEY aquí y luego copia el DS generado a la cartera o registrador.',
          tlsaReady: '4. Sirve el certificado/clave HTTPS correspondiente.',
          tlsaMissing: '4. Pega el certificado de hoja o PUBLIC KEY para generar TLSA.',
          parentHns: '5. Envía la actualización del recurso de nombre HNS.',
          parentIcann: '5. Guarda nameserver, glue y DS en el registrador.'
        }
      },
      webNotes: {
        serve: 'Sirve el certificado cuya clave pública coincide con el hash SPKI de TLSA.',
        noPlugin: 'Nginx/Apache/Caddy no necesitan plugin DANE; DANE vive en DNS.'
      },
      verify: {
        hnsInline: '# Cuando confirme la actualización HNS, prueba con un resolvedor/navegador compatible con HNS.',
        expectedAddress: '# Dirección esperada',
        hnsFullChain: '# Para pruebas HNS de cadena completa, consulta con tu resolvedor compatible con HNS después de confirmar la actualización de cartera.'
      },
      fallbackNotice: 'La entrada no se pudo procesar. Revisa el campo correspondiente y vuelve a intentarlo.',
      fallbackStatusDetail: 'Revisa este elemento antes de publicar los registros.',
      fallbackExplanation: 'Línea generada para este paso. Copia el valor solo en el destino indicado por el encabezado.',
      helpTips: {
        fastPath: 'Ruta fiable más rápida: crea la zona autoritativa, activa DNSSEC, pega DNSKEY aquí y copia el DS generado a la cartera o registrador.',
        tlsaPin: 'TLSA 3 1 1 fija la clave pública del servicio con SHA-256. La renovación del certificado puede ser simple si el servidor mantiene el mismo par de claves.',
        parentSplit: 'Los registros padre y de servidor son distintos. La cartera o registrador delega. El DNS autoritativo publica los registros del sitio y TLSA.',
        idna: 'Se aceptan nombres internacionalizados, pero los registros DNS usan A-labels IDNA como xn--bcher-kva.example.',
        hnsGlue: (nameserver, domain) => `En modo HNS delegado, GLUE4/GLUE6 es necesario cuando el nameserver vive bajo el propio nombre HNS, como ${nameserver} para ${domain}/.`,
        hnsInline: 'El modo HNS directo es la configuración IP más simple. Usa modo delegado cuando quieras DNSSEC y DANE.',
        preset: {
          'generic-zone': 'La salida de zona genérica funciona con BIND, Knot, NSD y muchas herramientas de importación DNS.',
          'hosted-dns': 'DNS alojado es el camino más corto si tu proveedor soporta DNSSEC, exportación DS personalizada y TLSA.',
          powerdns: 'PowerDNS es un camino corto si quieres DNS con API o base de datos.',
          knot: 'Knot DNS es un valor moderno y limpio con automatización DNSSEC sencilla.',
          bind: 'BIND 9 tiene mucha documentación y paquetes disponibles, pero su configuración es más verbosa.',
          nsd: 'NSD es pequeño y fiable, pero la firma DNSSEC normalmente se maneja aparte.'
        }
      }
    }
  ),
  fr: buildCopy(
    {
      invalidDomain: 'Le format du domaine n’est pas valide pour une sortie DNS.',
      idna: 'Le domaine internationalisé est converti en A-labels ASCII DNS comme xn--... dans les enregistrements générés.',
      ttl: 'Le TTL devrait normalement être entre 60 et 86400 secondes.',
      inlineIcann: 'Le mode SYNTH direct est réservé à HNS. La sortie ICANN utilise DNS délégué.',
      websiteIpv4: 'L’adresse IPv4 du site web n’est pas valide.',
      websiteIpv6: 'L’adresse IPv6 du site web n’est pas valide.',
      nsIpv4: 'L’adresse IPv4 du serveur de noms n’est pas valide.',
      nsIpv6: 'L’adresse IPv6 du serveur de noms n’est pas valide.',
      nsMissing: 'Le mode délégué nécessite un nom de serveur de noms.',
      nsInvalid: 'Le nom du serveur de noms n’est pas valide.',
      noWebsiteIp: 'Aucune adresse A ou AAAA du site web n’a été fournie.',
      glueRequired: 'Le serveur de noms est dans la même zone, donc la glue est requise. Ajoutez au moins une adresse IP de serveur de noms.',
      tlsaNoDs: 'TLSA est généré, mais DNSSEC reste incomplet tant qu’un DS parent n’est pas publié.',
      tlsaUsage: 'TLSA usage 3 est la valeur par défaut de ce parcours. Les autres usages sont avancés et dépendent de CA/TA.',
      tlsaError: 'Impossible de générer l’enregistrement TLSA.',
      dsError: 'Impossible de générer l’enregistrement DS depuis la DNSKEY.',
      dnskeyProtocol: 'Le protocole DNSKEY est normalement 3. Vérifiez que la ligne DNSKEY a été collée correctement.',
      dnskeySep: 'La DNSKEY n’a pas le drapeau SEP/KSK. Les DS sont normalement créés depuis la KSK.',
      dnskeySha1: 'Cette DNSKEY utilise un ancien algorithme RSA/SHA-1. Préférez les algorithmes DNSSEC modernes quand le serveur les prend en charge.'
    },
    {
      domainOk: 'Le domaine est normalisé pour la sortie DNS.',
      domainMissing: 'Saisissez le nom HNS ou le domaine ICANN.',
      websiteOk: 'La sortie A/AAAA peut être générée.',
      websiteMissing: 'Ajoutez au moins une adresse IPv4 ou IPv6 du site web.',
      inlineOk: 'Seule la sortie wallet SYNTH4/SYNTH6 est nécessaire.',
      daneInline: 'Utilisez le mode délégué pour DNSSEC + TLSA/DANE.',
      nsOk: 'La cible de délégation est présente.',
      nsMissing: 'Ajoutez le nom du serveur DNS faisant autorité.',
      glueInZone: 'Le serveur de noms est dans la zone, donc la glue doit être dans les enregistrements parent.',
      glueExternal: 'Le serveur de noms est externe, donc sa propre zone parente gère la glue.',
      dsOk: 'Le DS parent est généré depuis DNSKEY.',
      dsMissing: 'Collez DNSKEY après la signature de la zone faisant autorité.',
      tlsaOk: 'TLSA est généré depuis le certificat/la clé publique.',
      tlsaMissing: 'Collez un certificat ou une PUBLIC KEY pour générer TLSA.'
    },
    {
      serverPreset: 'Extrait serveur de départ. Créez la zone, publiez NS/A/AAAA/TLSA, activez DNSSEC, puis publiez DS chez le parent.',
      verifyDelegated: 'Commandes pour vérifier que le serveur faisant autorité répond avant et après la délégation parente.',
      integrator: 'Sortie lisible par machine pour wallets, futures APIs ou tests d’intégration. Elle n’est pas soumise automatiquement.'
    },
    {
      quickSteps: {
        inline: ['1. Copiez SYNTH4/SYNTH6 dans le wallet HNS.', '2. Faites répondre le serveur web sur cette IP.', '3. Passez au mode délégué pour DNSSEC/DANE.'],
        delegated: {
          server: '1. Mettez les enregistrements serveur sur le DNS faisant autorité.',
          dnssec: '2. Activez la signature DNSSEC sur la zone.',
          dsReady: '3. Copiez le DS dans le wallet ou le bureau d’enregistrement.',
          dsMissing: '3. Collez DNSKEY ici, puis copiez le DS généré dans le wallet ou le bureau d’enregistrement.',
          tlsaReady: '4. Servez le certificat/la clé HTTPS correspondant.',
          tlsaMissing: '4. Collez le certificat feuille ou PUBLIC KEY pour générer TLSA.',
          parentHns: '5. Soumettez la mise à jour de ressource de nom HNS.',
          parentIcann: '5. Enregistrez nameserver, glue et DS chez le bureau d’enregistrement.'
        }
      },
      webNotes: {
        serve: 'Servez le certificat dont la clé publique correspond au hachage SPKI TLSA.',
        noPlugin: 'Nginx/Apache/Caddy n’ont pas besoin de plugin DANE ; DANE vit dans DNS.'
      },
      verify: {
        hnsInline: '# Après confirmation de la mise à jour HNS, testez avec un résolveur/navigateur compatible HNS.',
        expectedAddress: '# Adresse attendue',
        hnsFullChain: '# Pour les tests HNS de chaîne complète, interrogez via votre résolveur compatible HNS après confirmation du wallet.'
      },
      fallbackNotice: 'L’entrée n’a pas pu être traitée. Vérifiez le champ concerné puis réessayez.',
      fallbackStatusDetail: 'Vérifiez cet élément avant de publier les enregistrements.',
      fallbackExplanation: 'Ligne générée pour cette étape. Copiez la valeur uniquement vers la destination indiquée par le titre.',
      helpTips: {
        fastPath: 'Chemin fiable le plus rapide : créez la zone faisant autorité, activez DNSSEC, collez DNSKEY ici, puis copiez le DS généré vers le wallet ou le bureau d’enregistrement.',
        tlsaPin: 'TLSA 3 1 1 épingle la clé publique du service avec SHA-256. Le renouvellement du certificat est simple si le serveur garde la même paire de clés.',
        parentSplit: 'Les enregistrements parent et serveur sont différents. Le wallet ou le bureau d’enregistrement délègue. Le serveur DNS publie les enregistrements du site et TLSA.',
        idna: 'Les noms internationalisés sont acceptés en entrée, mais les enregistrements DNS utilisent des A-labels IDNA comme xn--bcher-kva.example.',
        hnsGlue: (nameserver, domain) => `En mode HNS délégué, GLUE4/GLUE6 est requis quand le serveur de noms est sous le nom HNS lui-même, comme ${nameserver} pour ${domain}/.`,
        hnsInline: 'Le mode HNS direct est la configuration IP la plus simple. Utilisez le mode délégué pour DNSSEC et DANE.',
        preset: {
          'generic-zone': 'La sortie de zone générique fonctionne avec BIND, Knot, NSD et de nombreux outils DNS.',
          'hosted-dns': 'DNS hébergé est le chemin le plus court si le fournisseur prend en charge DNSSEC, l’export DS et TLSA.',
          powerdns: 'PowerDNS est un chemin court pour un DNS avec API ou base de données.',
          knot: 'Knot DNS est un choix moderne avec une automatisation DNSSEC simple.',
          bind: 'BIND 9 est très documenté et disponible, mais sa configuration est plus verbeuse.',
          nsd: 'NSD est petit et fiable, mais la signature DNSSEC est souvent séparée.'
        }
      }
    }
  ),
  de: buildCopy(
    {
      invalidDomain: 'Das Domainformat ist für DNS-Ausgabe nicht gültig.',
      idna: 'Internationalisierte Domain-Eingaben werden in DNS-ASCII-A-Labels wie xn--... umgewandelt.',
      ttl: 'TTL sollte normalerweise zwischen 60 und 86400 Sekunden liegen.',
      inlineIcann: 'Inline-SYNTH ist nur für HNS. ICANN-Ausgabe nutzt delegiertes DNS.',
      websiteIpv4: 'Website-IPv4-Adresse ist ungültig.',
      websiteIpv6: 'Website-IPv6-Adresse ist ungültig.',
      nsIpv4: 'Nameserver-IPv4-Adresse ist ungültig.',
      nsIpv6: 'Nameserver-IPv6-Adresse ist ungültig.',
      nsMissing: 'Delegierter Modus benötigt einen Nameserver-Hostnamen.',
      nsInvalid: 'Nameserver-Hostname ist ungültig.',
      noWebsiteIp: 'Keine Website-A- oder AAAA-Adresse angegeben.',
      glueRequired: 'Der Nameserver liegt in derselben Zone, daher ist Glue erforderlich. Fügen Sie mindestens eine Nameserver-IP hinzu.',
      tlsaNoDs: 'TLSA ist erzeugt, aber DNSSEC ist unvollständig, bis ein Parent-DS veröffentlicht wird.',
      tlsaUsage: 'TLSA usage 3 ist die Voreinstellung für diesen Ablauf. Andere Nutzungen sind fortgeschritten und hängen von CA/TA ab.',
      tlsaError: 'TLSA-Eintrag konnte nicht erzeugt werden.',
      dsError: 'DS-Eintrag konnte nicht aus DNSKEY erzeugt werden.',
      dnskeyProtocol: 'DNSKEY-Protokoll ist normalerweise 3. Prüfen Sie, ob die DNSKEY-Zeile korrekt eingefügt wurde.',
      dnskeySep: 'Die DNSKEY hat kein SEP/KSK-Flag. DS-Einträge werden normalerweise aus der KSK erstellt.',
      dnskeySha1: 'Diese DNSKEY nutzt einen alten RSA/SHA-1-Algorithmus. Nutzen Sie moderne DNSSEC-Algorithmen, wenn unterstützt.'
    },
    {},
    {
      serverPreset: 'Serverseitiger Startausschnitt. Zone erstellen, NS/A/AAAA/TLSA veröffentlichen, DNSSEC aktivieren, dann DS beim Parent veröffentlichen.',
      verifyDelegated: 'Befehle zum Prüfen, ob der autoritative Server vor und nach Parent-Delegation antwortet.',
      integrator: 'Maschinenlesbare Ausgabe für Wallets, zukünftige APIs oder Integrationstests. Sie wird nicht automatisch gesendet.'
    },
    {
      quickSteps: {
        inline: ['1. SYNTH4/SYNTH6 ins HNS-Wallet kopieren.', '2. Webserver auf dieser IP antworten lassen.', '3. Für DNSSEC/DANE in delegierten Modus wechseln.'],
        delegated: {
          server: '1. Server-Einträge auf den autoritativen DNS-Server legen.',
          dnssec: '2. DNSSEC-Signierung für die Zone aktivieren.',
          dsReady: '3. DS ins Wallet oder zum Registrar kopieren.',
          dsMissing: '3. DNSKEY hier einfügen, dann den erzeugten DS ins Wallet oder zum Registrar kopieren.',
          tlsaReady: '4. Passendes HTTPS-Zertifikat/Schlüssel ausliefern.',
          tlsaMissing: '4. Leaf-Zertifikat oder PUBLIC KEY einfügen, um TLSA zu erzeugen.',
          parentHns: '5. HNS-Namensressource aktualisieren.',
          parentIcann: '5. Nameserver-, Glue- und DS-Einstellungen beim Registrar speichern.'
        }
      },
      webNotes: {
        serve: 'Liefern Sie das Zertifikat aus, dessen Public Key zum TLSA-SPKI-Hash passt.',
        noPlugin: 'Nginx/Apache/Caddy brauchen kein DANE-Plugin; DANE lebt in DNS.'
      },
      verify: {
        hnsInline: '# Nach Bestätigung des HNS-Updates mit HNS-fähigem Resolver/Browser testen.',
        expectedAddress: '# Erwartete Adresse',
        hnsFullChain: '# Für HNS-Full-Chain-Tests nach Wallet-Bestätigung über Ihren HNS-fähigen Resolver abfragen.'
      },
      fallbackNotice: 'Die Eingabe konnte nicht verarbeitet werden. Prüfen Sie das zugehörige Feld und versuchen Sie es erneut.',
      fallbackStatusDetail: 'Prüfen Sie diesen Punkt, bevor Sie die Einträge veröffentlichen.',
      fallbackExplanation: 'Für diesen Schritt erzeugte Zeile. Kopieren Sie den Wert nur an das im Titel angegebene Ziel.',
      helpTips: {
        fastPath: 'Schnellster zuverlässiger Weg: autoritative Zone erstellen, DNSSEC aktivieren, DNSKEY hier einfügen, erzeugten DS ins Wallet oder zum Registrar kopieren.',
        tlsaPin: 'TLSA 3 1 1 pinnt den Service-Public-Key mit SHA-256. Zertifikatserneuerung bleibt einfach, wenn das gleiche Schlüsselpaar bleibt.',
        parentSplit: 'Parent- und Server-Einträge sind verschieden. Wallet oder Registrar delegiert. Der DNS-Server veröffentlicht Website-Einträge und TLSA.',
        idna: 'Internationalisierte Namen werden akzeptiert, aber DNS-Einträge nutzen IDNA-A-Labels wie xn--bcher-kva.example.',
        hnsGlue: (nameserver, domain) => `Im delegierten HNS-Modus ist GLUE4/GLUE6 nötig, wenn der Nameserver unter dem HNS-Namen selbst liegt, z. B. ${nameserver} für ${domain}/.`,
        hnsInline: 'HNS-Inline ist die einfachste IP-Konfiguration. Für DNSSEC und DANE delegierten Modus nutzen.',
        preset: {
          'generic-zone': 'Generische Zonendatei-Ausgabe funktioniert mit BIND, Knot, NSD und vielen DNS-Importtools.',
          'hosted-dns': 'Hosted DNS ist der kürzeste Weg, wenn der Provider DNSSEC, DS-Export und TLSA unterstützt.',
          powerdns: 'PowerDNS ist ein kurzer Weg, wenn API- oder datenbankgestütztes DNS gewünscht ist.',
          knot: 'Knot DNS ist ein moderner Standard mit einfacher DNSSEC-Automatisierung.',
          bind: 'BIND 9 ist gut dokumentiert und paketfreundlich, aber ausführlicher konfiguriert.',
          nsd: 'NSD ist klein und zuverlässig; DNSSEC-Signierung erfolgt meist separat.'
        }
      }
    }
  ),
  pt: buildCopy(
    {
      invalidDomain: 'O formato do domínio não é válido para saída DNS.',
      idna: 'Entrada de domínio internacionalizado é convertida para A-labels ASCII DNS como xn--... nos registros gerados.',
      ttl: 'TTL normalmente deve ficar entre 60 e 86400 segundos.',
      inlineIcann: 'Modo SYNTH direto é somente HNS. Saída ICANN usa DNS delegado.',
      websiteIpv4: 'O endereço IPv4 do site não é válido.',
      websiteIpv6: 'O endereço IPv6 do site não é válido.',
      nsIpv4: 'O endereço IPv4 do nameserver não é válido.',
      nsIpv6: 'O endereço IPv6 do nameserver não é válido.',
      nsMissing: 'Modo delegado precisa de um hostname de nameserver.',
      nsInvalid: 'O hostname do nameserver não é válido.',
      noWebsiteIp: 'Nenhum endereço A ou AAAA do site foi informado.',
      glueRequired: 'O nameserver está dentro da mesma zona, então glue é obrigatório. Adicione ao menos um IP de nameserver.',
      tlsaNoDs: 'TLSA foi gerado, mas DNSSEC fica incompleto até publicar um DS no parent.',
      tlsaUsage: 'TLSA usage 3 é o padrão deste fluxo. Outros usos são avançados e dependem de CA/TA.',
      tlsaError: 'Não foi possível gerar o registro TLSA.',
      dsError: 'Não foi possível gerar o registro DS a partir da DNSKEY.',
      dnskeyProtocol: 'O protocolo DNSKEY normalmente é 3. Verifique se a linha DNSKEY foi colada corretamente.',
      dnskeySep: 'A DNSKEY não tem a flag SEP/KSK. Registros DS normalmente são feitos a partir da KSK.',
      dnskeySha1: 'Esta DNSKEY usa algoritmo antigo da família RSA/SHA-1. Prefira algoritmos DNSSEC modernos quando o servidor suportar.'
    },
    {},
    {
      serverPreset: 'Trecho inicial do lado servidor. Crie a zona, publique NS/A/AAAA/TLSA, ative DNSSEC e depois publique DS no parent.',
      verifyDelegated: 'Comandos para verificar se o servidor autoritativo responde antes e depois da delegação parent.',
      integrator: 'Saída legível por máquina para carteiras, APIs futuras ou testes de integração. Não é enviada automaticamente.'
    },
    {
      quickSteps: {
        inline: ['1. Copie SYNTH4/SYNTH6 para a carteira HNS.', '2. Faça o servidor web responder nesse IP.', '3. Troque para modo delegado para DNSSEC/DANE.'],
        delegated: {
          server: '1. Coloque os registros no servidor DNS autoritativo.',
          dnssec: '2. Ative a assinatura DNSSEC na zona.',
          dsReady: '3. Copie o DS para a carteira ou registrador.',
          dsMissing: '3. Cole a DNSKEY aqui e copie o DS gerado para a carteira ou registrador.',
          tlsaReady: '4. Sirva o certificado/chave HTTPS correspondente.',
          tlsaMissing: '4. Cole o certificado folha ou PUBLIC KEY para gerar TLSA.',
          parentHns: '5. Envie a atualização do recurso de nome HNS.',
          parentIcann: '5. Salve nameserver, glue e DS no registrador.'
        }
      },
      webNotes: {
        serve: 'Sirva o certificado cuja chave pública corresponde ao hash SPKI TLSA.',
        noPlugin: 'Nginx/Apache/Caddy não precisam de plugin DANE; DANE fica no DNS.'
      },
      verify: {
        hnsInline: '# Depois que a atualização HNS confirmar, teste com resolvedor/navegador compatível com HNS.',
        expectedAddress: '# Endereço esperado',
        hnsFullChain: '# Para testes HNS de cadeia completa, consulte pelo seu resolvedor HNS após a confirmação da carteira.'
      },
      fallbackNotice: 'A entrada não pôde ser processada. Revise o campo correspondente e tente novamente.',
      fallbackStatusDetail: 'Revise este item antes de publicar os registros.',
      fallbackExplanation: 'Linha gerada para esta etapa. Copie o valor apenas para o destino indicado pelo título.',
      helpTips: {
        fastPath: 'Caminho confiável mais rápido: crie a zona autoritativa, ative DNSSEC, cole DNSKEY aqui e copie o DS gerado para a carteira ou registrador.',
        tlsaPin: 'TLSA 3 1 1 fixa a chave pública do serviço com SHA-256. Renovar certificado é simples se o servidor mantiver o mesmo par de chaves.',
        parentSplit: 'Registros parent e de servidor são diferentes. Carteira ou registrador delega. O servidor DNS publica registros do site e TLSA.',
        idna: 'Nomes internacionalizados são aceitos como entrada, mas registros DNS usam A-labels IDNA como xn--bcher-kva.example.',
        hnsGlue: (nameserver, domain) => `No modo HNS delegado, GLUE4/GLUE6 é necessário quando o nameserver fica sob o próprio nome HNS, como ${nameserver} para ${domain}/.`,
        hnsInline: 'Modo HNS direto é a configuração IP mais simples. Use modo delegado para DNSSEC e DANE.',
        preset: {
          'generic-zone': 'Saída de zona genérica funciona com BIND, Knot, NSD e muitas ferramentas DNS.',
          'hosted-dns': 'DNS hospedado é o caminho mais curto se o provedor suporta DNSSEC, exportação DS e TLSA.',
          powerdns: 'PowerDNS é um caminho curto quando se quer DNS com API ou banco de dados.',
          knot: 'Knot DNS é um padrão moderno com automação DNSSEC simples.',
          bind: 'BIND 9 é bem documentado e disponível, mas sua configuração é mais verbosa.',
          nsd: 'NSD é pequeno e confiável, mas a assinatura DNSSEC costuma ser separada.'
        }
      }
    }
  ),
  ja: buildCopy(
    {
      invalidDomain: 'DNS 出力に使えるドメイン形式ではありません。',
      idna: '国際化ドメイン入力は、生成レコード内で xn--... のような DNS ASCII A-label に変換されます。',
      ttl: 'TTL は通常 60 から 86400 秒の範囲にします。',
      inlineIcann: 'SYNTH 直接モードは HNS 専用です。ICANN 出力は委任 DNS を使います。',
      websiteIpv4: 'Web サイト IPv4 アドレスが正しくありません。',
      websiteIpv6: 'Web サイト IPv6 アドレスが正しくありません。',
      nsIpv4: 'ネームサーバー IPv4 アドレスが正しくありません。',
      nsIpv6: 'ネームサーバー IPv6 アドレスが正しくありません。',
      nsMissing: '委任モードにはネームサーバー名が必要です。',
      nsInvalid: 'ネームサーバー名が正しくありません。',
      noWebsiteIp: 'Web サイトの A または AAAA アドレスがありません。',
      glueRequired: 'ネームサーバーが同じゾーン内にあるため glue が必要です。少なくとも 1 つのネームサーバー IP を追加してください。',
      tlsaNoDs: 'TLSA は生成されていますが、親側 DS を公開するまで DNSSEC は未完了です。',
      tlsaUsage: 'TLSA usage 3 がこのフローの既定値です。他の usage は高度な設定で、CA/TA の扱いに依存します。',
      tlsaError: 'TLSA レコードを生成できませんでした。',
      dsError: 'DNSKEY 入力から DS レコードを生成できませんでした。',
      dnskeyProtocol: 'DNSKEY protocol は通常 3 です。DNSKEY 行が正しく貼り付けられているか確認してください。',
      dnskeySep: 'この DNSKEY には SEP/KSK フラグがありません。DS レコードは通常 KSK から作ります。',
      dnskeySha1: 'この DNSKEY は古い RSA/SHA-1 系アルゴリズムを使っています。可能なら新しい DNSSEC アルゴリズムを使ってください。'
    },
    {},
    {
      serverPreset: 'サーバー側の開始用スニペットです。ゾーンを作り、NS/A/AAAA/TLSA を公開し、DNSSEC 署名を有効にしてから親側に DS を公開します。',
      verifyDelegated: '親側委任の前後で権威サーバーが応答するか確認するコマンドです。',
      integrator: 'ウォレット、将来の API、統合テスト向けの機械可読出力です。自動送信はされません。'
    },
    {
      quickSteps: {
        inline: ['1. SYNTH4/SYNTH6 を HNS ウォレットにコピーします。', '2. その IP で Web サーバーが応答するようにします。', '3. DNSSEC/DANE が必要なら委任モードに切り替えます。'],
        delegated: {
          server: '1. サーバーレコードを権威 DNS サーバーに入れます。',
          dnssec: '2. ゾーンで DNSSEC 署名を有効にします。',
          dsReady: '3. DS をウォレットまたはレジストラへコピーします。',
          dsMissing: '3. ここに DNSKEY を貼り、生成された DS をウォレットまたはレジストラへコピーします。',
          tlsaReady: '4. 一致する HTTPS 証明書/鍵を配信します。',
          tlsaMissing: '4. リーフ証明書または PUBLIC KEY を貼って TLSA を生成します。',
          parentHns: '5. HNS 名前リソースの更新を送信します。',
          parentIcann: '5. レジストラで nameserver、glue、DS 設定を保存します。'
        }
      },
      webNotes: {
        serve: 'TLSA SPKI ハッシュと一致する公開鍵の証明書を配信します。',
        noPlugin: 'Nginx/Apache/Caddy に DANE プラグインは不要です。DANE は DNS 側にあります。'
      },
      verify: {
        hnsInline: '# HNS 更新が確認されたら、HNS 対応リゾルバ/ブラウザでテストします。',
        expectedAddress: '# 期待されるアドレス',
        hnsFullChain: '# HNS の完全チェーン確認は、ウォレット更新後に HNS 対応リゾルバで問い合わせます。'
      },
      fallbackNotice: '入力を処理できませんでした。該当する入力欄を確認して、もう一度試してください。',
      fallbackStatusDetail: 'レコードを公開する前に、この項目を確認してください。',
      fallbackExplanation: 'この手順用に生成された行です。見出しで示された送信先にだけコピーしてください。',
      helpTips: {
        fastPath: '最短で確実な流れ: 権威ゾーンを作成し、DNSSEC 署名を有効にし、ここに DNSKEY を貼り、生成された DS をウォレットまたはレジストラへコピーします。',
        tlsaPin: 'TLSA 3 1 1 はサービス公開鍵を SHA-256 で固定します。同じ鍵ペアを保てば証明書更新は簡単です。',
        parentSplit: '親側レコードとサーバーレコードは別です。ウォレットまたはレジストラが委任し、DNS サーバーがサイトレコードと TLSA を公開します。',
        idna: '国際化名は入力できますが、DNS レコードでは xn--bcher-kva.example のような IDNA A-label を使います。',
        hnsGlue: (nameserver, domain) => `HNS 委任モードでは、${domain}/ に対する ${nameserver} のようにネームサーバーが HNS 名の下にある場合、GLUE4/GLUE6 が必要です。`,
        hnsInline: 'HNS 直接モードは最も簡単な IP 指定です。DNSSEC と DANE が必要なら委任モードを使います。',
        preset: {
          'generic-zone': '汎用ゾーンファイル出力は BIND、Knot、NSD、多くの DNS インポートツールで使えます。',
          'hosted-dns': 'プロバイダーが DNSSEC、DS エクスポート、TLSA をサポートするならホスト型 DNS が最短です。',
          powerdns: 'API または DB ベースの DNS が必要なら PowerDNS が短い経路です。',
          knot: 'Knot DNS は DNSSEC 自動化が簡単な現代的な既定候補です。',
          bind: 'BIND 9 は文書が多く導入しやすいですが、設定はより冗長です。',
          nsd: 'NSD は小さく信頼できますが、DNSSEC 署名は通常別手順です。'
        }
      }
    }
  )
};

function rootless(name: string): string {
  return name.endsWith('.') ? name.slice(0, -1) : name;
}

function translatedExplanation(c: CoreCopy, message: string): string {
  return (c.explanations[message] ?? c.fallbackExplanation) || message;
}

function nameserverForHelp(result: BootstrapResult): string {
  const line = result.parentRecords.find((record) => /^(GLUE4|GLUE6|NS) /.test(record.value));
  return line?.value.split(/\s+/)[1] ?? `ns1.${result.normalizedDomain}`;
}

function localizeQuickSteps(result: BootstrapResult, input: BootstrapInput, c: CoreCopy): GeneratedLine[] {
  if (result.diagnostics.mode === 'hns-inline') {
    return c.quickSteps.inline.map((value, index) => ({
      value,
      explanation: [
        translatedExplanation(c, explanationsEn.stepInline1),
        translatedExplanation(c, explanationsEn.stepInline2),
        translatedExplanation(c, explanationsEn.stepInline3)
      ][index]
    }));
  }

  return [
    { value: c.quickSteps.delegated.server, explanation: translatedExplanation(c, explanationsEn.stepServer) },
    { value: c.quickSteps.delegated.dnssec, explanation: translatedExplanation(c, explanationsEn.stepDnssec) },
    { value: result.diagnostics.hasDs ? c.quickSteps.delegated.dsReady : c.quickSteps.delegated.dsMissing, explanation: translatedExplanation(c, explanationsEn.stepDs) },
    { value: result.diagnostics.hasTlsa ? c.quickSteps.delegated.tlsaReady : c.quickSteps.delegated.tlsaMissing, explanation: translatedExplanation(c, explanationsEn.stepTlsa) },
    { value: input.domainType === 'hns' ? c.quickSteps.delegated.parentHns : c.quickSteps.delegated.parentIcann, explanation: translatedExplanation(c, explanationsEn.stepParent) }
  ];
}

function localizeVerification(lines: GeneratedLine[], c: CoreCopy): GeneratedLine[] {
  return lines.map((line) => {
    let value = line.value;
    if (value.startsWith('# After the HNS update confirms')) {
      const expected = value.match(/# Expected address: (.+)$/m)?.[1] ?? '<website-ip>';
      value = `${c.verify.hnsInline}\n${c.verify.expectedAddress}: ${expected}`;
    } else {
      value = value.replace('# For HNS full-chain tests, query through your HNS-aware resolver after the wallet update confirms.', c.verify.hnsFullChain);
    }
    return { value, explanation: translatedExplanation(c, line.explanation) };
  });
}

function localizeLine(line: GeneratedLine, c: CoreCopy): GeneratedLine {
  return {
    ...line,
    explanation: translatedExplanation(c, line.explanation)
  };
}

function localizeNotices(notices: BootstrapNotice[], c: CoreCopy): BootstrapNotice[] {
  return notices.map((notice) => {
    const estimated = notice.message.match(/^Estimated HNS parent-resource draft is (\d+) bytes\. Keep HNS name resources small\.$/);
    if (estimated) {
      return { ...notice, message: c.fallbackNotice || `Estimated HNS parent-resource draft is ${estimated[1]} bytes. Keep HNS name resources small.` };
    }
    return { ...notice, message: (c.notices[notice.message] ?? c.fallbackNotice) || notice.message };
  });
}

function localizeStatus(checks: StatusCheck[], c: CoreCopy): StatusCheck[] {
  return checks.map((check) => ({
    ...check,
    detail: (c.statusDetails[check.detail] ?? c.fallbackStatusDetail) || check.detail
  }));
}

function localizeHelpTips(result: BootstrapResult, input: BootstrapInput, c: CoreCopy): string[] {
  const tips = [
    c.helpTips.fastPath,
    c.helpTips.preset[result.diagnostics.dnsServerPreset],
    c.helpTips.tlsaPin,
    c.helpTips.parentSplit,
    c.helpTips.idna
  ];
  if (input.domainType === 'hns') tips.push(c.helpTips.hnsGlue(nameserverForHelp(result), rootless(result.normalizedDomain)));
  if (result.diagnostics.mode === 'hns-inline') tips.push(c.helpTips.hnsInline);
  return tips;
}

export function localizeBootstrapResult(result: BootstrapResult, input: BootstrapInput, language: LanguageCode): BootstrapResult {
  const c = copy[language] ?? en;
  const quickSteps = localizeQuickSteps(result, input, c);
  const webServerNotes = [
    { value: c.webNotes.serve, explanation: translatedExplanation(c, explanationsEn.webServe) },
    { value: c.webNotes.noPlugin, explanation: translatedExplanation(c, explanationsEn.webNoPlugin) }
  ];
  const sections = result.sections.map((section) => {
    if (section.id === 'steps') return { ...section, lines: quickSteps };
    if (section.id === 'web') return { ...section, lines: webServerNotes };
    if (section.id === 'verify') return { ...section, lines: localizeVerification(section.lines, c) };
    return { ...section, lines: section.lines.map((line) => localizeLine(line, c)) };
  });
  const notices = localizeNotices(result.notices, c);

  return {
    ...result,
    quickSteps,
    webServerNotes,
    verificationCommands: localizeVerification(result.verificationCommands, c),
    notices,
    warnings: notices.filter((item) => item.severity !== 'info').map((item) => item.message),
    statusChecks: localizeStatus(result.statusChecks, c),
    helpTips: localizeHelpTips(result, input, c),
    sections
  };
}
