export const numberFormats = {
  currency: {
    style: "currency",
    currency: "USD",
  },
  percent: {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  },
  decimal: {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  },
  integer: {
    style: "decimal",
    maximumFractionDigits: 0,
  },
} as const;

export function formatNumber(
  value: number,
  format: keyof typeof numberFormats = "decimal",
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, numberFormats[format]).format(value);
}

export function formatCurrency(
  value: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    ...numberFormats.currency,
    currency,
  }).format(value);
}

export function formatPercent(value: number, locale: string = "en-US"): string {
  return new Intl.NumberFormat(locale, numberFormats.percent).format(
    value / 100
  );
}

export function formatFileSize(bytes: number): string {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${formatNumber(size, "decimal")} ${units[unitIndex]}`;
}

export function formatPhoneNumber(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return "(" + match[1] + ") " + match[2] + "-" + match[3];
  }
  return phoneNumber;
}

export function formatCreditCard(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\D/g, "");
  const groups = cleaned.match(/(\d{4})/g);
  return groups ? groups.join(" ") : cardNumber;
}

export function formatSocialSecurity(ssn: string): string {
  const cleaned = ssn.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{2})(\d{4})$/);
  if (match) {
    return match[1] + "-" + match[2] + "-" + match[3];
  }
  return ssn;
}

export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatRange(start: number, end: number): string {
  return `${formatNumber(start)} - ${formatNumber(end)}`;
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (remainingSeconds > 0 || parts.length === 0)
    parts.push(`${remainingSeconds}s`);

  return parts.join(" ");
}
