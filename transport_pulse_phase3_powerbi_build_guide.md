# Transport Pulse Phase 3 Power BI Build Guide

## Deliverables

- Clickable review prototype: `transport_pulse_phase3_eds_v2_prototype.html`
- Power BI theme: `transport_pulse_phase3_eds_light_theme.json`
- Target canvas: `1280 x 720`, 16:9
- Default context: Hong Kong, 2026 Q2, All modes

The prototype is a review and implementation reference. It uses only interactions that can be reproduced with native Power BI features, Azure Maps, bookmarks, drill-through, report-page tooltips, synced slicers, and standard tables/matrices.

## Report Structure

### Visible pages

1. `01 Daily Control`
2. `02 Global Network`
3. `03 Spot News`
4. `04 Shipment Explorer`
5. `05 AI Briefing`

### Hidden auxiliary pages

- `H01 Shipment Detail`: drill-through page filtered by Shipment Number.
- `H02 Lane Tooltip`: report-page tooltip filtered by Lane ID.
- `H03 Location Tooltip`: report-page tooltip filtered by Port/Airport or News ID.
- `H04 Raw Audit`: detailed audit table available from Shipment Detail.

Use a Page Navigator for the five visible pages. Do not reproduce the Power BI Service application header or Pages pane inside the report canvas.

## EDS Light Layout

- Page background: `#F2F2F2`.
- Visual background: white with a `#D8D8D8` one-pixel border.
- Product bar: black, 52 px high.
- Page/control bar: white, 52 px high.
- Ericsson interaction color: `#0082F0`.
- Primary text: `#161616`; secondary text: `#666666`.
- High risk: `#C6283D`; medium risk: `#A75D00`; positive/low risk: `#16834B`.
- Visual corner radius: 2-3 px; no decorative drop shadows.
- Recommended report font: Arial if Ericsson Hilda is unavailable in Power BI Service.
- Keep visual headers hidden except where export or focus mode is required.

Import `transport_pulse_phase3_eds_light_theme.json`, then apply page-specific formatting as described below.

## Shared Navigation And Filters

- Fixed slicers on every visible page:
  - CU
  - Period / Planned End Month
  - Mode
- Enable Sync Slicers across all visible pages and Shipment Detail.
- Put these secondary filters in a right-side group controlled with bookmarks:
  - Origin
  - Flow
  - P44 Availability
  - Shipment Number
  - Account
  - Product
- Create bookmarks `Filters Closed` and `Filters Open` with Data disabled, so opening the drawer does not overwrite slicer selections.
- Add a Reset Filters button linked to a `Report Default` bookmark containing Hong Kong, 2026 Q2, and All modes.

## Page Build

### 01 Daily Control

Purpose: answer "What is risky today and what action is required?"

- Top row: five Card visuals for OTD, delayed shipments, in-transit shipments, lead-time variance, and P44 coverage.
- Main visual: table named `Exception Queue` sorted by Lane Risk Score and impacted account priority.
- Exception Queue columns:
  - Severity
  - Lane / Port
  - Risk Cause
  - Impacted Shipments
  - Account / Product
  - Recommended Action
- Add a compact lower support band below Exception Queue:
  - `LSP Performance`: LSP name, OTD %, delayed shipment count, and semantic performance bar. Sort by delayed shipment exposure or OTD depending on the review workflow.
  - `Spot News`: location, short event title, risk level, and Related Lane. Keep the list to the three most relevant signals for the selected CU and period.
- Configure the Spot News list to cross-filter the report and navigate to `03 Spot News` for the selected CU/news context. Use Global Network when the user needs lane, port, airport or map context.
- Right column:
  - Small Azure Maps snapshot filtered to high/medium risk lanes.
  - Top 5 Risk Lanes bar/table.
  - One Smart Narrative or approved AI text measure with maximum three actions.
- Do not include Raw Data or more than one trend chart on this page. LSP Performance and Spot News are compact operational lists, not additional analytical pages.

### 02 Global Network

Purpose: answer "Which lane, port, airport, or news event caused the risk?"

- Use Azure Maps with explicit latitude and longitude fields and a real world basemap. Do not use an abstract regional diagram.
- Reference transport network used by the prototype:
  - Global origins displayed on the map: Germany, Spain, Sweden, Estonia, and Poland.
  - MNEA destinations: China, Hong Kong, Taiwan, Korea, Japan, and Malaysia.
  - Sea: European origins to China/Hong Kong, including the Cape of Good Hope route where applicable; China to Taiwan/Korea regional lanes.
  - Air: Sweden, Estonia, and Poland to China, Taiwan, Korea, and Japan.
  - Road: China to Hong Kong and Malaysia.
- Use mode colors consistently: Air green, Sea blue, Road orange. Keep risk visible through the inspector, matrix badge, line width, and selection state.
- The prototype shows a red high-risk halo. In the PBIX, use a second risk path layer only if Azure Maps performance and visual behavior remain acceptable; otherwise use thicker high-risk paths plus matrix/tooltip risk encoding.
- Configure layers:
  - Path layer: `Lane Path[Latitude]`, `Lane Path[Longitude]`, `LaneId`, `PointOrder`.
  - Marker layer: global origins, MNEA destinations, ports, airports, and lane start/end points.
  - Marker/reference layer: Spot News locations.
- Add optional P44 latest-location markers as a separate toggleable layer.
- Show in-transit order count in the lane tooltip and selected-object inspector. Use small map labels only where they remain readable.
- Place a matrix below the map with standard LT, actual LT, variance, shipments, delayed, capacity, and risk.
- Use visual interactions so selecting a path or matrix row filters the inspector and Shipment Explorer context.
- Use `H02 Lane Tooltip` for lane hover and `H03 Location Tooltip` for port/news markers.
- Represent direction with ordered path points and start/end marker shapes. Do not depend on animated paths.
- Sync the global Mode slicer with Air, Sea, and Road path visibility.
- Suppress very low-volume origin lanes from the map to protect readability. Those shipments remain available in Shipment Explorer and Raw Data.

### 03 Spot News — Supply Risk Globe

Purpose: select a CU, understand relevant news risk, and check lead-time and upcoming order exposure.

- The 1280 x 720 report uses a 900 x 552 map viewport (53.9% of the entire page) and a 340 px CU Supply Brief. No separate KPI row.
- Light EDS styling, shared navigation and CU/Period/Mode slicers remain. Default CU is Hong Kong; All CUs presents distinct news/CU assessments.
- The globe uses Three.js 0.180.0 and OrbitControls with drag rotation, zoom, reset, keyboard arrows, CU labels, news markers and directional routes. The map does not auto-rotate.
- Lane relationships follow Global Network: Germany, Spain, Sweden, Estonia and Poland origins; China, Hong Kong, Taiwan, Korea, Japan and Malaysia destinations. Brazil-origin lanes remain suppressed.
- Route IDs and displayed metrics reference the existing laneData. Geographic paths are illustrative planning paths, including Cape diversions, not actual GPS tracks. The geography comes from Natural Earth 1:110m country polygons.
- CU selection filters lane relationships and per-CU news assessments. Lane selection additionally requires the lane-to-CU relationship, preventing another CU's assessment from leaking through a shared news record.
- News detail identifies the related lanes, estimated LT impact, impacted order count, suggested action, source date and score inputs. It links to the selected lane in Global Network.
- The right panel has Spot News, Top-2 Call-offs and PG12 / Next 14 Days tabs. The map area remains fixed while switching tabs. Long evidence is confined to the panel.
- News relevance categories are Direct CU supply impact, Lane disruption signal, Product / order exposure and PG12 readiness window.
- All content is demonstration data dated 14 Jun 2026, not a current feed. Q3/Q4 show empty states. Order batches lack mode mapping, so non-All mode scopes explicitly withhold the aggregate order panels.

Risk scoring contract:
- Each assessment is keyed by News ID + CU. Inputs: estimated delay days; impacted-order percentage; upcoming PG12 exposure percentage; top-two product exposure percentage.
- Score = round(0.40 * clamp(delayDays * 10, 0, 100) + 0.25 * clamp(orderExposurePct, 0, 100) + 0.25 * clamp(pg12ExposurePct, 0, 100) + 0.10 * clamp(top2ExposurePct, 0, 100)).
- High Risk: 70–100; Middle Risk: 40–69; Normal: 0–39. Missing or non-finite inputs yield Not scored. Negative estimated LT adds no delay component.
- Weights, thresholds and example exposure inputs are provisional and require business validation. These are interpretable example assessments, not the output of a connected AI model.
- A shared news article can have a different score for each CU. All CUs counts assessments per risk category and distinct articles in the summary. Do not sum estimated LT changes from separate articles.
- Actual lane LT variance is a distinct operational metric. A disruption estimate must not be populated automatically from that variance.

Order definitions:
- Top-2 ranking preserves the earlier prototype's call-off order count, not units or monetary value. Source product aggregates are sorted descending within CU; latest shipment/SO/ETA references are preserved. Unavailable status is explicitly indicated.
- PG12 is expected ready-for-shipment, not an achieved milestone. Window: reportDate inclusive through reportDate + 14 days exclusive, using date-only UTC comparisons. Current sample window: 14–27 Jun 2026.
- PG12 records remain grouped product/order batches. Do not invent an order-level mapping from these aggregates.

Power BI implementation gate:
- The web globe is a working interaction prototype, not an embedded PBIX visual. Verify an approved custom visual or a custom pbiviz implementation before promising equivalence.
- Validate WebGL/3D support, geographic paths, selectable CU/lane/news objects, selection IDs, cross-filtering, tooltip behavior, accessibility, tenant approval and export behavior.
- Azure Maps provides path and other map layers but the documented layer inventory does not establish an equivalent rotatable globe. Use Azure Maps as a 2D alternative if the chosen 3D visual cannot meet the requirement.
- Model separate CU/location, lane/path, news, news-to-lane and news/CU exposure tables. Preserve CU/country mapping; country location is not a CU key.
- Missing WebGL falls back to the same route/news data on a 2D map with an explicit notice. Rotation controls are disabled; CU filters and news panels remain usable.

References: [Three.js OrbitControls](https://threejs.org/docs/#examples/en/controls/OrbitControls), [Azure Maps layers](https://learn.microsoft.com/en-us/azure/azure-maps/power-bi-visual-understanding-layers), [Natural Earth](https://www.naturalearthdata.com/about/terms-of-use/).

### 04 Shipment Explorer

Purpose: answer "Which shipments, sales orders, accounts, and products are impacted?"

- Main table fields:
  - Shipment Number
  - Sales Order
  - Product
  - Account
  - Lane
  - Mode
  - Current Status
  - ETA
  - ETA Source
  - P44 Availability
  - Risk Level
- Use a details panel for the selected row and a Drillthrough button to `H01 Shipment Detail`.
- Show fallback wording exactly:
  - `ETA from dashboard data`
  - `P44 location pending`
- Add conditional formatting only to Status, P44, and Risk; avoid coloring every column.

### 05 AI Briefing

Purpose: answer "What changed, why does it matter, and what should be done next?"

- Keep three fixed narrative areas:
  - What changed
  - Why it matters
  - Recommended actions
- Limit each block to one headline, two or three short sentences, and one navigation button.
- Supporting evidence visuals:
  - KPI Delta
  - Top Risk Lanes
  - Spot News Locations
- Buttons should navigate to Global Network or Shipment Explorer. Preserve synced slicer context.

## Required Model Tables

### Shipment fact

Required columns:

`ShipmentNumber`, `SalesOrder`, `ProductName`, `AccountName`, `CU`, `Mode`, `Origin`, `Destination`, `LaneId`, `CurrentStatus`, `ShipmentStartDate`, `PlannedEndDate`, `ActualEndDate`, `ETA`, `ETASource`, `P44Availability`, `OnTimeFlag`, `DelayDays`.

### Lane dimension

Required columns:

`LaneId`, `LaneName`, `OriginRegion`, `DestinationRegion`, `Mode`, `StandardLeadTime`, `CapacityStatus`.

### Lane Path

Required columns:

`LaneId`, `PointOrder`, `Latitude`, `Longitude`, `PointType`.

Sort `PointOrder` ascending within each Lane ID before assigning fields to the Azure Maps path layer.

### Spot News

Required columns:

`NewsId`, `Title`, `Summary`, `RiskLevel`, `Latitude`, `Longitude`, `LocationName`, `LocationType`, `RelatedLaneId`, `PublishedDate`, `RelatedCU`, `RelevanceCategory`, `LeadTimeImpactDays`, `RecommendedAction`.

### Call-off product / order exposure

Required columns:

`CU`, `ProductName`, `SalesOrder`, `ShipmentNumber`, `CallOffQuantity`, `LatestETA`, `RelatedLaneId`, `RiskLevel`.

### PG12 readiness

Required columns:

`CU`, `ReadyForShipmentDate`, `ProductName`, `OrderCount`, `ShipmentCount`, `RelatedLaneId`, `RiskLevel`, `ReadinessStatus`.

### Optional P44 Event fact

Required columns:

`ShipmentNumber`, `EventTime`, `Latitude`, `Longitude`, `EventStatus`, `P44ETA`, `ConnectionStatus`.

## DAX Templates

Replace table and column names only if the PBIX model uses different names.

```DAX
Total Shipments =
DISTINCTCOUNT ( Shipment[ShipmentNumber] )

On Time Shipments =
CALCULATE ( [Total Shipments], Shipment[OnTimeFlag] = TRUE () )

OTD % =
DIVIDE ( [On Time Shipments], [Total Shipments] )

Delayed Shipments =
CALCULATE (
    [Total Shipments],
    Shipment[CurrentStatus] = "Delayed"
)

In Transit =
CALCULATE (
    [Total Shipments],
    Shipment[CurrentStatus] = "In transit"
)

Actual Lead Time Days =
AVERAGEX (
    FILTER ( Shipment, NOT ISBLANK ( Shipment[ActualEndDate] ) ),
    DATEDIFF ( Shipment[ShipmentStartDate], Shipment[ActualEndDate], DAY )
)

Standard Lead Time Days =
AVERAGE ( Lane[StandardLeadTime] )

Lead Time Variance Days =
[Actual Lead Time Days] - [Standard Lead Time Days]

P44 Connected Shipments =
CALCULATE (
    [Total Shipments],
    Shipment[P44Availability] = "Connected"
)

P44 Coverage % =
DIVIDE ( [P44 Connected Shipments], [Total Shipments] )

Impacted Accounts =
CALCULATE (
    DISTINCTCOUNT ( Shipment[AccountName] ),
    Shipment[CurrentStatus] = "Delayed"
)

Lane Risk Score =
VAR VarianceScore = MIN ( 40, MAX ( 0, [Lead Time Variance Days] * 5 ) )
VAR DelayScore = MIN ( 30, DIVIDE ( [Delayed Shipments], [Total Shipments], 0 ) * 100 )
VAR CapacityScore =
    SWITCH (
        SELECTEDVALUE ( Lane[CapacityStatus] ),
        "Constrained", 30,
        "Increasing", 18,
        "Stable", 5,
        0
    )
RETURN
    ROUND ( VarianceScore + DelayScore + CapacityScore, 0 )

Lane Risk Level =
SWITCH (
    TRUE (),
    [Lane Risk Score] >= 75, "High",
    [Lane Risk Score] >= 45, "Medium",
    "Low"
)

ETA Display =
IF (
    SELECTEDVALUE ( Shipment[P44Availability] ) = "Connected",
    FORMAT ( SELECTEDVALUE ( Shipment[ETA] ), "dd mmm yyyy" ) & " | P44 ETA",
    FORMAT ( SELECTEDVALUE ( Shipment[ETA] ), "dd mmm yyyy" ) & " | ETA from dashboard data"
)
```

## Interaction And Performance QA

- Verify the three synced slicers retain state across all visible pages and Shipment Detail.
- Verify filter drawer bookmarks do not reset data selections.
- Verify Reset Filters restores the report default bookmark.
- Verify lane selection filters the inspector, Top 10 matrix, and linked shipment context.
- Verify Spot News CU/country selection updates news relevance, lead-time impact, Top-2 products/orders, PG12 readiness and AI lane disruption sections.
- Verify Spot News rows can navigate users to Global Network lane context and Shipment Explorer impacted orders when implemented in PBIX.
- Verify Shipment Number drill-through opens a single shipment and supports Back navigation.
- Verify report-page tooltips remain under 320 x 240 px and load without scrollbars.
- Limit Azure Maps points to required path and marker data. Avoid high-granularity P44 event history on the overview map.
- Use Performance Analyzer to check map load, matrix ranking, cross-filtering, and AI narrative measures.

## Acceptance Mapping

| Backlog | Acceptance result |
| --- | --- |
| 13 | Shipment Explorer and drill-through show Shipment, SO and Product. |
| 16 | Daily Control uses exceptions-first hierarchy and removes the previous one-page visual overload. |
| 18 | Shipment Explorer includes Account and Product/Major Item context. |
| 19 | Global Network includes Top 10 lanes, standard vs actual LT, capacity, Spot News linkage and one-click selection. |
| 20 | Azure Maps markers connect Spot News to named port/airport locations. |
| Spot News page request | Dedicated Spot News page categorizes news by CU Supply relevance, shows CU/country LT impact, Top-2 call-off product/order exposure, PG12 next-two-week readiness, and AI lane disruption matches. |

## Official Power BI References

- Azure Maps path layer: <https://learn.microsoft.com/en-us/azure/azure-maps/power-bi-visual-add-path-layer>
- Power BI map visual overview: <https://learn.microsoft.com/en-us/power-bi/visuals/power-bi-map-visualizations-overview>
- Report-page tooltips: <https://learn.microsoft.com/en-us/power-bi/create-reports/desktop-tooltips>
- Drill-through: <https://learn.microsoft.com/en-us/power-bi/create-reports/desktop-drillthrough>
