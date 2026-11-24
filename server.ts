import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { ReservationInput, ReservationRecord, SeatingZone } from './src/types/restaurant';
import {
  generateBookingCode,
  getSlotAvailability,
  isValidDateString,
  validateReservationInput,
  ZONE_CAPACITY,
} from './src/utils/reservations';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, 'data');
const STORE_PATH = path.resolve(DATA_DIR, 'reservations.json');

function getTodayIso(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function readStore(): ReservationRecord[] {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(STORE_PATH)) {
    const today = getTodayIso();
    const seed: ReservationRecord[] = [
      {
        code: 'EPP-4821',
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        date: today,
        time: '21:00',
        partySize: 6,
        zone: 'salon',
        guestName: 'Mateo Giraldo',
        guestEmail: 'mateo@example.com',
        guestPhone: '+34 612 340 912',
        notes: 'Mesa cerca de la cocina',
      },
      {
        code: 'EPP-7390',
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        date: today,
        time: '14:30',
        partySize: 4,
        zone: 'terraza',
        guestName: 'Lucía Morales',
        guestEmail: 'lucia@example.com',
        guestPhone: '+34 622 198 441',
      },
    ];
    fs.writeFileSync(STORE_PATH, JSON.stringify(seed, null, 2), 'utf8');
    return seed;
  }

  try {
    const raw = fs.readFileSync(STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStore(records: ReservationRecord[]): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(STORE_PATH, JSON.stringify(records, null, 2), 'utf8');
}

async function startServer() {
  const app = express();
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'el-penol-paisa' });
  });

  app.get('/api/availability', (req, res) => {
    const date = typeof req.query.date === 'string' ? req.query.date : getTodayIso();
    const zoneRaw = typeof req.query.zone === 'string' ? req.query.zone : 'salon';
    const partySizeRaw = Number(req.query.partySize ?? 2);

    if (!isValidDateString(date)) {
      res.status(400).json({ error: 'Invalid date parameter' });
      return;
    }

    const zone: SeatingZone =
      zoneRaw in ZONE_CAPACITY ? (zoneRaw as SeatingZone) : 'salon';
    const partySize =
      Number.isFinite(partySizeRaw) && partySizeRaw >= 1 && partySizeRaw <= 10
        ? Math.floor(partySizeRaw)
        : 2;

    const records = readStore();
    const slots = getSlotAvailability(records, date, zone, partySize);
    res.json({ date, zone, partySize, slots });
  });

  app.get('/api/reservations/:code', (req, res) => {
    const code = req.params.code.trim().toUpperCase();
    const records = readStore();
    const match = records.find((r) => r.code.toUpperCase() === code);
    if (!match) {
      res.status(404).json({ error: 'Reservation not found' });
      return;
    }
    res.json({ reservation: match });
  });

  app.post('/api/reservations', (req, res) => {
    const body = req.body as Partial<ReservationInput> & { locale?: 'es' | 'en' };
    const locale = body.locale === 'en' ? 'en' : 'es';

    const input: ReservationInput = {
      date: typeof body.date === 'string' ? body.date.trim() : '',
      time: typeof body.time === 'string' ? body.time.trim() : '',
      partySize: Number(body.partySize),
      zone: (body.zone as SeatingZone) ?? 'salon',
      guestName: typeof body.guestName === 'string' ? body.guestName.trim() : '',
      guestEmail: typeof body.guestEmail === 'string' ? body.guestEmail.trim() : '',
      guestPhone: typeof body.guestPhone === 'string' ? body.guestPhone.trim() : '',
      notes: typeof body.notes === 'string' ? body.notes.trim() : undefined,
    };

    const errors = validateReservationInput(input, locale);
    if (Object.keys(errors).length > 0) {
      res.status(400).json({ error: 'Validation failed', errors });
      return;
    }

    const records = readStore();
    const slots = getSlotAvailability(records, input.date, input.zone, input.partySize);
    const chosenSlot = slots.find((s) => s.time === input.time);

    if (!chosenSlot || !chosenSlot.available) {
      res.status(409).json({
        error:
          locale === 'es'
            ? 'Este horario ya no tiene suficientes plazas disponibles en la zona elegida.'
            : 'This time slot no longer has enough seats available in the selected zone.',
      });
      return;
    }

    const existingCodes = new Set(records.map((r) => r.code));
    const created: ReservationRecord = {
      ...input,
      code: generateBookingCode(existingCodes),
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    records.push(created);
    writeStore(records);

    res.status(201).json({ reservation: created });
  });

  app.patch('/api/reservations/:code/cancel', (req, res) => {
    const code = req.params.code.trim().toUpperCase();
    const records = readStore();
    const idx = records.findIndex((r) => r.code.toUpperCase() === code);
    if (idx === -1) {
      res.status(404).json({ error: 'Reservation not found' });
      return;
    }

    records[idx] = {
      ...records[idx],
      status: 'cancelled',
    };
    writeStore(records);
    res.json({ reservation: records[idx] });
  });

  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const port = Number(process.env.PORT ?? 3000);
  app.listen(port, '0.0.0.0', () => {
    console.log(`El Peñol Paisa server listening on http://localhost:${port}`);
  });
}

startServer();
