import type { DietaryFlag, Locale, MenuCategoryId, MenuItem } from '../types/restaurant';

export interface MenuFilterCriteria {
  category: MenuCategoryId | 'all';
  query: string;
  dietary: 'all' | 'gluten-free' | 'vegetarian';
  locale: Locale;
}

export function normalizeSearchText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export function filterMenuItems(
  items: readonly MenuItem[],
  criteria: MenuFilterCriteria
): MenuItem[] {
  const normalizedQuery = normalizeSearchText(criteria.query);

  return items.filter((item) => {
    if (criteria.category !== 'all' && item.category !== criteria.category) {
      return false;
    }

    if (criteria.dietary !== 'all') {
      const requiredFlag: DietaryFlag = criteria.dietary;
      if (!item.flags.includes(requiredFlag)) {
        return false;
      }
    }

    if (normalizedQuery.length > 0) {
      const searchable = normalizeSearchText(
        `${item.name.es} ${item.name.en} ${item.description.es} ${item.description.en} ${item.ingredients.es} ${item.ingredients.en}`
      );
      if (!searchable.includes(normalizedQuery)) {
        return false;
      }
    }

    return true;
  });
}

export function groupMenuByCategory(
  items: readonly MenuItem[]
): Record<MenuCategoryId, MenuItem[]> {
  const grouped: Record<MenuCategoryId, MenuItem[]> = {
    tipicos: [],
    entrantes: [],
    sopas: [],
    brasa: [],
    bebidas: [],
  };

  for (const item of items) {
    grouped[item.category].push(item);
  }

  return grouped;
}

export function formatEuro(amount: number, locale: Locale = 'es'): string {
  const formatted = amount.toFixed(2);
  return locale === 'es' ? `${formatted.replace('.', ',')} €` : `€${formatted}`;
}
