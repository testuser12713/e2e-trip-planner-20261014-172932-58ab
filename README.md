# Reiseplaner

Der Reiseplaner ist eine reine Browser-Anwendung zum Planen von Reisen: Eine Übersicht aller Reisen zeigt Ziel und Zeitraum, eine Detailseite bündelt den Tagesplan mit Aktivitäten (Uhrzeit, Ort, Kosten, Kategorie), eine Budget-Übersicht summiert die Kosten je Kategorie in einem selbst gezeichneten Balkendiagramm, und eine Packliste lässt sich abhaken. Es gibt kein Backend – alle Daten liegen ausschließlich im `localStorage` des Browsers unter dem Schlüssel `trip-planner:v1`.

## Tech Stack

- **Sprache:** TypeScript (strict) auf React 19
- **Build-Tool:** Vite
- **Routing:** react-router-dom
- **Persistenz:** `localStorage` im Browser, kein Backend
- **Styling:** eigenes CSS (Design-Tokens in `src/styles/index.css`), keine Komponentenbibliothek
- **Diagramm:** eigenhändig aus HTML/CSS gebautes Balkendiagramm, keine Chart-Bibliothek
- **Tests:** Vitest + @testing-library/react + @testing-library/jest-dom (jsdom)

## Installation

Voraussetzung: Node.js mit npm.

```bash
npm install
```

## Entwicklung starten

```bash
npm run dev
```

Vite startet einen Entwicklungsserver und gibt die Adresse im Terminal aus (standardmäßig `http://localhost:5173`). Diese Adresse im Browser öffnen.

## Produktions-Build

```bash
npm run build
```

Der Build erzeugt den Ordner `dist/`. Die gebaute App lässt sich lokal ausliefern mit:

```bash
npm run preview
```

`vite preview` liefert den Inhalt von `dist/` aus (standardmäßig unter `http://localhost:4173`) und leitet unbekannte Pfade auf `index.html` um, sodass auch ein Direktaufruf wie `/trips/<id>/budget` funktioniert.

## Tests

```bash
npm test
```

## Verwendung

Nach dem Start zeigt die Kopfzeile den Produktnamen **Reiseplaner** sowie die Navigation zur Reiseliste. Alle Inhalte werden ohne Server direkt im Browser verwaltet; jede Änderung landet sofort im `localStorage`, ein Reload verliert nichts.

- **Reiseliste (`/`)** – Übersicht aller angelegten Reisen mit Ziel und Zeitraum, Ausgangspunkt für das Anlegen einer neuen Reise.
- **Reise-Detailseite (`/trips/:id`)** – Tagesplan der Reise. Die angebundene Unternavigation führt zu Tagesplan, Budget und Packliste.
- **Budget (`/trips/:id/budget`)** – Gesamtsumme und Summen je Kategorie als Balkendiagramm.
- **Packliste (`/trips/:id/packing`)** – Einträge hinzufügen, abhaken und löschen, inklusive Fortschrittsanzeige.
- **Reise bearbeiten (`/trips/:id/edit`)** – Ziel und Zeitraum einer Reise ändern.
- **Unbekannte Adresse** – zeigt die 404-Seite „Diese Seite gibt es nicht.“ mit einem Link zurück zur Reiseliste.

Die Daten bleiben lokal im Browser. Wird der `localStorage`-Inhalt beschädigt oder ist er unplausibel, startet die App mit einem leeren, benutzbaren Zustand – ohne Absturz und ohne Fehlermeldung.

## Features

- Reisen mit Ziel, Start- und Enddatum anlegen, bearbeiten und (nach Bestätigung) löschen
- Aktivitäten je Reise mit Uhrzeit, Ort, Kosten und genau einer von sechs Kategorien (Anreise, Unterkunft, Verpflegung, Aktivität, Shopping, Sonstiges)
- Budget-Übersicht mit Gesamtsumme und Kategoriesummen als eigenhändig gezeichnetes Balkendiagramm
- Packliste je Reise mit Abhaken, Fortschrittszähler und Fortschrittsbalken
- Sichtbare, per React Router angebundene Navigation; tiefe Links überleben einen Reload
- 404-Seite mit Rückweg zur Reiseliste
- Responsives Layout ab 360 Pixel Breite ohne horizontalen Scrollbalken, Bedienelemente mindestens 44 Pixel hoch
- Robustes Verhalten bei fehlendem oder beschädigtem `localStorage`
