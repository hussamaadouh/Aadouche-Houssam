import { useCallback, useEffect, useState } from 'react';
import type { Locale, PageRoute } from './types/restaurant';
import { getPathForRoute, parseRouteFromLocation } from './utils/navigation';
import { ColombianBackdrop } from './components/ColombianBackdrop';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { StorySection } from './components/StorySection';
import { MenuSection } from './components/MenuSection';
import { ReservationSection } from './components/ReservationSection';
import { LocationSection } from './components/LocationSection';
import { Footer } from './components/Footer';

export default function App() {
  const [locale, setLocale] = useState<Locale>('es');
  const [prefilledDishNote, setPrefilledDishNote] = useState('');
  const [activeRoute, setActiveRoute] = useState<PageRoute>(() =>
    typeof window !== 'undefined'
      ? parseRouteFromLocation(window.location.pathname, window.location.hash)
      : 'home'
  );

  useEffect(() => {
    const handlePopState = () => {
      setActiveRoute(
        parseRouteFromLocation(window.location.pathname, window.location.hash)
      );
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = useCallback((route: PageRoute) => {
    const targetPath = getPathForRoute(route);
    if (window.location.pathname !== targetPath || window.location.hash) {
      window.history.pushState(null, '', targetPath);
    }
    setActiveRoute(route);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleReserveWithDish = useCallback(
    (dishName: string) => {
      setPrefilledDishNote(dishName);
      navigateTo('reservations');
    },
    [navigateTo]
  );

  return (
    <div className="relative min-h-screen flex flex-col bg-[#14100D] text-[#F5EFE6]">
      <ColombianBackdrop />
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header
          locale={locale}
          activeRoute={activeRoute}
          onNavigate={navigateTo}
        />
        <main className="flex-1 flex flex-col">
          {activeRoute === 'home' && (
            <HeroSection
              locale={locale}
              onLocaleChange={setLocale}
              onNavigate={navigateTo}
            />
          )}
          {activeRoute === 'story' && (
            <StorySection locale={locale} onNavigate={navigateTo} />
          )}
          {activeRoute === 'menu' && (
            <MenuSection
              locale={locale}
              onReserveWithDish={handleReserveWithDish}
            />
          )}
          {activeRoute === 'reservations' && (
            <ReservationSection
              locale={locale}
              prefilledDishNote={prefilledDishNote}
            />
          )}
          {activeRoute === 'location' && (
            <LocationSection locale={locale} onNavigate={navigateTo} />
          )}
        </main>
        <Footer
          locale={locale}
          activeRoute={activeRoute}
          onLocaleChange={setLocale}
          onNavigate={navigateTo}
        />
      </div>
    </div>
  );
}
