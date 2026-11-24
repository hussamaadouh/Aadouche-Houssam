import { useEffect, useMemo, useState } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import type { Locale, MenuCategoryId, MenuItem } from '../types/restaurant';
import { MENU_CATEGORIES, MENU_ITEMS, UI_COPY } from '../data/restaurant';
import { filterMenuItems, formatEuro, groupMenuByCategory } from '../utils/menuFilter';
import { ResilientImage } from './ResilientImage';

interface MenuSectionProps {
  locale: Locale;
  onReserveWithDish: (dishName: string) => void;
}

export function MenuSection({ locale, onReserveWithDish }: MenuSectionProps) {
  const copy = UI_COPY[locale].menu;
  const [selectedCategory, setSelectedCategory] = useState<MenuCategoryId | 'all'>('all');
  const [dietary, setDietary] = useState<'all' | 'gluten-free' | 'vegetarian'>('all');
  const [query, setQuery] = useState('');
  const [activeDish, setActiveDish] = useState<MenuItem | null>(null);

  useEffect(() => {
    if (!activeDish) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveDish(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeDish]);

  const filteredItems = useMemo(
    () =>
      filterMenuItems(MENU_ITEMS, {
        category: selectedCategory,
        query,
        dietary,
        locale,
      }),
    [selectedCategory, query, dietary, locale]
  );

  const groupedItems = useMemo(() => groupMenuByCategory(filteredItems), [filteredItems]);

  const visualHighlights = useMemo(
    () =>
      MENU_ITEMS.filter(
        (item) =>
          item.id === 'empanadas-criollas' ||
          item.id === 'ajiaco-santafereño' ||
          item.id === 'jugos-naturales'
      ),
    []
  );

  const renderFlagsText = (item: MenuItem) => {
    const labels: string[] = [];
    if (item.flags.includes('signature')) labels.push(copy.signatureLabel);
    if (item.flags.includes('gluten-free')) labels.push(copy.gfLabel);
    if (item.flags.includes('vegetarian')) labels.push(copy.vegLabel);
    return labels;
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setDietary('all');
    setQuery('');
  };

  const hasActiveFilter =
    selectedCategory !== 'all' || dietary !== 'all' || query.trim().length > 0;

  return (
    <section id="carta" className="flex-1 bg-[#14100D]/62 py-14 lg:py-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <p className="text-xs font-medium tracking-wide text-[#FDE047] mb-2">
              {copy.kicker}
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#FBF7F0] tracking-tight text-balance">
              {copy.title}
            </h1>
            <p className="mt-3 text-base text-[#D6CEC2] max-w-2xl">{copy.subtitle}</p>
          </div>

          <p className="font-mono text-xs text-[#C7BEB1] tabular-nums whitespace-nowrap shrink-0">
            {copy.showingCount(filteredItems.length)}
          </p>
        </div>

        {/* Featured Culinary Photography Trio */}
        {!hasActiveFilter && (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {visualHighlights.map((dish) => {
              const flagLabels = renderFlagsText(dish);
              return (
                <article
                  key={dish.id}
                  className="group bg-[#1E1915]/90 rounded-xl overflow-hidden border border-[#362E27] flex flex-col"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-[#14100D]">
                    <ResilientImage
                      src={dish.image ?? ''}
                      alt={dish.name[locale]}
                      fallbackLabel={dish.name[locale]}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      {flagLabels.length > 0 && (
                        <p className="text-xs text-[#A89F91] mb-1.5">
                          {flagLabels.join(' · ')}
                        </p>
                      )}
                      <div className="flex items-baseline justify-between gap-3">
                        <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#FBF7F0] leading-snug">
                          {dish.name[locale]}
                        </h3>
                        <span className="font-mono text-sm font-medium text-[#FDE047] tabular-nums whitespace-nowrap shrink-0">
                          {formatEuro(dish.priceEur, locale)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-[#C7BEB1] line-clamp-2 leading-relaxed">
                        {dish.description[locale]}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveDish(dish)}
                      className="self-start text-xs font-semibold text-[#FDE047] hover:text-[#FEF08A] underline underline-offset-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EAB308]"
                    >
                      {copy.viewDetail}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Filter & Search Toolbar */}
        <div className="mt-10 flex flex-col gap-4">
          <div
            role="tablist"
            aria-label="Menu categories"
            className="flex items-center gap-1.5 p-1.5 bg-[#1E1915]/90 rounded-lg border border-[#362E27] overflow-x-auto"
          >
            <button
              type="button"
              role="tab"
              aria-selected={selectedCategory === 'all'}
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#EAB308] text-[#14100D] font-semibold'
                  : 'text-[#D6CEC2] hover:text-white hover:bg-white/5'
              }`}
            >
              {copy.allCategories}
            </button>

            {MENU_CATEGORIES.map((category) => (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={selectedCategory === category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedCategory === category.id
                    ? 'bg-[#EAB308] text-[#14100D] font-semibold'
                    : 'text-[#D6CEC2] hover:text-white hover:bg-white/5'
                }`}
              >
                {category.label[locale]}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <label htmlFor="menu-search" className="sr-only">
                {copy.searchPlaceholder}
              </label>
              <Search
                className="w-4 h-4 text-[#A89F91] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="menu-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={copy.searchPlaceholder}
                className="w-full pl-10 pr-9 py-2.5 text-sm bg-[#1E1915] border border-[#3E352D] rounded-md text-[#FBF7F0] placeholder:text-[#8C8275] focus:outline-none focus:border-[#EAB308]"
              />
              {query.length > 0 && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label={copy.clearFilters}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#A89F91] hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div
              role="group"
              aria-label="Dietary filter"
              className="inline-flex items-center p-1 bg-[#1E1915]/90 rounded-lg border border-[#362E27] self-start sm:self-auto shrink-0"
            >
              {(
                [
                  { id: 'all', label: copy.dietaryAll },
                  { id: 'gluten-free', label: copy.dietaryGf },
                  { id: 'vegetarian', label: copy.dietaryVeg },
                ] as const
              ).map((option) => (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={dietary === option.id}
                  onClick={() => setDietary(option.id)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    dietary === option.id
                      ? 'bg-[#362E27] text-[#FBF7F0]'
                      : 'text-[#C7BEB1] hover:text-white'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Ledger */}
        {filteredItems.length === 0 ? (
          <div className="mt-12 py-14 px-6 text-center bg-[#1E1915]/90 rounded-xl border border-[#362E27]">
            <h3 className="font-serif text-2xl font-semibold text-[#FBF7F0]">
              {copy.emptyTitle}
            </h3>
            <p className="mt-2 text-sm text-[#C7BEB1] max-w-md mx-auto">
              {copy.emptyBody}
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-[#14100D] bg-[#EAB308] hover:bg-[#FACC15] rounded-md transition-colors cursor-pointer"
            >
              {copy.clearFilters}
            </button>
          </div>
        ) : (
          <div className="mt-12 space-y-12" data-testid="menu-ledger">
            {MENU_CATEGORIES.map((category) => {
              const items = groupedItems[category.id];
              if (items.length === 0) return null;

              return (
                <div key={category.id}>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-3 border-b border-white/15">
                    <h3 className="font-serif text-2xl font-semibold text-[#FBF7F0]">
                      {category.label[locale]}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#A89F91]">
                      {category.subtitle[locale]}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 divide-y md:divide-y-0 divide-white/10">
                    {items.map((item) => {
                      const flags = renderFlagsText(item);
                      return (
                        <div
                          key={item.id}
                          className="py-5 border-b border-white/10 flex flex-col justify-between gap-2.5"
                        >
                          <div>
                            <div className="flex items-baseline justify-between gap-4">
                              <button
                                type="button"
                                onClick={() => setActiveDish(item)}
                                className="text-left text-base sm:text-lg font-semibold text-[#FBF7F0] hover:text-[#FDE047] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EAB308]"
                              >
                                {item.name[locale]}
                              </button>
                              <span className="font-mono text-sm sm:text-base font-medium text-[#FDE047] tabular-nums whitespace-nowrap shrink-0">
                                {formatEuro(item.priceEur, locale)}
                              </span>
                            </div>

                            <p className="mt-1.5 text-sm text-[#C7BEB1] leading-relaxed">
                              {item.description[locale]}
                            </p>
                          </div>

                          <div className="flex items-center justify-between gap-4 pt-1">
                            <span className="text-xs text-[#A89F91]">
                              {flags.length > 0
                                ? flags.join(' · ')
                                : item.allergens[locale]}
                            </span>
                            <button
                              type="button"
                              onClick={() => setActiveDish(item)}
                              className="text-xs font-medium text-[#FDE047] hover:underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer"
                            >
                              {copy.viewDetail}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Dish Detail Modal */}
      {activeDish && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          onClick={() => setActiveDish(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="dish-modal-title"
            className="bg-[#1E1915] border border-[#362E27] text-[#F5EFE6] rounded-xl max-w-lg w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {activeDish.image && (
              <div className="aspect-[16/9] bg-[#14100D]">
                <ResilientImage
                  src={activeDish.image}
                  alt={activeDish.name[locale]}
                  fallbackLabel={activeDish.name[locale]}
                />
              </div>
            )}

            <div className="p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  {renderFlagsText(activeDish).length > 0 && (
                    <p className="text-xs text-[#FDE047] font-medium mb-1">
                      {renderFlagsText(activeDish).join(' · ')}
                    </p>
                  )}
                  <h3
                    id="dish-modal-title"
                    className="font-serif text-2xl sm:text-3xl font-semibold text-[#FBF7F0]"
                  >
                    {activeDish.name[locale]}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveDish(null)}
                  aria-label={copy.closeModal}
                  className="p-2 rounded-md text-[#C7BEB1] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="mt-1 font-mono text-base font-medium text-[#FDE047] tabular-nums">
                {formatEuro(activeDish.priceEur, locale)}
              </p>

              <p className="mt-4 text-sm text-[#D6CEC2] leading-relaxed">
                {activeDish.description[locale]}
              </p>

              <div className="mt-6 space-y-3 pt-4 border-t border-white/10 text-sm">
                <div>
                  <span className="text-xs font-medium text-[#A89F91] block">
                    {copy.ingredientsLabel}
                  </span>
                  <span className="text-[#F5EFE6]">{activeDish.ingredients[locale]}</span>
                </div>
                <div>
                  <span className="text-xs font-medium text-[#A89F91] block">
                    {copy.pairingLabel}
                  </span>
                  <span className="text-[#F5EFE6]">{activeDish.pairing[locale]}</span>
                </div>
                <div>
                  <span className="text-xs font-medium text-[#A89F91] block">
                    {copy.allergensLabel}
                  </span>
                  <span className="text-[#F5EFE6]">{activeDish.allergens[locale]}</span>
                </div>
              </div>

              <div className="mt-7 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveDish(null)}
                  className="px-4 py-2.5 text-sm font-medium text-[#D6CEC2] hover:text-white cursor-pointer"
                >
                  {copy.closeModal}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const dishTitle = activeDish.name[locale];
                    setActiveDish(null);
                    onReserveWithDish(dishTitle);
                  }}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#14100D] bg-[#EAB308] hover:bg-[#FACC15] rounded-md transition-colors cursor-pointer"
                >
                  <span>{copy.reserveFromDish}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
