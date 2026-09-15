# Spot News 3D prototype

Open `transport_pulse_phase3_eds_v2_prototype.html` directly, then choose Spot News. The delivered classic-script bundle includes Three.js, OrbitControls, the required Lucide icons and geographic geometry. It does not require a server, CDN, API key or login.

## Editing and rebuilding

Run `npm install`, then `npm run build:globe` from this directory. Package versions are pinned in package.json. Edit spot_news_globe.js for interactions/scene, spot_news_globe_data.js for news/route fixtures, and spot_news_globe.css for layout. The HTML exposes the existing laneData and product/order examples through window.transportPulse; the new page references these rather than replacing the other pages.

## Assets and licenses

- Three.js 0.180.0 and OrbitControls: MIT, https://github.com/mrdoob/three.js/blob/r180/LICENSE
- Lucide 1.8.0: ISC; bundled license notices are retained in spot_news_globe.bundle.js.
- Country geometry: Natural Earth 1:110m Admin 0 Countries, public domain. https://www.naturalearthdata.com/about/terms-of-use/
- Geometry source: https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson
- spot_news_world.json keeps geometry only; the browser draws a geographic canvas texture. Land appearance is an operational map style, not satellite photography.

## Data and review boundaries

All news, order exposure inputs and estimated effects on this page are illustrative demo data as of 14 Jun 2026. These are not live news reports. Risk scoring is deterministic and explainable; no AI service is called. The existing prototype's call-off order-count definition is preserved. PG12 examples are product-level grouped order batches rather than fabricated shipment rows.

The page keeps a fixed 1280 x 720 Power BI composition, scaled to fit the available viewport. Phone viewing is a scaled report preview, not a separate mobile layout. A production PBIX phone layout remains a separate deliverable.

Power BI visual feasibility, tenant permissions, data binding, export support and production data-volume performance remain to be validated in an actual report. See the Spot News section of transport_pulse_phase3_powerbi_build_guide.md.
