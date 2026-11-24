import test from 'node:test';
import assert from 'node:assert/strict';
import { MENU_ITEMS } from '../data/restaurant';
import { filterMenuItems, formatEuro, groupMenuByCategory } from './menuFilter';

test('filterMenuItems returns all items when category and dietary are all and query is empty', () => {
  const result = filterMenuItems(MENU_ITEMS, {
    category: 'all',
    query: '',
    dietary: 'all',
    locale: 'es',
  });
  assert.equal(result.length, MENU_ITEMS.length);
});

test('filterMenuItems filters by category and accent-insensitive query', () => {
  const result = filterMenuItems(MENU_ITEMS, {
    category: 'tipicos',
    query: 'frijol',
    dietary: 'all',
    locale: 'es',
  });
  assert.ok(result.length >= 2);
  assert.ok(result.every((item) => item.category === 'tipicos'));
});

test('filterMenuItems filters by vegetarian dietary flag', () => {
  const result = filterMenuItems(MENU_ITEMS, {
    category: 'all',
    query: '',
    dietary: 'vegetarian',
    locale: 'en',
  });
  assert.ok(result.length > 0);
  assert.ok(result.every((item) => item.flags.includes('vegetarian')));
});

test('groupMenuByCategory groups items without dropping any', () => {
  const grouped = groupMenuByCategory(MENU_ITEMS);
  const total = Object.values(grouped).reduce((sum, list) => sum + list.length, 0);
  assert.equal(total, MENU_ITEMS.length);
});

test('formatEuro formats Spanish comma decimals and English dot decimals', () => {
  assert.equal(formatEuro(18.9, 'es'), '18,90 €');
  assert.equal(formatEuro(18.9, 'en'), '€18.90');
});
