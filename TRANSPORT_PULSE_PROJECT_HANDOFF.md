# Transport Pulse Project Handoff

Last updated: 2026-09-14

## GitHub Update Package (15 Sep 2026)

- Release ZIP: `Transport Pulse Phase 3 Deliverables/transport-pulse-phase3-spot-news-3d-github-update-2026-09-15.zip`.
- Unpacked review folder: `Transport Pulse Phase 3 Deliverables/GitHub Update - Spot News 3D - 2026-09-15`.
- Added root documentation: `README.md`, `GITHUB_UPDATE_GUIDE.md`, `TRANSPORT_LANES_SUMMARY.md`, and `RISK_SCORING_METHOD.md`.
- The package contains only the runnable prototype, required map/3D assets and source, Power BI theme/build guide, handoff notes and four QA previews. It excludes videos, personal photos, caches and temporary QA scripts.
- The configured Git remote is still the placeholder `https://github.com/你的用户名/transport-pulse-dashboard.git`. Resolve it to the real repository before using the command-line update flow in `GITHUB_UPDATE_GUIDE.md`.

## Current Update: Spot News 3D Redesign (14 Sep 2026)

- Implemented the approved large-globe Spot News redesign in the existing EDS V2 prototype. Open the HTML and select Spot News, or append `?page=spotnews` to the local file URL.
- The map is 900 x 552 px, 53.90625% of the entire 1280 x 720 report. Three.js + OrbitControls provide a real rotatable globe with geographic texture, directional lanes, CU labels and selectable news markers.
- Shared Global Network lane IDs and metrics are reused; the map continues to suppress Brazil-origin lanes. Country-to-CU relationships and CU-to-lane relationships are explicit.
- Right panel: CU Supply Brief, per-CU High Risk / Middle Risk / Normal counts, ranked Spot News, Top-2 Call-offs, and PG12 Next 14 Days. Click a news item for LT estimate, order impact, source/score details and a Global Network link.
- Score is 0–100: estimated delay 40%, impacted orders 25%, upcoming PG12 exposure 25%, Top-2 product exposure 10%. Thresholds 70 and 40. Missing inputs remain Not scored. All values are demo assessments, not a live AI service.
- Actual lane LT variance remains separate from estimated news impact; multiple news estimates are not summed. The example snapshot is 14 Jun 2026, with PG12 window 14–27 Jun inclusive. Q3/Q4 and unsupported mode/order combinations explicitly show missing-data states.
- Initial QA caught and fixed shared-news CU leakage when filtering a lane in All CUs, plus overly displaced CU labels. Automated browser QA passed rotation, zoom/reset, actual route/news pointer picking, CU sync, tabs, risk filters, missing data, date boundaries, fallback and other report pages including LSP Performance.
- QA uses Playwright with system Edge because Browser plugin is unavailable. Desktop viewports: 1280 x 720 and 1366 x 768. A 390 x 844 view is a scaled Power BI report preview, not a separate phone layout.
- Source: spot_news_globe.js, spot_news_globe_data.js, spot_news_globe.css; compiled delivery: spot_news_globe.bundle.js. Geometry: spot_news_world.json. See SPOT_NEWS_GLOBE_README.md for rebuild and attribution.
- Preview files are saved under `outputs/spot_news_3d/`. Power BI custom visual selection/tenant approval, actual data binding and production performance remain pending; do not describe the HTML prototype as a completed PBIX integration.
- EDS skill was applied using local styling conventions. EDS MCP was unavailable, so current EDS component documentation could not be verified through it.

Workspace:

`C:\Users\ejjnzza\OneDrive - Ericsson\2.MNEA Operations Use Cases\1. Transport Pulse\Transport Pulse 视频`

## How To Resume Quickly

If this chat context is lost, read these files first:

1. `TRANSPORT_PULSE_PROJECT_HANDOFF.md`
2. `transport_pulse_video_work_log.md`
3. `transport_pulse_phase3_powerbi_build_guide.md`
4. `transport_pulse_phase3_eds_v2_prototype.html`
5. `transport_pulse_phase3_eds_light_theme.json`

Current in-app browser target:

`http://127.0.0.1:8765/transport_pulse_phase3_eds_v2_prototype.html?page=daily`

The local read-only preview server was started with:

`python -m http.server 8765 --bind 127.0.0.1`

## User Context And Preferences

- User is preparing Transport Pulse communication and dashboard improvements for Ericsson internal audience.
- Preferred working style: implement concrete deliverables, preserve previous versions, and leave clear QA artifacts.
- For videos, always generate a new version number instead of overwriting the previous approved version.
- For dashboard work, user wants practical Power BI-style designs that can be reviewed with business users and later applied to the real PBIX.
- The current approved redesign direction is Light EDS: light gray canvas, white content surfaces, black product bar, Ericsson Blue interaction color, compact controls, and semantic status colors.
- Phase 3 should optimize the full report experience, not only one page.
- P44 data may not be ready, so designs must include useful fallback labels and staged rollout logic.

## Latest Completed Video Work

Latest final video:

`transport_pulse_new_features_intro_v8.mp4`

Video status:

- Duration: `00:01:11.93`
- Format: 1920x1080, 24fps, H.264 video, AAC audio
- QA contact sheet: `_video_build/v8_qa_contact_sheet.png`

Major video decisions and changes:

- V6: replaced the opening cover with a colorful logistics/transport image.
- V7: added `GSU MNEA Distribution`, Ericsson 150 years logo, 2-second longer cover hold, and single clean highlight outlines.
- V8: changed cover label to `GSU MNEA Operation-Distribution`.
- V8: replaced Tony Chen's team avatar with a cropped headshot from `C:\Users\ejjnzza\Downloads\image (4).jfif`.
- V8 kept narration, music, timing, highlights, and later scenes from V7 unchanged.

Important video files:

- Generator script: `make_transport_pulse_video.py`
- Current final video: `transport_pulse_new_features_intro_v8.mp4`
- Cover background: `transport_pulse_cover_transport_bg.png`
- Ericsson 150 years logo: `ericsson_150_years_logo.png`
- Tony Chen override avatar: `team_tony_chen_override.png`
- Work log: `transport_pulse_video_work_log.md`

## Phase 3 Dashboard Work

Current Phase 3 deliverables:

- Current HTML prototype: `transport_pulse_phase3_eds_v2_prototype.html`
- Power BI light theme: `transport_pulse_phase3_eds_light_theme.json`
- Power BI implementation guide: `transport_pulse_phase3_powerbi_build_guide.md`
- World map asset: `transport_pulse_world_map_light.svg`
- 1280x720 QA sheet: `_video_build/phase3_eds_v2_1280_contact_sheet.png`
- 1366x768 QA sheet: `_video_build/phase3_eds_v2_1366_contact_sheet.png`
- Current/previous/V2 comparison: `_video_build/phase3_eds_v2_before_after.png`

### Phase 3 EDS / Power BI V2 - 2026-06-13

V2 was rebuilt as a new prototype after the previous Phase 3 prototype was judged too busy and visually weak. The old prototype files remain unchanged for comparison.

V2 design decisions:

- Fixed Power BI report canvas: `1280 x 720`.
- Light EDS only; no theme toggle and no duplicate dark version.
- One 52px black product bar and one compact report navigation/filter row.
- Five visible report pages: Daily Control, Global Network, Spot News, Shipment Explorer, and AI Briefing.
- Hidden implementation pages: Raw Data, Shipment Detail drill-through, and report-page tooltips.
- Three persistent slicers: CU, Period, and Mode.
- Secondary filters live in a right-side bookmark drawer.
- Low-radius surfaces, thin borders, no decorative shadows, and Ericsson Blue for actions and selected states.

V2 page responsibilities:

- Daily Control: exceptions and actions first; five KPIs, exception queue, compact LSP Performance, location-linked Spot News, network snapshot, top risk lanes, and a short AI brief.
- Global Network: real world basemap, Air/Sea/Road lane paths based on the Transport Pulse and Global Transport Control Tower references, origin/destination/news/P44 layers, selected object inspector, and Top 10 Lanes matrix.
- Shipment Explorer: shipment, SO, product, account, lane, ETA source, P44 availability, risk, selected-shipment timeline, and drill-through.
- AI Briefing: What changed, Why it matters, Recommended actions, and supporting evidence.
- Spot News: CU Supply relevance view that connects external news to selected CU, country/location, lead-time impact, Top-2 call-off products/orders, PG12 next-two-week readiness, and AI lane disruption signals.

Implemented interactions verified in the prototype:

- Page navigator and direct `?page=` URLs.
- Synced CU/Period/Mode selections and Reset Filters.
- Bookmark-style filter drawer.
- Lane selection updates map context and inspector.
- Shipment selection updates the detail panel and drill-through modal.
- Map layer toggles and lane/news tooltip behavior.
- Global Network transport lanes use displayed origins in Germany, Spain, Sweden, Estonia, and Poland, with MNEA destinations in China, Hong Kong, Taiwan, Korea, Japan, and Malaysia.
- Air, Sea, and Road have distinct layer colors; high-risk lanes retain an additional red risk signal, and map number pills represent in-transit orders.
- The synced Mode slicer controls Air/Sea/Road layer visibility.
- Daily Spot News rows navigate to Global Network and select the related lane inspector context.
- Daily Spot News rows now navigate to the dedicated Spot News page for CU/news impact review.
- P44 connected and pending states with explicit fallback language.

Final V2 QA:

- Eight page screenshots generated at `1280x720` and `1366x768`.
- No page scrolling, text clipping, nested cards, or control overlap found.
- Daily Control retains the exceptions-first hierarchy while restoring LSP Performance and a three-item Spot News list in a compact lower support band.
- Global Network inspector was compacted so related news, recommended actions, and navigation buttons fit the canvas.
- Top 10 Lanes contains ten sample lanes and uses matrix-internal scrolling, matching normal Power BI matrix behavior without introducing report-page scrolling.
- Theme JSON parses successfully.
- Prototype JavaScript syntax check passes and all ten lane selections have inspector data.
- Prototype contains no external runtime dependency and is served locally for reliable browser preview.

Global Network world-map refresh - 2026-06-13:

- Replaced the abstract regional lane diagram with a real projected world map asset: `transport_pulse_world_map_light.svg`.
- Transport lane relationships were aligned with the current Transport Pulse dashboard and the local reference project at `C:\Users\ejjnzza\OneDrive - Ericsson\2.MNEA Operations Use Cases\0. AI Builder\global-transport-lanes-with-intransit-orders (1)`.
- Added mode-specific path layers: Air green, Sea blue, Road orange.
- Added European origins and China, Hong Kong, Taiwan, Korea, Japan, and Malaysia destinations.
- Removed the Brazil-origin map lane because its order volume is too low for the control-tower overview. The related shipment data remains discoverable in Shipment Explorer and Raw Data.
- Added Cape of Good Hope sea routing, regional Asia paths, directional arrows, location markers, Spot News markers, optional P44 markers, and in-transit order count anchors.
- The global Mode slicer now controls map mode visibility.
- Lane count anchors are clickable and keyboard accessible, updating the selected-object inspector.
- Revalidated at `1280x720` and `1366x768`; no report-page overflow or browser console errors were found.
- Daily Control Global Network Snapshot now reuses the same world-map base, Air/Sea/Road colors, risk halo, and location/news semantics as the full Global Network page.

EDS MCP was not available in the active tool environment. V2 follows the installed local `eds-ui-developer` skill and Power BI native component constraints.

Legacy Phase 3 files retained:

- `transport_pulse_phase3_powerbi_prototype.html`
- `transport_pulse_phase3_powerbi_prototype_pre_eds.html`
- `transport_pulse_phase3_design_spec.md`

### EDS Visual Refresh - 2026-06-11

The Phase 3 HTML prototype was redesigned using the local `eds-ui-developer` skill and Ericsson Design System principles.

Current file:

- `transport_pulse_phase3_powerbi_prototype.html`

Pre-EDS backup:

- `transport_pulse_phase3_powerbi_prototype_pre_eds.html`

EDS refresh changes:

- Black Ericsson-style system bar with compact global search.
- Dark application rail and EDS blue navigation selection.
- Page navigation icons and clearer active states.
- EDS-style dark theme tokens with a supported light theme.
- Theme toggle in the top-right system bar.
- Direct theme preview parameters: `?theme=dark` and `?theme=light`.
- Compact square form controls, focus states, and accessible labels.
- Low-radius data panels, KPI status strips, semantic badges, and denser tables.
- Updated Global Map layer controls, lane selection, drawer, and table styling.
- Updated AI summary tiles and Shipment Detail metadata/timeline styling.

EDS QA screenshots:

- Dark Main Page: `_video_build/phase3_eds_main_dark.png`
- Light Main Page: `_video_build/phase3_eds_main_light.png`
- Global Map: `_video_build/phase3_eds_global-map.png`
- AI Insights: `_video_build/phase3_eds_ai.png`
- Shipment Detail: `_video_build/phase3_eds_detail.png`

EDS MCP was not available in the active tool environment. The implementation used the installed local EDS skill guidance and a self-contained EDS-style token/component layer so the prototype remains directly openable without internal npm access.

Prototype pages:

- Main Page: Daily Pulse Overview
- Global Map: Phase 3 control center
- AI Insights - CU: simplified AI summary page
- Shipment Detail: drill-through page for shipment, SO, product, account/customer, ETA, and P44 status
- Raw Data: audit/detail layer

Implemented prototype behavior:

- Left page navigation switches between report pages.
- Global filters and CU buttons are shown consistently.
- Global Map includes lane lines, layer controls, right-side lane detail drawer, and Top 10 Lanes table.
- Clicking lane lines or Top 10 lane rows updates the selected lane drawer.
- AI Insights has a top executive summary plus tabs for Freight Performance, Shipment Status, and Spot News Impact.
- Shipment Detail includes sales order, product, account/customer, ETA source, and P44 availability.
- URL query can open a page directly, for example:
  - `transport_pulse_phase3_powerbi_prototype.html?page=global-map`
  - `transport_pulse_phase3_powerbi_prototype.html?page=ai`
  - `transport_pulse_phase3_powerbi_prototype.html?page=detail`

## Phase 3 User Backlog Summary

User shared backlog screenshots with needs including:

- Global map with in-transit shipment animations.
- P44 real shipment location and latest ETA when data connection is ready.
- Better P44 coverage.
- Standard lead time vs actual lead time by top lanes.
- Capacity status: stable, increasing, constraining.
- Spot News linked to location, ports, airports, and lane impact.
- One-click lane line to display the related message/news.
- Simpler one-page summary because the current dashboard feels busy.
- Shipment detail linked with shipment number, sales order, product name, account/customer.
- Account name and major main item visibility for Taiwan shipments.
- Alert or subscription options for monitored shipments or shipment delay risk.

## Phase 3 Design Direction

Main Page:

- Keep it as the daily entry point.
- Focus on "What is risky today?"
- Keep top filters, CU buttons, core KPI tiles, compact map preview, top risk lanes, and AI Summary.
- Move deeper map/lane/news analysis to Global Map.

Global Map:

- Make it the Phase 3 core page.
- Use it to answer "Which lane, port, or news caused the risk?"
- Include lane lines, shipment/port/news/capacity layers, right-side detail drawer, and Top 10 Lanes table.
- Clicking a lane/news/row should update related context and lead users to shipment detail.

AI Insights - CU:

- Simplify the current heavy three-card layout.
- Use top AI Executive Summary plus focused tabs/sections.
- AI text should be concise and action-oriented:
  - What changed
  - Why it matters
  - Suggested follow-up

Shipment Detail / Raw Data:

- Use drill-through for shipment-level analysis.
- Include shipment number, sales order, product, account/customer, lane, mode, status, ETA source, and P44 availability.
- Keep Raw Data as the audit layer.

## P44 Staged Rollout

Phase 3A:

- Deliver with current data first.
- Static/latest shipment status.
- Lane risk.
- Spot News location.
- Lead time variance.
- Capacity status.
- Fallback labels such as `ETA from dashboard data` and `P44 location pending`.

Phase 3B:

- Add P44 real location and ETA when connection is ready.
- Track P44 coverage.

Phase 3C:

- Add alerts/subscriptions for monitored shipments, delayed shipment risk, or account/product impact.

## Suggested Next Steps

1. Review the V2 HTML prototype with users against three workflows:
   - What is risky today?
   - Which lane, port, or news caused the risk?
   - Which shipments, accounts, and products are impacted?
2. Collect feedback on page layout and priority, especially Global Network and Shipment Explorer.
3. When the PBIX file is available, apply the prototype page structure into the real report.
4. Confirm required data availability:
   - shipment fact
   - lane standard lead time
   - actual lead time
   - Spot News location tags
   - port/airport location table
   - capacity status
   - SO/product/account mapping
   - optional P44 events
5. Validate Power BI performance early because map visuals and cross-filtering may be heavy.

## Notes For Future Codex Sessions

- Do not overwrite `transport_pulse_new_features_intro_v8.mp4`; create V9 or later if video changes continue.
- Do not delete existing QA screenshots or generated assets unless the user explicitly asks.
- Treat `transport_pulse_phase3_eds_v2_prototype.html` as the current dashboard prototype; keep older prototypes as historical references.
- Keep the V2 prototype self-contained. A local HTTP server is preferred for browser preview.
- Preserve the Light EDS direction and Power BI `1280 x 720` canvas unless the user explicitly changes the design direction.
- Keep output artifacts in this workspace so the next session can discover them with `rg --files`.

## 13 Jun 2026 - Global Network Materiality And Phase 3 Deck

- Removed the Brazil-origin lane from the Global Network map because its order volume is too low for the control-tower overview.
- Kept the Brazil shipment in Shipment Explorer / detail data so users can still trace it when needed.
- Updated Daily Control `Global Network Snapshot` to use the same projected world map, Air/Sea/Road colors, risk halo, location markers, and Spot News semantics as the full Global Network page.
- Regenerated the 1280x720 and 1366x768 dashboard QA contact sheets and the current/previous/V2 comparison image in `_video_build`.
- Created a 12-slide English Phase 3 presentation covering:
  - Phase 3 functions and operating workflow
  - design rationale
  - backlog items satisfied in the prototype
  - open P44 and alert dependencies
  - staged rollout and Transport Pulse roadmap
- Final deck: `Transport Pulse Phase 3 Deliverables/Transport_Pulse_Phase_3_Overview.pptx`
- Deck QA: 12 slides, 0 layout errors, 0 layout warnings, 7 media files, 0 empty media files.

## 29 Jun 2026 - Phase 3 Project Explanation Document

- Created a Chinese Word walkthrough for the new Transport Pulse Phase 3 prototype:
  - final DOCX: `Transport Pulse Phase 3 Deliverables/Transport_Pulse_Phase3_Project_Explanation_CN.docx`
  - scope: what the project is, 30-second mental model, architecture diagram, key files, core abstractions, user journeys, data/state model, Power BI implementation path, design rationale, risks/unknowns, and learning path.
- The explanation follows the local `explain-ai-project` skill and uses `Observed / Inferred / Unknown` evidence labels with local file and line references.
- Structural document QA completed:
  - 68 paragraphs
  - 8 tables
  - 3 embedded images
  - 0 empty media files
  - accessibility audit: 0 high, 0 medium, 0 low findings after fixing image alt text and table header rows.
- Render note: packaged `render_docx.py` could not run because `soffice` / LibreOffice is not available in this environment; Word COM PDF export was attempted but timed out, so final visual PNG render QA was not completed.

## 14 Sep 2026 - Dedicated Spot News Page

- Added a new visible page to `transport_pulse_phase3_eds_v2_prototype.html`: `Spot News` (`?page=spotnews`).
- Updated the report navigation from four to five visible pages: Daily Control, Global Network, Spot News, Shipment Explorer, and AI Briefing.
- The Spot News page is designed in English for Power BI implementation and covers the user's requested functions:
  - categorize news by CU Supply relevance;
  - click CU/country markers to view related news and lead-time impact;
  - show each selected CU's Top-2 call-off products/orders with latest shipment/order context;
  - show PG12 ready-for-shipment items for the next two weeks;
  - use AI lane disruption matching to connect Spot News to lane, location and shipment exposure.
- Updated `transport_pulse_phase3_powerbi_build_guide.md` with the new `03 Spot News` page, required data fields, interaction model and QA checks.
- Note: EDS MCP was not available in the active tool environment. The page follows the local `eds-ui-developer` skill, Light EDS tokens, Power BI 1280 x 720 canvas constraints, and existing prototype patterns.
