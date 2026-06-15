# Vorrat & Ernährung

Eine lokale, installierbare **PWA** für iPad zur Verwaltung von
Lebensmittel-Vorrat und Ernährung. Single-User, kein Login, alle Daten bleiben
lokal auf dem Gerät (IndexedDB). Oberfläche auf Deutsch, offline-fähig.

> Vorrat, Einkauf, Rezepte und Ernährungs-Tracking hängen zusammen: Ein
> „gegessen/gekocht"-Vorgang bucht ins Tagebuch **und** zieht den Vorrat ab.

Details zu Produkt und Design: [`PRODUCT.md`](./PRODUCT.md) ·
[`DESIGN.md`](./DESIGN.md).

## Features

- **Heute** – Kalorien-Ring, Makro-Balken, „verbleibend heute", Mahlzeiten,
  Empfehlungen (Tagesziel füllen / Ablaufendes verwerten / Abwechslung).
- **Vorrat** – Barcode-Scan (Open Food Facts, kein Key) oder manuell, Lagerorte,
  MHD-/„wenig"-Badges, Grundnahrungsmittel mit Mindestbestand.
- **Einkauf** – manuell + Auto-Nachkauf, Abhaken per Swipe, „in den Vorrat
  übernehmen".
- **Rezepte** – „Was kann ich kochen?", Spoonacular-Suche (Profil-Filter),
  eigene deutsche Rezepte, „Gekocht"-Buchung.
- **Profil** – Onboarding, Gesundheits-Berechnung (Mifflin-St Jeor), Tagesziele
  (überschreibbar), Gewichtsverlauf, Backup (JSON-Export/-Import).

## Tech-Stack

React 18 · TypeScript (strict) · Vite · Tailwind CSS · React Router · Dexie.js
(IndexedDB) · Framer Motion · Recharts · @zxing/browser (Barcode) ·
vite-plugin-pwa · lucide-react.

## Setup (lokal)

Voraussetzung: Node.js ≥ 18.

```bash
npm install
npm run icons   # erzeugt die PWA-Icons in public/ (einmalig)
npm run dev     # Dev-Server, http://localhost:5173
```

Weitere Skripte:

```bash
npm run build     # Typecheck + Produktions-Build nach dist/
npm run preview   # gebauten Build lokal ansehen
npm run typecheck # nur TypeScript prüfen
```

> **Kamera/Barcode** braucht HTTPS. Lokal reicht `localhost`; auf dem iPad muss
> die App über **HTTPS** ausgeliefert werden (siehe Deploy).

## Spoonacular-Key (optional)

Die Rezeptsuche nutzt Spoonacular. Hol dir einen **kostenlosen** API-Key auf
<https://spoonacular.com/food-api> und trage ihn in der App unter
**Profil → Einstellungen → Spoonacular API-Key** ein. Ohne Key bleibt die App
voll nutzbar; nur die Spoonacular-Funktionen sind ausgegraut. Der Key wird nur
lokal gespeichert (keine Secrets im Code).

## Deploy (HTTPS automatisch)

Einfachster Weg — kostenlos auf **Vercel** oder **Netlify** deployen; beide
liefern automatisch HTTPS.

### Vercel

1. Repo zu GitHub pushen.
2. Auf <https://vercel.com> → „New Project" → Repo importieren.
3. Framework: **Vite** (wird erkannt). Build-Command `npm run build`,
   Output-Verzeichnis `dist`.
4. Deployen.

### Netlify

1. Repo zu GitHub pushen.
2. Auf <https://netlify.com> → „Add new site" → „Import an existing project".
3. Build-Command `npm run build`, Publish-Verzeichnis `dist`.
4. Deployen.

(Optional: `netlify.toml` mit SPA-Fallback ist bereits im Repo enthalten.)

## Aufs iPad holen

1. Die deployte HTTPS-URL in **Safari** auf dem iPad öffnen.
2. Onboarding durchlaufen (Name, Größe, Gewicht, Ziel …).
3. **Teilen-Symbol → „Zum Home-Bildschirm"** tippen.
4. Die App startet ab jetzt im Vollbild (standalone), wie eine native App, und
   funktioniert offline für alle lokalen Daten.

## Datensicherung

Alle Daten liegen ausschließlich im Browser des Geräts. **Regelmäßig
exportieren** (Profil → Einstellungen → Backup → Export). Das schützt vor
Datenverlust, falls die Safari-Daten gelöscht werden. Wiederherstellen über
Import.
