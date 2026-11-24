import type { MouseEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import type { Locale, PageRoute } from '../types/restaurant';
import { RESTAURANT_INFO, UI_COPY } from '../data/restaurant';
import { getPathForRoute } from '../utils/navigation';
import { ResilientImage } from './ResilientImage';

interface StorySectionProps {
  locale: Locale;
  onNavigate: (route: PageRoute) => void;
}

export function StorySection({ locale, onNavigate }: StorySectionProps) {
  const copy = UI_COPY[locale].story;

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
      id="historia"
      className="flex-1 bg-[#1A1511]/68 py-14 lg:py-20"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6">
            <div className="aspect-[3/4] max-h-[600px] w-full rounded-xl overflow-hidden border border-white/15 bg-[#14100D]">
              <ResilientImage
                src={RESTAURANT_INFO.images.interior}
                alt={
                  locale === 'es'
                    ? 'Equipo y familia de Restaurante Colombiano El Peñol Paisa bajo la bandera de Colombia'
                    : 'Team and family at Restaurante Colombiano El Peñol Paisa beneath the Colombian flag'
                }
                fallbackLabel="El Peñol Paisa · Nuestra Casa"
                className="w-full h-full object-cover object-[50%_20%]"
              />
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-center">
            <p className="text-xs font-medium tracking-wide text-[#FDE047] mb-3">
              {copy.kicker}
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#FBF7F0] tracking-tight text-balance">
              {copy.title}
            </h1>
            <p className="mt-4 text-base text-[#D6CEC2] leading-relaxed">
              {copy.lead}
            </p>

            <div className="mt-8 divide-y divide-white/10 border-t border-white/10">
              {copy.pillars.map((pillar) => (
                <div key={pillar.index} className="py-5 first:pt-5 last:pb-0">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-xs font-medium text-[#FDE047] tabular-nums">
                      {pillar.index}
                    </span>
                    <h2 className="text-base font-semibold text-[#FBF7F0]">
                      {pillar.title}
                    </h2>
                  </div>
                  <p className="mt-1.5 pl-7 text-sm text-[#C7BEB1] leading-relaxed">
                    {pillar.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={getPathForRoute('menu')}
                onClick={(e) => handleLinkClick(e, 'menu')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-[#14100D] bg-[#EAB308] hover:bg-[#FACC15] rounded-md transition-colors whitespace-nowrap"
              >
                <span>{UI_COPY[locale].hero.secondaryCta}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
              <a
                href={getPathForRoute('reservations')}
                onClick={(e) => handleLinkClick(e, 'reservations')}
                className="inline-flex items-center justify-center px-5 py-3 text-sm font-medium text-[#FBF7F0] border border-white/25 hover:border-white bg-[#14100D]/50 rounded-md transition-colors whitespace-nowrap"
              >
                {UI_COPY[locale].hero.primaryCta}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
