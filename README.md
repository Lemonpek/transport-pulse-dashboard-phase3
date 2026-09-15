# Transport Pulse Phase 3 Prototype

Transport Pulse is a Power BI-oriented control-tower prototype for daily shipment exceptions, global transport lanes, CU-relevant Spot News, shipment detail and concise AI briefings.

## Open the prototype

Open `transport_pulse_phase3_eds_v2_prototype.html` in a modern browser. The prototype is self-contained and does not require a login or API key.

For local HTTP preview or production hosting, run:

```powershell
npm install
npm run build
npm start
```

Then open `http://localhost:3000`. The server uses the platform-provided `PORT` when deployed and exposes `/healthz` for health checks.

Use the top navigation to review:

- **Daily Control** — daily exceptions, LSP performance, risk lanes and actions.
- **Global Network** — world-map lane overview and lane lead-time context.
- **Spot News** — rotatable 3D Supply Risk Globe, CU-specific news risk scores, Top-2 call-offs and the next 14 days of PG12 readiness.
- **Shipment Explorer** — shipment, sales order, account, product, ETA and P44 context.
- **AI Briefing** — short operational summaries and recommended actions.

All prototype values are illustrative demo data. The Spot News snapshot is dated 14 Jun 2026. The HTML prototype demonstrates the intended interaction and layout; it is not a PBIX file or a live data connection.

## Key documents

- `TRANSPORT_LANES_SUMMARY.md` — current sea, air and road lane inventory.
- `RISK_SCORING_METHOD.md` — quantitative Spot News risk calculation, examples and distinction from lane operational risk.
- `transport_pulse_phase3_powerbi_build_guide.md` — Power BI model, measures, interactions and implementation constraints.
- `GITHUB_UPDATE_GUIDE.md` — safe options for updating the existing GitHub repository.
- `SPOT_NEWS_GLOBE_README.md` — 3D implementation, rebuild steps, data boundaries and licenses.

## Source structure

- `transport_pulse_phase3_eds_v2_prototype.html` — report shell and the existing page data.
- `spot_news_globe.js`, `spot_news_globe_data.js`, `spot_news_globe.css` — Spot News source.
- `spot_news_globe.bundle.js` — browser-ready bundle; keep this file when uploading.
- `spot_news_world.json` — Natural Earth country geometry used by the globe.
- `transport_pulse_world_map_light.svg` — 2D map asset used by Daily Control and Global Network.
- `transport_pulse_phase3_eds_light_theme.json` — Power BI light theme starter.
- `server.cjs` — dependency-free production static server for Zeabur and local HTTP preview.
- `zbpack.json` — explicit Zeabur build and start commands.

To rebuild the globe bundle, run `npm install` and `npm run build:globe`. Dependency versions are pinned in `package.json` and `package-lock.json`.

## Current implementation status

The portable prototype and browser interactions are complete. Production work still requires an editable PBIX, approved data sources, a tenant-approved 3D Power BI visual or custom visual, and validation with production data volumes.
