# SAPS Limpopo Province — AI Command & Control Dashboard

## Overview
Next.js 15 (App Router) dark glassmorphic police command centre for the South African Police Service, Limpopo Province. Features real-time Limpopo map, smart city traffic control, CCTV city grid, officer safety tracking, AI dispatch, and pursuit mode.

## Tech Stack
- **Framework**: Next.js 15 (App Router, `"use client"`)
- **Map**: Leaflet + OpenStreetMap (dynamic import, SSR disabled)
- **Styling**: Tailwind CSS + custom glassmorphic CSS variables
- **Fonts**: `Inter` + `Space_Grotesk` via `next/font/google`
- **Icons**: `lucide-react`
- **Sound**: Web Audio API (no external files)
- **Port**: 5000 / 0.0.0.0 — `npm run dev`

## Key Files
```
src/
  app/
    page.tsx              — Main dashboard (state hub for traffic/pursuit/cameras)
    layout.tsx            — Root layout + fonts
    globals.css           — Glassmorphic CSS, Leaflet overrides
    activity/page.tsx     — Incident log with filter/detail panel
    alerts/page.tsx       — Alert centre with sound toggle
  components/dashboard/
    shell.tsx             — Sidebar + header + alert banner
    limpopo-map.tsx       — Leaflet map (incidents, officers, traffic, cameras, pursuit)
    video-intelligence.tsx — AI video feed viewer (4 feeds)
    officer-tracking.tsx  — Live BPM + battery tracking
    dispatch-hub.tsx      — AI dispatch with step-by-step workflow
    performance-metrics.tsx — Animated KPI cards
    agency-escalation.tsx — EMS/Traffic/ADT escalation with call states
    command-bar.tsx       — Smart command bar (parses traffic/camera/pursuit commands)
    intel-panel.tsx       — Tabbed right panel: VIDEO | TRAFFIC | CCTV
    traffic-control.tsx   — Smart traffic light control (green corridor, hold red, block)
    cctv-grid.tsx         — City CCTV camera grid with AI tracking
    pursuit-banner.tsx    — Full-width pursuit mode banner with AI decision output
  lib/
    sounds.ts             — Web Audio API alert sounds
    pursuit-store.ts      — Shared types: TrafficNode, CctvCamera, PursuitData, MapTab
```

## Map Tabs
- **Standard** — incidents + officers + citizens
- **Risk Zones** — + risk zone overlays
- **Patrols** — patrol routes
- **Traffic Ctrl** — Polokwane traffic light nodes (live state: normal / green_corridor / held_red / blocked)
- **City Cameras** — CCTV camera nodes with AI tracking indicators
- **Pursuit Mode** — suspect route (red dashed), police corridor (green), interception zone (yellow), AI camera markers

## Smart Command System
The command bar parses natural language:
- `"Green corridor to Polokwane CBD"` → activates green corridor, switches map to Traffic tab
- `"Hold red at Church St"` → sets intersections to held_red
- `"Block Church St intersection"` → blocks intersection
- `"Activate pursuit mode"` → full pursuit mode: cameras track, traffic adjusts, pursuit banner appears, map switches to Pursuit tab
- `"Show cameras near incident"` → switches map to Cameras tab
- `"Track suspect north on N1"` → enables AI tracking on CAM-101
- `"Restore traffic"` → resets all intersections to normal
- `"Escalate to EMS"` → dispatch response
- `"Dispatch nearest unit"` → unit dispatch response

## Pursuit Mode
Activated by command or "Activate pursuit mode" button. When active:
1. Orange banner appears with live timer, suspect ID, vehicle, direction, speed
2. AI shows: next camera, traffic action, interception point, recommended units
3. Map switches to Pursuit tab showing suspect route (red dashed), police corridor (green), interception zone (yellow)
4. CCTV cameras auto-track: CAM-101 → CAM-102 with auto-switch
5. Traffic: N1 Corridor goes green, eastern exits held red
6. Cancel with X button — restores all systems to normal

## Design System
- **Glass**: `hsla(220, 9%, 60%, 0.06)` + `backdrop-filter: blur(16px) saturate(1.5)`
- **Primary**: `hsl(221, 83%, 53%)` (SAPS blue)
- **Destructive**: `hsl(0, 72%, 51%)` (red alerts)
- **Map tiles**: darkened with `filter: brightness(0.55) saturate(0.6) hue-rotate(200deg)` in CSS

## Limpopo Data
All incidents, officers, traffic nodes, and cameras are pinned to real Limpopo/Polokwane coordinates:
- Polokwane CBD, Tzaneen, Thohoyandou, Giyani, Louis Trichardt, Mokopane, Phalaborwa
- Traffic intersections: Church St & Nelson Mandela Dr, N1 North exit, Schoeman/Rabe, R71/Hans van Rensburg, Thornhill, Civic Centre, Biccard/Devenish
- CCTV cameras: CBD Square, N1 Overpass, Hospital Rd, Thornhill, Mankweng R71, Civic Centre
