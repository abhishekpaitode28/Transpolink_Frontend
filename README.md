# TranspoLink Frontend

Angular 19 frontend for the TranspoLink city traffic & transport management system.

## Architecture

Standalone components with signal-based APIs. Each folder under `src/app/modules/` maps directly to one of the seven TranspoLink backend modules.

## Getting Started

```bash
npm install
ng serve
```

Navigate to `http://localhost:4200`.

## Modules

| Module | Folder | Owner |
|--------|--------|-------|
| Identity | `modules/identity/` | — |
| Incidents | `modules/incidents/` | — |
| Traffic Flow (4.3) | `modules/traffic-flow/` | Abhishek |
| Transport | `modules/transport/` | — |
| Compliance | `modules/compliance/` | — |
| Reporting | `modules/reporting/` | — |

## Environment Setup

Copy `.env.example` to `.env` and fill in your API base URL and map tile key.
```
API_BASE_URL=https://localhost:7001
MAP_TILE_KEY=your_key_here
```
