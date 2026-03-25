# Godavari Pushkaralu — Smart Pilgrim Assistance System

> A mobile-first web app to help pilgrims navigate the Godavari Pushkaralu festival in Rajahmundry, Andhra Pradesh. Designed for elderly and non-tech-savvy users with trilingual support (Telugu, Hindi, English).

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.1 (App Router, React 19) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + CSS custom properties |
| Fonts | Poppins (Latin) + Noto Sans Telugu |
| Maps | Leaflet + react-leaflet (OpenStreetMap tiles) |
| Voice | Web Speech API (SpeechRecognition + SpeechSynthesis) |
| Mobile | Capacitor 8.2 (Android build) |
| Export | Static HTML (`output: "export"`) |
| Build | Turbopack |

---

## Project Structure

```
web-app/
├── public/
│   ├── images/logos/
│   │   ├── ap-govt.webp          # AP Government emblem
│   │   └── aptdc.png             # AP Tourism logo
│   └── manifest.json             # PWA manifest
│
├── src/
│   ├── app/
│   │   ├── globals.css           # Design system, colors, animations
│   │   ├── layout.tsx            # Root layout (fonts, meta, app container)
│   │   ├── page.tsx              # Root redirect
│   │   └── [lang]/
│   │       ├── layout.tsx        # Language layout (BottomNav + FloatingSOS)
│   │       ├── page.tsx          # Home server component
│   │       ├── HomeClient.tsx    # Home screen (main hub)
│   │       │
│   │       ├── ghats/
│   │       │   ├── page.tsx
│   │       │   ├── GhatsClient.tsx       # Ghat browser with filters
│   │       │   └── status/
│   │       │       ├── page.tsx
│   │       │       └── StatusClient.tsx  # Crowd status dashboard
│   │       │
│   │       ├── alerts/
│   │       │   ├── page.tsx
│   │       │   └── AlertsClient.tsx      # Safety/crowd/weather alerts
│   │       │
│   │       ├── emergency/
│   │       │   ├── page.tsx
│   │       │   └── EmergencyClient.tsx   # SOS & emergency contacts
│   │       │
│   │       ├── facilities/
│   │       │   ├── page.tsx
│   │       │   └── FacilitiesClient.tsx  # Food, water, medical finder
│   │       │
│   │       ├── map/
│   │       │   ├── page.tsx
│   │       │   ├── MapClient.tsx         # Map page with filter tabs
│   │       │   └── MapView.tsx           # Leaflet map (dynamic, no SSR)
│   │       │
│   │       └── transport/
│   │           ├── page.tsx
│   │           └── TransportClient.tsx   # Bus, auto, boat, parking info
│   │
│   ├── lib/
│   │   ├── voiceAssistant.ts      # Speech recognition, TTS, intent parsing
│   │   └── locations.ts           # GPS coordinates for all locations
│   │
│   └── components/
│       ├── layout/
│       │   ├── BottomNav.tsx       # Sticky bottom navigation (4 tabs)
│       │   ├── FloatingSOS.tsx     # Floating red SOS button
│       │   └── GovHeader.tsx       # Government header component
│       ├── ui/
│       │   ├── Badge.tsx
│       │   ├── Button.tsx
│       │   ├── Card.tsx
│       │   ├── CrowdBadge.tsx      # Crowd level indicator
│       │   ├── IconButton.tsx
│       │   ├── NavigateButton.tsx   # Google Maps directions button
│       │   ├── PageHeader.tsx
│       │   ├── VoiceModal.tsx       # Voice assistant overlay
│       │   ├── BottomSheet.tsx
│       │   └── index.ts           # Barrel exports
│       └── icons/
│           ├── GodavariScene.tsx
│           └── SacredIcons.tsx
```

---

## Pages & Routes (28 static pages)

| Route | Page | Description |
|-------|------|-------------|
| `/{lang}` | **Home** | Main hub — voice command hero, ghat cards (nearest + least crowded), nearby essentials 2x2 grid, alert banner, quick access menu, weather/day counter |
| `/{lang}/ghats` | **Ghats** | Browse 12 real Godavari ghats with filter tabs (All / Low Crowd / Nearest), crowd badges, distance, facilities icons, navigate buttons |
| `/{lang}/ghats/status` | **Crowd Status** | Quick-scan dashboard — summary strip (safe/caution/avoid counts), 2-column grid with color-coded crowd indicators |
| `/{lang}/map` | **Map** | Interactive Leaflet map with all locations as pins, filter tabs (All / Ghats / Food / Toilet / Water / Medical / Transport), popups with navigate buttons, user location |
| `/{lang}/alerts` | **Alerts** | Live alerts feed — filter by type (Crowd / Safety / Weather), timestamps, active/inactive states |
| `/{lang}/emergency` | **Emergency** | Large SOS call button (tel:100), 6 national emergency numbers, 4 local helplines, share location via GPS |
| `/{lang}/facilities` | **Facilities** | Find nearby services — Food (3), Toilets (3), Water (2), Medical (2), Volunteer (1), Parking (1) with open/closed status, navigate buttons |
| `/{lang}/transport` | **Transport** | Travel info grouped by type — Shuttles (1), Buses (2), Autos (2), Boats (2), Parking (2) with prices, distances & navigate buttons |

All pages generate static HTML for 3 languages: **te** (Telugu), **hi** (Hindi), **en** (English).

---

## Design System

### Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| `godavari-950` | `#0f2847` | Deep navy — headers, primary backgrounds |
| `godavari-700` | `#1b5bae` | River blue — active states, links, accents |
| `godavari-50` | `#eff8ff` | Light blue — page backgrounds |
| `saffron-500` | `#f99b07` | Golden amber — sacred highlights, mic button |
| `saffron-600` | `#dd7302` | Deep saffron — hover states, warm accents |
| `maroon-600` | `#dc2626` | Sacred red — SOS, emergency, danger states |

### Hero Gradient (Home Screen)
Warm amber sunset: `#1a0e00 → #3d1e00 → #7a3d00 → #b85c00 → #dd7302 → #f99b07 → #ffbe20 → #ffcc80 → #eff8ff`

### Animations
| Name | Effect | Duration |
|------|--------|----------|
| `sacred-pulse` | Pulsing glow on mic button | 2s infinite |
| `ripple` | Water ripple scale effect | 2.5s infinite |
| `float` | Subtle Y-axis float | 3s infinite |
| `fadeInUp` | Entrance animation | 0.8s ease-out |
| `shimmer` | Opacity shimmer | 3s infinite |
| `drift` | Slow decorative drift | 6s infinite |

### Typography
- **Display/Body:** Poppins (300–700)
- **Telugu:** Noto Sans Telugu (400–700)
- **Mobile:** max-width 430px, safe-area padding

---

## Mock Data Summary

### 12 Ghats (with real names & distances from Rajahmundry)
Pushkar (500m), Kotilinga (800m), Saraswathi (1.2km), Gautami (1.5km), Gowthami (1.8km), Devi (2km), Parnashala (3km), Kovvur (5km), Dhavaleswaram (8km), Bhadrachalam (45km), Antarvedi (75km), Basara (180km)

### 6 Alerts
Crowd (2), Weather (1), Safety (2), Info (1)

### 12 Facilities
Food centers (3), Toilets (3), Water points (2), Medical (2), Volunteer booth (1), Parking (1)

### 9 Transport Options
Shuttle (1), Buses (2), Autos (2), Boats (2), Parking lots (2)

### Emergency Contacts
- **National:** Police 100, Ambulance 108, Fire 101, Women 181, Disaster 1070, Child 1098
- **Local:** Pushkaralu Helpline, Control Room, Tourist Helpline, River Patrol

---

## What's Been Completed

### Phase 1: Project Setup
- [x] Next.js 16 project with TypeScript + Tailwind CSS 4
- [x] Static export configuration for Capacitor
- [x] Capacitor 8 integration (Android)
- [x] PWA manifest
- [x] Design system in globals.css (colors, animations, typography)
- [x] Root layout with fonts (Poppins + Noto Sans Telugu)
- [x] App container (430px mobile viewport)

### Phase 2: Splash & Navigation
- [x] Splash screen / root redirect
- [x] Bottom navigation (Home / Ghats / Map / Alerts)
- [x] Floating SOS button
- [x] Language-aware routing (`[lang]` dynamic segment)
- [x] `generateStaticParams()` on all routes (te/hi/en)

### Phase 3: Home Screen
- [x] AP Government emblem in header
- [x] Language switcher (Telugu / Hindi / English)
- [x] Voice command hero section with animated mic button
- [x] Ghat info cards (Nearest + Least Crowded) in 2-column grid
- [x] Nearby essentials 2x2 grid (Food, Toilet, Water, Medical)
- [x] Active alert banner
- [x] Quick access 3x2 grid (Ghats, Transport, Crowd, Alerts, Map, Emergency)
- [x] Weather & Pushkaralu day counter card
- [x] Warm amber sunset gradient (matched from reference photos)
- [x] Overflow-x fix (no horizontal scrollbar)
- [x] Body background matches header (no side gaps on language switch)

### Phase 4: Inner Pages
- [x] **Ghats** — 12 ghats, filter tabs, crowd badges, facility icons
- [x] **Crowd Status** — Summary strip, 2-column color-coded grid
- [x] **Emergency** — SOS button, emergency numbers, local helplines, share location
- [x] **Alerts** — Filtered alert feed with timestamps and type badges
- [x] **Facilities** — Filterable services with open/closed status, distance sorting
- [x] **Transport** — Grouped by type with prices and distances

### Phase 5: Build Verification
- [x] `npm run build` passes — 28 static pages generated successfully
- [x] TypeScript compilation clean
- [x] All 3 language variants generated for every route

### Phase 6: Voice Assistant
- [x] Web Speech API integration (SpeechRecognition + SpeechSynthesis)
- [x] Telugu (`te-IN`), Hindi (`hi-IN`), English (`en-IN`) voice recognition
- [x] Intent mapping — 12 intents (ghats, crowd, food, toilet, water, medical, transport, emergency, alerts, map, volunteer, home)
- [x] Text-to-speech confirmation in all 3 languages
- [x] Mic button wired to VoiceModal overlay
- [x] Pulsing golden rings animation while listening
- [x] Real-time transcript display
- [x] Automatic navigation on intent match
- [x] Error handling: mic blocked, no speech, not understood
- [x] Graceful fallback if browser doesn't support Web Speech API

### Phase 7: Maps & Navigation
- [x] Leaflet.js + react-leaflet integration (OpenStreetMap tiles)
- [x] Centralized GPS coordinates for all 33 locations (`src/lib/locations.ts`)
- [x] Interactive map page (`/{lang}/map`) with filter tabs
- [x] Custom colored markers per category (emoji icons)
- [x] Popup cards with name, details, crowd status, navigate button
- [x] "Directions" button opens Google Maps with turn-by-turn navigation
- [x] User location shown on map (blue pulsing dot via Geolocation API)
- [x] Navigate buttons added to Ghats, Facilities, and Transport cards
- [x] Reusable `NavigateButton` component (compact + full variants)
- [x] Map tab added to bottom navigation (4 tabs total)
- [x] Map added to home screen quick access grid
- [x] Map voice intent added to voice assistant

---

## What Needs To Be Done

### Phase 8: Backend & Real Data
- [ ] API service layer (REST or GraphQL)
- [ ] Real-time crowd data from sensors/manual input
- [ ] Live alert broadcasting (WebSocket or polling)
- [ ] Ghat status updates from admin dashboard
- [ ] Weather API integration (OpenWeatherMap or similar)
- [ ] Facility status updates (open/closed in real-time)
- [ ] GPS-based distance calculation (replace hardcoded distances)

### Phase 9: Admin Dashboard
- [ ] Admin panel for updating crowd levels
- [ ] Alert creation and management
- [ ] Facility status toggling (open/closed)
- [ ] Transport schedule updates
- [ ] Analytics dashboard (visitor counts, popular ghats)

### Phase 10: Polish & Accessibility
- [ ] Aria labels on all interactive elements
- [ ] Screen reader testing
- [ ] Large text mode for elderly users
- [ ] High contrast mode
- [ ] Offline support (service worker caching)
- [ ] Loading skeletons for data-fetching states
- [ ] Error boundaries and fallback UI
- [ ] Performance optimization (image lazy loading, code splitting)

### Phase 11: Testing & QA
- [ ] Unit tests for components
- [ ] Integration tests for page navigation
- [ ] Cross-browser testing (Chrome, Samsung Internet, Firefox)
- [ ] Device testing (various Android screen sizes)
- [ ] Accessibility audit (Lighthouse, axe)
- [ ] Performance audit (Core Web Vitals)

### Phase 12: Android Build (Final Step)
- [ ] Capacitor Android project setup (`npx cap add android`)
- [ ] Native splash screen configuration
- [ ] Status bar styling for Android
- [ ] Test on physical Android devices
- [ ] APK / AAB generation for distribution
- [ ] Push notification setup (Firebase Cloud Messaging)

---

## Build & Run

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build (static export)
npm run build

# Preview production build
npx serve out

# Android build (after Capacitor setup)
npx cap add android
npx cap sync
npx cap open android
```

---

## Key Design Decisions

1. **Static Export** — All pages pre-rendered as static HTML for Capacitor compatibility. No server-side features (no API routes, no middleware).

2. **Server/Client Split** — Each route has a `page.tsx` (server component with `generateStaticParams`) and a `*Client.tsx` (client component with `"use client"` for interactivity).

3. **Trilingual from Day 1** — Every string is in a translations object with te/hi/en keys. No i18n library needed — simple object lookup.

4. **Mobile-First (430px)** — Designed as a mobile app, not a responsive website. Max-width container centers on tablet/desktop with dark navy sides.

5. **Hardcoded Mock Data** — All ghat, facility, transport, and alert data is hardcoded in components. Designed to be swapped with API calls in Phase 7.

6. **Godavari Color Palette** — Deep navy blues as primary, saffron/gold as sacred accents only. Inspired by actual Pushkaralu sunset photography.
