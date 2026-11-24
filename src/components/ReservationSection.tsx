import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Calendar, CheckCircle2, Minus, Plus, Search, XCircle } from 'lucide-react';
import type {
  Locale,
  ReservationRecord,
  ReservationValidationErrors,
  SeatingZone,
  SlotAvailability,
} from '../types/restaurant';
import { SEATING_ZONES, UI_COPY } from '../data/restaurant';
import {
  buildCalendarIcs,
  SERVICE_SLOTS,
  validateReservationInput,
} from '../utils/reservations';

interface ReservationSectionProps {
  locale: Locale;
  prefilledDishNote: string;
}

function getTodayIso(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function ReservationSection({
  locale,
  prefilledDishNote,
}: ReservationSectionProps) {
  const copy = UI_COPY[locale].reservations;
  const todayIso = useMemo(() => getTodayIso(), []);
  const confirmationRef = useRef<HTMLDivElement | null>(null);

  const [mode, setMode] = useState<'new' | 'manage'>('new');
  const [date, setDate] = useState(todayIso);
  const [partySize, setPartySize] = useState(2);
  const [zone, setZone] = useState<SeatingZone>('salon');
  const [selectedTime, setSelectedTime] = useState('20:30');

  const [slots, setSlots] = useState<SlotAvailability[]>(() =>
    SERVICE_SLOTS.map((s) => ({
      time: s.time,
      service: s.service,
      remainingSeats: 16,
      capacity: 28,
      available: true,
    }))
  );
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<ReservationValidationErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<ReservationRecord | null>(
    null
  );

  const [lookupCode, setLookupCode] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [foundBooking, setFoundBooking] = useState<ReservationRecord | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (confirmedBooking && confirmationRef.current) {
      confirmationRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [confirmedBooking]);

  useEffect(() => {
    if (prefilledDishNote) {
      setMode('new');
      setConfirmedBooking(null);
      setNotes((prev) => {
        const prefix =
          locale === 'es' ? `Interés en: ${prefilledDishNote}` : `Dish interest: ${prefilledDishNote}`;
        return prev ? `${prev} · ${prefix}` : prefix;
      });
    }
  }, [prefilledDishNote, locale]);

  const fetchAvailability = async (
    targetDate: string,
    targetZone: SeatingZone,
    targetParty: number
  ) => {
    setLoadingSlots(true);
    try {
      const params = new URLSearchParams({
        date: targetDate,
        zone: targetZone,
        partySize: String(targetParty),
      });
      const res = await fetch(`/api/availability?${params.toString()}`);
      if (!res.ok) return;
      const data = (await res.json()) as { slots: SlotAvailability[] };
      if (Array.isArray(data.slots)) {
        setSlots(data.slots);
        const currentStillAvailable = data.slots.find(
          (s) => s.time === selectedTime && s.available
        );
        if (!currentStillAvailable) {
          const firstAvailable = data.slots.find((s) => s.available);
          if (firstAvailable) {
            setSelectedTime(firstAvailable.time);
          }
        }
      }
    } catch {
      // Keep optimistic slots if offline
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    fetchAvailability(date, zone, partySize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, zone, partySize]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitError(null);

    const payload = {
      date,
      time: selectedTime,
      partySize,
      zone,
      guestName,
      guestEmail,
      guestPhone,
      notes,
    };

    const clientErrors = validateReservationInput(payload, locale);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, locale }),
      });
      const data = (await res.json()) as {
        reservation?: ReservationRecord;
        errors?: ReservationValidationErrors;
        error?: string;
      };

      if (!res.ok || !data.reservation) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setSubmitError(data.error || 'Error creating reservation');
        }
        return;
      }

      setConfirmedBooking(data.reservation);
      await fetchAvailability(date, zone, partySize);
    } catch {
      setSubmitError(
        locale === 'es'
          ? 'No pudimos conectar con el servidor de reservas. Inténtalo de nuevo.'
          : 'Unable to reach the reservation server. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleLookup = async (event?: FormEvent, explicitCode?: string) => {
    if (event) event.preventDefault();
    const targetCode = (explicitCode ?? lookupCode).trim().toUpperCase();
    if (!targetCode) {
      setLookupError(copy.notFoundError);
      return;
    }

    setLookupLoading(true);
    setLookupError(null);
    setFoundBooking(null);

    try {
      const res = await fetch(`/api/reservations/${encodeURIComponent(targetCode)}`);
      const data = (await res.json()) as { reservation?: ReservationRecord };
      if (!res.ok || !data.reservation) {
        setLookupError(copy.notFoundError);
        return;
      }
      setFoundBooking(data.reservation);
    } catch {
      setLookupError(copy.notFoundError);
    } finally {
      setLookupLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!foundBooking || foundBooking.status === 'cancelled') return;
    setCancelling(true);
    try {
      const res = await fetch(
        `/api/reservations/${encodeURIComponent(foundBooking.code)}/cancel`,
        { method: 'PATCH' }
      );
      const data = (await res.json()) as { reservation?: ReservationRecord };
      if (res.ok && data.reservation) {
        setFoundBooking(data.reservation);
        await fetchAvailability(date, zone, partySize);
      }
    } finally {
      setCancelling(false);
    }
  };

  const lunchSlots = slots.filter((s) => s.service === 'lunch');
  const dinnerSlots = slots.filter((s) => s.service === 'dinner');

  const zoneLabel = (zoneId: SeatingZone) =>
    SEATING_ZONES.find((z) => z.id === zoneId)?.label[locale] ?? zoneId;

  const icsDownloadHref = confirmedBooking
    ? `data:text/calendar;charset=utf-8,${encodeURIComponent(
        buildCalendarIcs(confirmedBooking)
      )}`
    : '';

  return (
    <section id="reservas" className="flex-1 bg-[#1A1511]/72 py-14 lg:py-20">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <p className="text-xs font-medium tracking-wide text-[#FDE047] mb-2">
              {copy.kicker}
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#FBF7F0] tracking-tight text-balance">
              {copy.title}
            </h1>
            <p className="mt-3 text-base text-[#D6CEC2] max-w-xl">{copy.subtitle}</p>
          </div>

          <div
            role="tablist"
            aria-label="Reservation mode"
            className="inline-flex items-center p-1 bg-[#14100D]/80 border border-[#362E27] rounded-lg shrink-0 self-start md:self-auto"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'new'}
              onClick={() => setMode('new')}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                mode === 'new'
                  ? 'bg-[#EAB308] text-[#14100D] font-semibold'
                  : 'text-[#D6CEC2] hover:text-white'
              }`}
            >
              {copy.tabNew}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'manage'}
              onClick={() => setMode('manage')}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                mode === 'manage'
                  ? 'bg-[#EAB308] text-[#14100D] font-semibold'
                  : 'text-[#D6CEC2] hover:text-white'
              }`}
            >
              {copy.tabManage}
            </button>
          </div>
        </div>

        {mode === 'new' ? (
          confirmedBooking ? (
            <div
              ref={confirmationRef}
              data-testid="booking-confirmation"
              className="mt-10 bg-[#1E1915]/92 border border-[#362E27] rounded-xl p-6 sm:p-10"
            >
              <div className="flex items-start gap-3 text-[#86EFAC]">
                <CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#FBF7F0]">
                    {copy.confirmedTitle}
                  </h3>
                  <p className="mt-1 text-sm text-[#C7BEB1]">{copy.confirmedSubtitle}</p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-6 border-y border-white/10">
                <div>
                  <span className="text-xs text-[#A89F91] block">{copy.codeLabel}</span>
                  <span className="mt-1 font-mono text-lg font-medium text-[#FDE047] tabular-nums block">
                    {confirmedBooking.code}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-[#A89F91] block">{copy.dateLabel}</span>
                  <span className="mt-1 font-mono text-base text-[#FBF7F0] tabular-nums block">
                    {confirmedBooking.date} · {confirmedBooking.time}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-[#A89F91] block">{copy.guestsLabel}</span>
                  <span className="mt-1 text-base font-medium text-[#FBF7F0] tabular-nums block">
                    {confirmedBooking.partySize}{' '}
                    {confirmedBooking.partySize === 1
                      ? copy.guestSingular
                      : copy.guestPlural}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-[#A89F91] block">{copy.zoneLabel}</span>
                  <span className="mt-1 text-base font-medium text-[#FBF7F0] block">
                    {zoneLabel(confirmedBooking.zone)}
                  </span>
                </div>
              </div>

              <div className="mt-5 text-sm text-[#D6CEC2]">
                <span>{confirmedBooking.guestName}</span>
                <span aria-hidden="true"> · </span>
                <span>{confirmedBooking.guestEmail}</span>
                <span aria-hidden="true"> · </span>
                <span className="font-mono tabular-nums">
                  {confirmedBooking.guestPhone}
                </span>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={icsDownloadHref}
                  download={`reserva-${confirmedBooking.code}.ics`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#14100D] bg-[#EAB308] hover:bg-[#FACC15] rounded-md transition-colors whitespace-nowrap"
                >
                  <Calendar className="w-4 h-4" aria-hidden="true" />
                  <span>{copy.downloadIcs}</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setMode('manage');
                    setLookupCode(confirmedBooking.code);
                    handleLookup(undefined, confirmedBooking.code);
                  }}
                  className="px-4 py-2.5 text-sm font-medium text-[#FBF7F0] border border-white/20 hover:border-white rounded-md transition-colors cursor-pointer"
                >
                  {copy.manageBookingBtn}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setConfirmedBooking(null);
                    setGuestName('');
                    setGuestEmail('');
                    setGuestPhone('');
                    setNotes('');
                  }}
                  className="px-4 py-2.5 text-sm font-medium text-[#C7BEB1] hover:text-white cursor-pointer"
                >
                  {copy.newBookingBtn}
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="mt-10 bg-[#1E1915]/92 border border-[#362E27] rounded-xl p-6 sm:p-8 space-y-8"
            >
              {/* Step 1: Date, Guests, Zone */}
              <div>
                <h3 className="text-sm font-semibold text-[#FBF7F0] mb-4">
                  {copy.stepWhen}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  <div className="md:col-span-4">
                    <label
                      htmlFor="res-date"
                      className="block text-xs font-medium text-[#C7BEB1] mb-1.5"
                    >
                      {copy.dateLabel}
                    </label>
                    <input
                      id="res-date"
                      type="date"
                      min={todayIso}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm font-mono tabular-nums bg-[#14100D] border border-[#3E352D] rounded-md text-[#FBF7F0] focus:outline-none focus:border-[#EAB308]"
                    />
                  </div>

                  <div className="md:col-span-4">
                    <span className="block text-xs font-medium text-[#C7BEB1] mb-1.5">
                      {copy.guestsLabel}
                    </span>
                    <div className="flex items-center justify-between bg-[#14100D] border border-[#3E352D] rounded-md px-2 py-1.5">
                      <button
                        type="button"
                        onClick={() => setPartySize((p) => Math.max(1, p - 1))}
                        disabled={partySize <= 1}
                        aria-label="Decrease guests"
                        className="w-9 h-8 inline-flex items-center justify-center rounded text-[#FBF7F0] hover:bg-white/10 disabled:opacity-40 cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span
                        data-testid="party-size-value"
                        className="text-sm font-medium text-[#FBF7F0] tabular-nums"
                      >
                        {partySize}{' '}
                        {partySize === 1 ? copy.guestSingular : copy.guestPlural}
                      </span>
                      <button
                        type="button"
                        onClick={() => setPartySize((p) => Math.min(10, p + 1))}
                        disabled={partySize >= 10}
                        aria-label="Increase guests"
                        className="w-9 h-8 inline-flex items-center justify-center rounded text-[#FBF7F0] hover:bg-white/10 disabled:opacity-40 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-4">
                    <label
                      htmlFor="res-zone"
                      className="block text-xs font-medium text-[#C7BEB1] mb-1.5"
                    >
                      {copy.zoneLabel}
                    </label>
                    <select
                      id="res-zone"
                      value={zone}
                      onChange={(e) => setZone(e.target.value as SeatingZone)}
                      className="w-full px-3.5 py-2.5 text-sm bg-[#14100D] border border-[#3E352D] rounded-md text-[#FBF7F0] focus:outline-none focus:border-[#EAB308]"
                    >
                      {SEATING_ZONES.map((z) => (
                        <option key={z.id} value={z.id}>
                          {z.label[locale]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <p className="mt-2.5 text-xs text-[#A89F91]">
                  {SEATING_ZONES.find((z) => z.id === zone)?.description[locale]}
                </p>
              </div>

              {/* Step 2: Time Slots */}
              <div className="pt-6 border-t border-white/10">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <h3 className="text-sm font-semibold text-[#FBF7F0]">
                    {copy.stepTime}
                  </h3>
                  {loadingSlots && (
                    <span className="text-xs text-[#A89F91]">...</span>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-medium text-[#A89F91] mb-2.5">
                      {copy.lunchTitle}
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-3 gap-2">
                      {lunchSlots.map((slot) => {
                        const isSelected = selectedTime === slot.time;
                        return (
                          <button
                            key={slot.time}
                            type="button"
                            disabled={!slot.available}
                            aria-pressed={isSelected}
                            onClick={() => setSelectedTime(slot.time)}
                            className={`px-3 py-2.5 rounded-md border text-left transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                              isSelected
                                ? 'bg-[#EAB308] border-[#EAB308] text-[#14100D]'
                                : 'bg-[#14100D] border-[#3E352D] text-[#FBF7F0] hover:border-[#EAB308]'
                            }`}
                          >
                            <span className="block font-mono text-sm font-medium tabular-nums">
                              {slot.time}
                            </span>
                            <span
                              className={`block text-[11px] tabular-nums ${
                                isSelected ? 'text-[#14100D]/80 font-medium' : 'text-[#A89F91]'
                              }`}
                            >
                              {slot.available
                                ? copy.seatsLeft(slot.remainingSeats)
                                : copy.fullLabel}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-[#A89F91] mb-2.5">
                      {copy.dinnerTitle}
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-3 gap-2">
                      {dinnerSlots.map((slot) => {
                        const isSelected = selectedTime === slot.time;
                        return (
                          <button
                            key={slot.time}
                            type="button"
                            disabled={!slot.available}
                            aria-pressed={isSelected}
                            onClick={() => setSelectedTime(slot.time)}
                            className={`px-3 py-2.5 rounded-md border text-left transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                              isSelected
                                ? 'bg-[#EAB308] border-[#EAB308] text-[#14100D]'
                                : 'bg-[#14100D] border-[#3E352D] text-[#FBF7F0] hover:border-[#EAB308]'
                            }`}
                          >
                            <span className="block font-mono text-sm font-medium tabular-nums">
                              {slot.time}
                            </span>
                            <span
                              className={`block text-[11px] tabular-nums ${
                                isSelected ? 'text-[#14100D]/80 font-medium' : 'text-[#A89F91]'
                              }`}
                            >
                              {slot.available
                                ? copy.seatsLeft(slot.remainingSeats)
                                : copy.fullLabel}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
                {errors.time && (
                  <p role="alert" className="mt-2 text-xs text-[#FCA5A5]">
                    {errors.time}
                  </p>
                )}
              </div>

              {/* Step 3: Guest Details */}
              <div className="pt-6 border-t border-white/10">
                <h3 className="text-sm font-semibold text-[#FBF7F0] mb-4">
                  {copy.stepDetails}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="guest-name"
                      className="block text-xs font-medium text-[#C7BEB1] mb-1.5"
                    >
                      {copy.nameLabel}
                    </label>
                    <input
                      id="guest-name"
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder={copy.namePlaceholder}
                      aria-invalid={Boolean(errors.guestName)}
                      className="w-full px-3.5 py-2.5 text-sm bg-[#14100D] border border-[#3E352D] rounded-md text-[#FBF7F0] placeholder:text-[#78716C] focus:outline-none focus:border-[#EAB308]"
                    />
                    {errors.guestName && (
                      <p role="alert" className="mt-1.5 text-xs text-[#FCA5A5]">
                        {errors.guestName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="guest-email"
                      className="block text-xs font-medium text-[#C7BEB1] mb-1.5"
                    >
                      {copy.emailLabel}
                    </label>
                    <input
                      id="guest-email"
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder={copy.emailPlaceholder}
                      aria-invalid={Boolean(errors.guestEmail)}
                      className="w-full px-3.5 py-2.5 text-sm bg-[#14100D] border border-[#3E352D] rounded-md text-[#FBF7F0] placeholder:text-[#78716C] focus:outline-none focus:border-[#EAB308]"
                    />
                    {errors.guestEmail && (
                      <p role="alert" className="mt-1.5 text-xs text-[#FCA5A5]">
                        {errors.guestEmail}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="guest-phone"
                      className="block text-xs font-medium text-[#C7BEB1] mb-1.5"
                    >
                      {copy.phoneLabel}
                    </label>
                    <input
                      id="guest-phone"
                      type="tel"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder={copy.phonePlaceholder}
                      aria-invalid={Boolean(errors.guestPhone)}
                      className="w-full px-3.5 py-2.5 text-sm font-mono tabular-nums bg-[#14100D] border border-[#3E352D] rounded-md text-[#FBF7F0] placeholder:font-sans placeholder:text-[#78716C] focus:outline-none focus:border-[#EAB308]"
                    />
                    {errors.guestPhone && (
                      <p role="alert" className="mt-1.5 text-xs text-[#FCA5A5]">
                        {errors.guestPhone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="guest-notes"
                    className="block text-xs font-medium text-[#C7BEB1] mb-1.5"
                  >
                    {copy.notesLabel}
                  </label>
                  <input
                    id="guest-notes"
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={copy.notesPlaceholder}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#14100D] border border-[#3E352D] rounded-md text-[#FBF7F0] placeholder:text-[#78716C] focus:outline-none focus:border-[#EAB308]"
                  />
                </div>
              </div>

              {submitError && (
                <div
                  role="alert"
                  className="p-3.5 rounded-md bg-[#450A0A]/70 border border-[#991B1B] text-sm text-[#FCA5A5]"
                >
                  {submitError}
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <p className="text-xs text-[#A89F91] font-mono tabular-nums">
                  {date} · {selectedTime} · {partySize}{' '}
                  {partySize === 1 ? copy.guestSingular : copy.guestPlural} ·{' '}
                  {zoneLabel(zone)}
                </p>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-[#14100D] bg-[#EAB308] hover:bg-[#FACC15] disabled:opacity-60 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {submitting ? copy.submittingBtn : copy.submitBtn}
                </button>
              </div>
            </form>
          )
        ) : (
          <div className="mt-10 bg-[#1E1915]/92 border border-[#362E27] rounded-xl p-6 sm:p-8">
            <h3 className="font-serif text-2xl font-semibold text-[#FBF7F0]">
              {copy.lookupTitle}
            </h3>
            <p className="mt-1.5 text-sm text-[#C7BEB1]">{copy.lookupSubtitle}</p>

            <form
              onSubmit={(e) => handleLookup(e)}
              className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-end gap-3 max-w-lg"
            >
              <div className="flex-1">
                <label
                  htmlFor="lookup-code"
                  className="block text-xs font-medium text-[#C7BEB1] mb-1.5"
                >
                  {copy.lookupLabel}
                </label>
                <input
                  id="lookup-code"
                  type="text"
                  value={lookupCode}
                  onChange={(e) => setLookupCode(e.target.value.toUpperCase())}
                  placeholder={copy.lookupPlaceholder}
                  className="w-full px-3.5 py-2.5 text-sm font-mono uppercase bg-[#14100D] border border-[#3E352D] rounded-md text-[#FBF7F0] placeholder:text-[#78716C] focus:outline-none focus:border-[#EAB308]"
                />
              </div>

              <button
                type="submit"
                disabled={lookupLoading}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#14100D] bg-[#EAB308] hover:bg-[#FACC15] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Search className="w-4 h-4" aria-hidden="true" />
                <span>{lookupLoading ? copy.searchingBtn : copy.lookupBtn}</span>
              </button>
            </form>

            {lookupError && (
              <p role="alert" className="mt-4 text-sm text-[#FCA5A5]">
                {lookupError}
              </p>
            )}

            {foundBooking && (
              <div
                data-testid="lookup-result"
                className="mt-8 pt-6 border-t border-white/10"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    {foundBooking.status === 'confirmed' ? (
                      <CheckCircle2
                        className="w-5 h-5 text-[#86EFAC]"
                        aria-hidden="true"
                      />
                    ) : (
                      <XCircle className="w-5 h-5 text-[#FCA5A5]" aria-hidden="true" />
                    )}
                    <span className="font-mono text-base font-medium text-[#FBF7F0] tabular-nums">
                      {foundBooking.code}
                    </span>
                    <span aria-hidden="true" className="text-[#78716C]">
                      ·
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        foundBooking.status === 'confirmed'
                          ? 'text-[#86EFAC]'
                          : 'text-[#FCA5A5]'
                      }`}
                    >
                      {foundBooking.status === 'confirmed'
                        ? copy.statusConfirmed
                        : copy.statusCancelled}
                    </span>
                  </div>

                  {foundBooking.status === 'confirmed' && (
                    <button
                      type="button"
                      onClick={handleCancelBooking}
                      disabled={cancelling}
                      className="px-4 py-2 text-xs sm:text-sm font-medium text-[#FCA5A5] border border-[#991B1B] bg-[#450A0A]/60 hover:bg-[#7F1D1D]/70 rounded-md transition-colors cursor-pointer"
                    >
                      {cancelling ? copy.cancellingBtn : copy.cancelBtn}
                    </button>
                  )}
                </div>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-xs text-[#A89F91] block">{copy.dateLabel}</span>
                    <span className="font-mono tabular-nums text-[#FBF7F0]">
                      {foundBooking.date} · {foundBooking.time}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-[#A89F91] block">
                      {copy.guestsLabel}
                    </span>
                    <span className="text-[#FBF7F0] tabular-nums">
                      {foundBooking.partySize}{' '}
                      {foundBooking.partySize === 1
                        ? copy.guestSingular
                        : copy.guestPlural}{' '}
                      · {zoneLabel(foundBooking.zone)}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-[#A89F91] block">
                      {copy.nameLabel}
                    </span>
                    <span className="text-[#FBF7F0]">{foundBooking.guestName}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
