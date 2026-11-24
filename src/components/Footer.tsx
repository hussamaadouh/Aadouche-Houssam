import type { MouseEvent } from 'react';
import type { Locale, PageRoute } from '../types/restaurant';
import { RESTAURANT_INFO, UI_COPY } from '../data/restaurant';
import { getPathForRoute } from '../utils/navigation';

interface FooterProps {
  locale: Locale;
  activeRoute: PageRoute;
  onLocaleChange: (locale: Locale) => void;
  onNavigate: (route: PageRoute) => void;
}

export function Footer({
  locale,
  activeRoute,
  onLocaleChange,
  onNavigate,
}: FooterProps) {
  const copy = UI_COPY[locale];

  const handleLinkClick = (
    event: MouseEvent<HTMLAnchorElement>,
    route: PageRoute
  ) => {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }
    event.preventDefault();
    onNavigate(route);
  };

  const navLinks: { route: PageRoute; label: string }[] = [
    { route: 'story', label: copy.nav.story },
    { route: 'menu', label: copy.nav.menu },
    { route: 'reservations', label: copy.nav.reservations },
    { route: 'location', label: copy.nav.location },
  ];

  return (
    <footer className="bg-[#14100D]/88 border-t border-white/10 py-10">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <a
            href={getPathForRoute('home')}
            onClick={(e) => handleLinkClick(e, 'home')}
            className="font-serif text-xl font-semibold text-[#FBF7F0] hover:text-[#FDE047] transition-colors"
          >
            {RESTAURANT_INFO.name}
          </a>
          <p className="mt-1 text-xs text-[#A89F91]">
            {copy.footer.tagline} · {copy.footer.rights}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs text-[#C7BEB1]">
          {navLinks.map((item) => (
            <a
              key={item.route}
              href={getPathForRoute(item.route)}
              onClick={(e) => handleLinkClick(e, item.route)}
              aria-current={activeRoute === item.route ? 'page' : undefined}
              className={
                activeRoute === item.route
                  ? 'text-[#FDE047] font-semibold'
                  : 'hover:text-white'
              }
            >
              {item.label}
            </a>
          ))}

          <button
            type="button"
            onClick={() => onLocaleChange(locale === 'es' ? 'en' : 'es')}
            className="font-medium text-[#FDE047] hover:underline underline-offset-4 cursor-pointer"
          >
            {locale === 'es' ? 'English' : 'Español'}
          </button>
        </div>
      </div>
    </footer>
  );
}
