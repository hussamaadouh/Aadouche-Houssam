import type { MouseEvent } from 'react';
import { ExternalLink, MapPin, Phone, Mail } from 'lucide-react';
import type { Locale, PageRoute } from '../types/restaurant';
import { OPENING_HOURS, RESTAURANT_INFO, UI_COPY } from '../data/restaurant';
import { getPathForRoute } from '../utils/navigation';

interface LocationSectionProps {
  locale: Locale;
  onNavigate: (route: PageRoute) => void;
}

export function LocationSection({ locale, onNavigate }: LocationSectionProps) {
  const copy = UI_COPY[locale].location;

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
      id="ubicacion"
      className="flex-1 bg-[#14100D]/64 py-14 lg:py-20"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <p className="text-xs font-medium tracking-wide text-[#FDE047] mb-2">
                {copy.kicker}
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#FBF7F0] tracking-tight text-balance">
                {copy.title}
              </h1>
              <p className="mt-3 text-base text-[#D6CEC2] leading-relaxed">
                {copy.subtitle}
              </p>

              <div className="mt-8 pt-6 border-t border-white/10">
                <h2 className="text-xs font-semibold tracking-wide text-[#A89F91] mb-4">
                  {copy.hoursTitle}
                </h2>
                <dl className="divide-y divide-white/10">
                  {OPENING_HOURS.map((row) => (
                    <div
                      key={row.days.es}
                      className="py-3 flex items-baseline justify-between gap-4 text-sm"
                    >
                      <dt className="font-medium text-[#FBF7F0]">{row.days[locale]}</dt>
                      <dd className="font-mono text-xs sm:text-sm text-[#D6CEC2] tabular-nums text-right">
                        {typeof row.hours === 'string' ? row.hours : row.hours[locale]}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-sm text-[#D6CEC2]">
              <a
                href={`tel:${RESTAURANT_INFO.phoneDisplay.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-2 hover:text-[#FDE047] transition-colors font-mono tabular-nums"
              >
                <Phone className="w-4 h-4 text-[#FDE047]" aria-hidden="true" />
                <span>{RESTAURANT_INFO.phoneDisplay}</span>
              </a>
              <a
                href={`mailto:${RESTAURANT_INFO.email}`}
                className="inline-flex items-center gap-2 hover:text-[#FDE047] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#FDE047]" aria-hidden="true" />
                <span>{RESTAURANT_INFO.email}</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="h-full bg-[#0F2417]/92 text-[#FAF9F6] rounded-xl p-7 sm:p-10 flex flex-col justify-between border border-[#1E462D]">
              <div>
                <div className="flex items-center gap-2 text-xs font-medium text-[#BBF7D0]">
                  <MapPin className="w-4 h-4 text-[#FDE047]" aria-hidden="true" />
                  <span>{copy.addressTitle}</span>
                </div>

                <h2 className="mt-4 font-serif text-2xl sm:text-3xl font-semibold text-white">
                  {RESTAURANT_INFO.fullTitle}
                </h2>
                <p className="mt-2 text-sm sm:text-base text-[#D1FAE5]/90">
                  {copy.addressText}
                </p>

                <div className="mt-8 grid grid-cols-2 gap-6 py-6 border-y border-white/15">
                  <div>
                    <span className="text-xs text-[#BBF7D0]/80 block">GPS</span>
                    <span className="mt-1 font-mono text-xs sm:text-sm text-white tabular-nums block">
                      {RESTAURANT_INFO.coordinates.label}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-[#BBF7D0]/80 block">
                      {locale === 'es' ? 'Acceso' : 'Access'}
                    </span>
                    <span className="mt-1 text-xs sm:text-sm text-white block">
                      A-4 · Salida 36 (Seseña)
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={RESTAURANT_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-[#14100D] bg-[#EAB308] hover:bg-[#FACC15] rounded-md transition-colors whitespace-nowrap"
                >
                  <span>{copy.openMapsBtn}</span>
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                </a>

                <a
                  href={getPathForRoute('reservations')}
                  onClick={(e) => handleLinkClick(e, 'reservations')}
                  className="inline-flex items-center justify-center px-5 py-3 text-sm font-medium text-white border border-white/25 hover:border-white rounded-md transition-colors whitespace-nowrap"
                >
                  {copy.reserveBtn}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
