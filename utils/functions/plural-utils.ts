interface PolishPluralForms {
  singular: string;
  few: string;
  many: string;
}

export function pluralizePolish(
  count: number,
  forms: PolishPluralForms,
): string {
  const abs = Math.abs(count);
  const lastDigit = abs % 10;
  const lastTwoDigits = abs % 100;

  if (abs === 1) {
    return forms.singular;
  }

  if (
    lastDigit >= 2 &&
    lastDigit <= 4 &&
    (lastTwoDigits < 12 || lastTwoDigits > 14)
  ) {
    return forms.few;
  }

  return forms.many;
}
