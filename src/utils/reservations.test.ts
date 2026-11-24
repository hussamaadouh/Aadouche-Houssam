import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildCalendarIcs,
  generateBookingCode,
  getSlotAvailability,
  validateReservationInput,
  ZONE_CAPACITY,
} from './reservations';
import type { ReservationRecord } from '../types/restaurant';

test('validateReservationInput flags invalid required fields', () => {
  const errors = validateReservationInput(
    {
      date: 'invalid',
      time: '99:99',
      partySize: 12,
      zone: 'salon',
      guestName: 'A',
      guestEmail: 'bad-email',
      guestPhone: '12',
    },
    'es'
  );

  assert.ok(errors.date);
  assert.ok(errors.time);
  assert.ok(errors.partySize);
  assert.ok(errors.guestName);
  assert.ok(errors.guestEmail);
  assert.ok(errors.guestPhone);
});

test('validateReservationInput accepts valid booking payload', () => {
  const errors = validateReservationInput(
    {
      date: '2026-12-01',
      time: '20:30',
      partySize: 4,
      zone: 'salon',
      guestName: 'Camila Restrepo',
      guestEmail: 'camila@example.com',
      guestPhone: '+34 611 223 344',
      notes: 'Mesa tranquila',
    },
    'en'
  );

  assert.deepEqual(errors, {});
});

test('getSlotAvailability subtracts confirmed reservations and ignores cancelled ones', () => {
  const records: ReservationRecord[] = [
    {
      code: 'EPP-AA11',
      status: 'confirmed',
      createdAt: '2026-11-24T10:00:00.000Z',
      date: '2026-12-01',
      time: '20:30',
      partySize: 25,
      zone: 'salon',
      guestName: 'Grupo 1',
      guestEmail: 'g1@example.com',
      guestPhone: '600111222',
    },
    {
      code: 'EPP-BB22',
      status: 'cancelled',
      createdAt: '2026-11-24T10:05:00.000Z',
      date: '2026-12-01',
      time: '20:30',
      partySize: 10,
      zone: 'salon',
      guestName: 'Cancelado',
      guestEmail: 'c@example.com',
      guestPhone: '600333444',
    },
  ];

  const slots = getSlotAvailability(records, '2026-12-01', 'salon', 4);
  const slot2030 = slots.find((s) => s.time === '20:30');
  const slot2100 = slots.find((s) => s.time === '21:00');

  assert.ok(slot2030);
  assert.equal(slot2030.remainingSeats, ZONE_CAPACITY.salon - 25);
  assert.equal(slot2030.available, false);

  assert.ok(slot2100);
  assert.equal(slot2100.remainingSeats, ZONE_CAPACITY.salon);
  assert.equal(slot2100.available, true);
});

test('generateBookingCode creates unique EPP-prefixed codes', () => {
  const existing = new Set(['EPP-ABCD']);
  const code = generateBookingCode(existing);
  assert.match(code, /^EPP-[A-Z0-9]{4}$/);
  assert.notEqual(code, 'EPP-ABCD');
});

test('buildCalendarIcs emits valid VCALENDAR event block', () => {
  const ics = buildCalendarIcs({
    code: 'EPP-7712',
    status: 'confirmed',
    createdAt: '2026-11-24T10:00:00.000Z',
    date: '2026-12-01',
    time: '20:30',
    partySize: 4,
    zone: 'terraza',
    guestName: 'Camila Restrepo',
    guestEmail: 'camila@example.com',
    guestPhone: '+34 611 223 344',
  });

  assert.ok(ics.includes('BEGIN:VCALENDAR'));
  assert.ok(ics.includes('UID:EPP-7712@elpenolpaisa.es'));
  assert.ok(ics.includes('DTSTART:20261201T203000'));
  assert.ok(ics.includes('DTEND:20261201T223000'));
});
