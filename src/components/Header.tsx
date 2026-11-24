import { useState, type MouseEvent } from 'react';
import { Menu, X } from 'lucide-react';
import type { Locale, PageRoute } from '../types/restaurant';
import { RESTAURANT_INFO, UI_COPY } from '../data/restaurant';
import { getPathForRoute } from '../utils/navigation';

interface HeaderProps {
  locale: Locale;
  activeRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
}

export function Header({ locale, activeRoute, onNavigate }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const copy = UI_COPY[locale].nav;

  const links: { route: PageRoute; label: string }[] = [
    { route: 'story', label: copy.story },
    { route: 'menu', label: copy.menu },
    { route: 'reservations', label: copy.reservations },
    { route: 'location', label: copy.location },
  ];

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
    setMobileOpen(false);
    onNavigate(route);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#14100D]/96 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-8">
        <a
          href={getPathForRoute('home')}
          onClick={(e) => handleLinkClick(e, 'home')}
          aria-current={activeRoute === 'home' ? 'page' : undefined}
          className="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-[#FBF7F0] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#EAB308]"
        >
          {RESTAURANT_INFO.name}
        </a>

        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#D6CEC2]"
        >
          {links.map((link) => {
            const isActive = activeRoute === link.route;
            return (
              <a
                key={link.route}
                href={getPathForRoute(link.route)}
                onClick={(e) => handleLinkClick(e, link.route)}
                aria-current={isActive ? 'page' : undefined}
                className={`underline-offset-8 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#EAB308] ${
                  isActive
                    ? 'text-[#FDE047] underline font-semibold'
                    : 'hover:text-[#FBF7F0] hover:underline'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href={getPathForRoute('reservations')}
            onClick={(e) => handleLinkClick(e, 'reservations')}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-[#14100D] bg-[#EAB308] hover:bg-[#FACC15] rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EAB308]"
          >
            {copy.bookCta}
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-md border border-white/15 text-[#FBF7F0] hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-[#EAB308]"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden border-t border-white/10 bg-[#14100D] px-5 py-4 flex flex-col gap-2"
        >
          {links.map((link) => {
            const isActive = activeRoute === link.route;
            return (
              <a
                key={link.route}
                href={getPathForRoute(link.route)}
                onClick={(e) => handleLinkClick(e, link.route)}
                aria-current={isActive ? 'page' : undefined}
                className={`py-2.5 text-base font-medium border-b border-white/10 last:border-b-0 ${
                  isActive ? 'text-[#FDE047] font-semibold' : 'text-[#F5EFE6]'
                }`}
              >
                {link.label}
              </a>
            );
          })}
          <a
            href={getPathForRoute('reservations')}
            onClick={(e) => handleLinkClick(e, 'reservations')}
            className="mt-2 inline-flex items-center justify-center px-5 py-3 text-sm font-semibold text-[#14100D] bg-[#EAB308] hover:bg-[#FACC15] rounded-md transition-colors"
          >
            {copy.bookCta}
          </a>
        </nav>
      )}
    </header>
  );
}
