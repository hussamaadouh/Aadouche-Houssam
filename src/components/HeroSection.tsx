import type { MouseEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import type { Locale, PageRoute } from '../types/restaurant';
import { RESTAURANT_INFO, UI_COPY } from '../data/restaurant';
import { getPathForRoute } from '../utils/navigation';
import { ResilientImage } from './ResilientImage';

interface HeroSectionProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  onNavigate: (route: PageRoute) => void;
}

export function HeroSection({
  locale,
  onLocaleChange,
  onNavigate,
}: HeroSectionProps) {
  const copy = UI_COPY[locale].hero;

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

  return (
    <section
      id="inicio"
      className="flex-1 flex flex-col justify-center bg-[#14100D]/45"
    >
      <div className="max-w-6xl w-full mx-auto px-5 sm:px-8 pt-10 pb-12 lg:pt-14 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          <div className="lg:col-span-5 flex flex-col justify-between py-2">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <p className="text-xs font-medium tracking-wide text-[#D6CEC2]">
                  {copy.kicker}
                </p>

                <div
                  role="group"
                  aria-label="Language selector"
                  className="inline-flex items-center p-0.5 bg-[#1E1915] rounded-md border border-[#362E27]"
                >
                  <button
                    type="button"
                    onClick={() => onLocaleChange('es')}
                    aria-pressed={locale === 'es'}
                    className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      locale === 'es'
                        ? 'bg-[#EAB308] text-[#14100D]'
                        : 'text-[#D6CEC2] hover:text-white'
                    }`}
                  >
                    ES
                  </button>
                  <button
                    type="button"
                    onClick={() => onLocaleChange('en')}
                    aria-pressed={locale === 'en'}
                    className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      locale === 'en'
                        ? 'bg-[#EAB308] text-[#14100D]'
                        : 'text-[#D6CEC2] hover:text-white'
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>

              <h1 className="font-serif font-semibold text-[#FBF7F0] tracking-tight leading-[1.06] text-[clamp(2.5rem,4.2vw,3.9rem)] text-balance">
                {copy.title}
              </h1>

              <p className="mt-5 text-base sm:text-lg text-[#D6CEC2] leading-relaxed max-w-lg">
                {copy.subtitle}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={getPathForRoute('reservations')}
                onClick={(e) => handleLinkClick(e, 'reservations')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-[#14100D] bg-[#EAB308] hover:bg-[#FACC15] rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EAB308]"
              >
                <span>{copy.primaryCta}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>

              <a
                href={getPathForRoute('menu')}
                onClick={(e) => handleLinkClick(e, 'menu')}
                className="inline-flex items-center justify-center px-5 py-3.5 text-sm font-medium text-[#FBF7F0] border border-white/25 hover:border-white bg-[#14100D]/50 rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EAB308]"
              >
                {copy.secondaryCta}
              </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative h-full min-h-[280px] sm:min-h-[380px] lg:min-h-[460px] rounded-xl overflow-hidden border border-white/15 bg-[#1C1917]">
              <ResilientImage
                src={RESTAURANT_INFO.images.hero}
                alt={
                  locale === 'es'
                    ? 'Bandeja Paisa tradicional servida en El Peñol Paisa'
                    : 'Traditional Bandeja Paisa served at El Peñol Paisa'
                }
                fallbackLabel="Bandeja Paisa Tradicional"
                className="w-full h-full object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/85 via-black/40 to-transparent"
              />
              <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-4 text-white">
                <p className="font-serif text-lg sm:text-xl font-medium tracking-wide">
                  {locale === 'es'
                    ? 'Bandeja Paisa Tradicional'
                    : 'Traditional Bandeja Paisa'}
                </p>
                <span className="font-mono text-xs sm:text-sm tabular-nums text-[#FDE047] whitespace-nowrap">
                  18,90 €
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {copy.highlights.map((item, idx) => {
            const targetRoute: PageRoute =
              idx === 0 ? 'location' : idx === 1 ? 'story' : 'location';
            return (
              <a
                key={item.label}
                href={getPathForRoute(targetRoute)}
                onClick={(e) => handleLinkClick(e, targetRoute)}
                className="group flex flex-col gap-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#EAB308]"
              >
                <span className="text-xs font-medium text-[#A89F91] group-hover:text-[#FDE047] transition-colors">
                  {item.label}
                </span>
                <span className="text-sm sm:text-base font-medium text-[#FBF7F0]">
                  {item.value}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
