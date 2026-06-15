# DESIGN.md — Vorrat & Ernährung

Verbindliche Design-Direktive. Gilt bei jedem UI-Schritt. **Product-Mode, nicht
Brand-Mode** — die App ist ein Werkzeug, Design dient der Aufgabe.

## Haltung

Notion/Linear-mäßig **minimalistisch, editorial, ruhig**. Klare typografische
Hierarchie über Größe/Gewicht/Farbe/Abstand statt Dekoration. Großzügiger
Weißraum. Weiche, nicht harte Kontraste.

**Anti-Referenzen (verboten):** lila Verläufe, Glassmorphism, Gradient-Text,
Neon/Cyberpunk, generische Regenbogen-KI-Paletten, „Boost your …"-Texte.

## Farbe

Zurückhaltend. Eine neutrale Basis + **eine** Akzentfarbe.

- **Basis:** warmes Off-White (hell) / fast-schwarz (dunkel).
- **Akzent:** ruhiges, gedämpftes Grün (`#3b6e4f`) — in den Einstellungen
  konfigurierbar.
- **Semantisch sparsam:** Bernstein/Orange = „läuft bald ab", Rot =
  „abgelaufen / sehr wenig".
- **Makro-Palette** (dezent, drei Farben): Protein (blau), Kohlenhydrate
  (amber), Fett (violett).

Hell- und Dunkelmodus, dem System folgend, umschaltbar. Dark Mode ordentlich
umgesetzt (Kücheneinsatz im Dunkeln).

Alle Farben laufen über **CSS-Variablen** (`--c-*` in `src/index.css`), die
Tailwind als Tokens nutzt (`tailwind.config.js`). Die Akzentfarbe wird zur
Laufzeit aus den Settings gesetzt.

## Typografie

**Inter** (mit System-Stack als Fallback). Zahlen mit `tabular-nums`
(Utility-Klasse `.tnum`). Eine Schriftfamilie reicht; Hierarchie über
Gewicht/Größe.

## Icons

`lucide-react`, konsistent.

## Motion (Emil-Prinzipien)

- Spring-basiert (Framer Motion), kurz (UI-Übergänge ~150–250 ms),
  Easing eher ease-out beim Erscheinen.
- Nur `transform` und `opacity` animieren (GPU-freundlich).
- `prefers-reduced-motion` respektieren → Animationen aus/minimal
  (global via CSS in `index.css`).
- Bewegung erklärt etwas (woher/wohin). Nicht dekorativ alles animieren.
- Gezielte Mikro-Interaktionen: Kalorien-Ring füllt sich, Makro-Balken
  wachsen, Vorratsartikel sliden sanft rein, Sheets federn hoch.

## Touch / iPad-UX

- **Bottom-Tab-Bar** als Hauptnavigation: Heute · Vorrat · Einkauf · Rezepte ·
  Profil.
- Tap-Ziele mind. **44×44 px**. Primäraktionen daumengünstig (unten).
- **Swipe-Gesten**: Einkaufsliste abhaken / Vorratsartikel löschen.
- Eingabe-Flows als **Bottom-Sheet** (Vaul-artig), touch-freundlich.
- Funktioniert in Hoch- und Querformat; Safe-Area-Insets berücksichtigt.

## Komponenten-Inventar

`src/components/ui.tsx` enthält die Primitives: `Button`, `Card`, `Field`,
`Input`, `Textarea`, `Select`, `SegmentedControl`, `Badge`, `EmptyState`.
Geteilte Bausteine: `BottomSheet`, `TabBar`, `SwipeRow`, `PageHeader`,
`CalorieRing`, `MacroBars`, `BarcodeScanner`.
