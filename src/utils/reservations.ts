import type {
  Locale,
  ReservationInput,
  ReservationRecord,
  ReservationValidationErrors,
  SeatingZone,
  SlotAvailability,
  TimeSlot,
} from '../types/restaurant';

export const SERVICE_SLOTS: readonly TimeSlot[] = [
  { time: '13:00', service: 'lunch' },
  { time: '13:30', service: 'lunch' },
  { time: '14:00', service: 'lunch' },
  { time: '14:30', service: 'lunch' },
  { time: '15:00', service: 'lunch' },
  { time: '20:00', service: 'dinner' },
  { time: '20:30', service: 'dinner' },
  { time: '21:00', service: 'dinner' },
  { time: '21:30', service: 'dinner' },
  { time: '22:00', service: 'dinner' },
] as const;

export const ZONE_CAPACITY: Record<SeatingZone, number> = {
  salon: 28,
  terraza: 18,
  barra: 10,
};

export function getSlotAvailability(
  records: readonly ReservationRecord[],
  date: string,
  zone: SeatingZone,
  partySize: number
): SlotAvailability[] {
  const capacity = ZONE_CAPACITY[zone];
  const requestedSeats = Math.max(1, Math.floor(partySize));

  return SERVICE_SLOTS.map((slot) => {
    const bookedSeats = records
      .filter(
        (r) =>
          r.status === 'confirmed' &&
          r.date === date &&
          r.zone === zone &&
          r.time === slot.time
      )
      .reduce((sum, r) => sum + r.partySize, 0);

    const remainingSeats = Math.max(0, capacity - bookedSeats);

    return {
      time: slot.time,
      service: slot.service,
      remainingSeats,
      capacity,
      available: remainingSeats >= requestedSeats,
    };
  });
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/[^\d]/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

export function isValidDateString(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

export function validateReservationInput(
  input: ReservationInput,
  locale: Locale = 'es'
): ReservationValidationErrors {
  const errors: ReservationValidationErrors = {};

  if (!isValidDateString(input.date)) {
    errors.date =
      locale === 'es' ? 'Selecciona una fecha válida.' : 'Select a valid date.';
  }

  if (!SERVICE_SLOTS.some((slot) => slot.time === input.time)) {
    errors.time =
      locale === 'es'
        ? 'Selecciona un horario de servicio.'
        : 'Select a valid service time.';
  }

  if (
    !Number.isInteger(input.partySize) ||
    input.partySize < 1 ||
    input.partySize > 10
  ) {
    errors.partySize =
      locale === 'es'
        ? 'Las reservas online admiten de 1 a 10 comensales.'
        : 'Online reservations support 1 to 10 guests.';
  }

  if (!(input.zone in ZONE_CAPACITY)) {
    errors.zone =
      locale === 'es' ? 'Selecciona una zona válida.' : 'Select a valid zone.';
  }

  if (input.guestName.trim().length < 2) {
    errors.guestName =
      locale === 'es'
        ? 'Introduce el nombre completo del titular.'
        : 'Please enter the guest full name.';
  }

  if (!isValidEmail(input.guestEmail)) {
    errors.guestEmail =
      locale === 'es'
        ? 'Introduce un correo electrónico válido.'
        : 'Please enter a valid email address.';
  }

  if (!isValidPhone(input.guestPhone)) {
    errors.guestPhone =
      locale === 'es'
        ? 'Introduce un teléfono de contacto válido.'
        : 'Please enter a valid phone number.';
  }

  return errors;
}

export function generateBookingCode(existingCodes: ReadonlySet<string>): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  for (let attempt = 0; attempt < 100; attempt += 1) {
    let suffix = '';
    for (let i = 0; i < 4; i += 1) {
      suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    const candidate = `EPP-${suffix}`;
    if (!existingCodes.has(candidate)) {
      return candidate;
    }
  }
  return `EPP-${Date.now().toString(36).slice(-4).toUpperCase()}`;
}

export function buildCalendarIcs(record: ReservationRecord): string {
  const [year, month, day] = record.date.split('-');
  const [hour, minute] = record.time.split(':');
  const startStamp = `${year}${month}${day}T${hour}${minute}00`;
  const endHourNum = (Number(hour) + 2) % 24;
  const endHour = String(endHourNum).padStart(2, '0');
  const endStamp = `${year}${month}${day}T${endHour}${minute}00`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//El Penol Paisa//Reservas//ES',
    'BEGIN:VEVENT',
    `UID:${record.code}@elpenolpaisa.es`,
    `DTSTART:${startStamp}`,
    `DTEND:${endStamp}`,
    `SUMMARY:Mesa en El Peñol Paisa (${record.partySize} personas)`,
    `DESCRIPTION:Código de reserva: ${record.code} · Zona: ${record.zone}`,
    'LOCATION:Restaurante Colombiano El Peñol Paisa\\, Seseña\\, Toledo',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}
