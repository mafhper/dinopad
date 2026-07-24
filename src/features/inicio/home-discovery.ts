type Identifiable = { id: string };

function stableHash(value: string) {
  let hash = 2166136261;
  for (const character of value) {
    hash ^= character.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function dayKey(date = new Date()) {
  return date.toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });
}

export function rotateFromSeed<T extends Identifiable>(items: readonly T[], seed: string, amount: number) {
  if (!items.length || amount <= 0) return [];
  const ordered = [...items].sort((a, b) => a.id.localeCompare(b.id, 'pt-BR'));
  const start = stableHash(seed) % ordered.length;
  return Array.from({ length: Math.min(amount, ordered.length) }, (_, index) => ordered[(start + index) % ordered.length]);
}

export function selectDailyReadings<T extends Identifiable>(
  items: readonly T[],
  completedIds: ReadonlySet<string>,
  date = new Date(),
  amount = 3,
) {
  return rotateFromSeed(items, `leituras-${dayKey(date)}`, items.length)
    .filter(({ id }) => !completedIds.has(id))
    .slice(0, amount);
}

export function selectDailyItem<T extends Identifiable>(items: readonly T[], scope: string, date = new Date()) {
  return rotateFromSeed(items, `${scope}-${dayKey(date)}`, 1)[0];
}
