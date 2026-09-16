const ITALIAN_TO_DOMAIN = {
  'nessuna notifica': 'none',
  '5 minuti prima': '5min',
  '15 minuti prima': '15min',
  '1 ora prima': '1h',
  '2 ore prima': '2h',
  '4 ore prima': '4h',
  '24 ore prima': '1d',
};

const DOMAIN_TO_ITALIAN = Object.fromEntries(
  Object.entries(ITALIAN_TO_DOMAIN).map(([key, value]) => [value, key]),
);

export function toDomainNotification(italianValue) {
  const domainValue = ITALIAN_TO_DOMAIN[italianValue];

  if (domainValue === undefined) {
    throw new Error(`Unknown Italian notification label: ${italianValue}`);
  }

  return domainValue;
}

export function toDomainNotificationIfItalian(value) {
  return ITALIAN_TO_DOMAIN[value] ?? value;
}

export function toItalianNotification(domainValue) {
  const italianValue = DOMAIN_TO_ITALIAN[domainValue];

  if (italianValue === undefined) {
    throw new Error(`Unknown domain notification value: ${domainValue}`);
  }

  return italianValue;
}