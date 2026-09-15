# GitHub Update Guide

## Package contents

The release ZIP contains only the current web prototype, required assets, source files, documentation and QA preview images. It excludes videos, personal photos, temporary test scripts, caches and local build directories.

## Recommended update method: Git command line

The local repository currently has one previous commit, `5ecf36c Initial commit: Transport Pulse Phase 3 EDS V2`. Its configured remote is a placeholder (`https://github.com/你的用户名/transport-pulse-dashboard.git`), so replace it with the real repository URL before pushing.

From the existing repository folder:

```powershell
git remote set-url origin https://github.com/<YOUR_GITHUB_USER>/<YOUR_REPOSITORY>.git
git remote -v
git pull --rebase origin main
git add README.md GITHUB_UPDATE_GUIDE.md TRANSPORT_LANES_SUMMARY.md RISK_SCORING_METHOD.md SPOT_NEWS_GLOBE_README.md TRANSPORT_PULSE_PROJECT_HANDOFF.md transport_pulse_phase3_eds_v2_prototype.html transport_pulse_phase3_eds_light_theme.json transport_pulse_phase3_powerbi_build_guide.md transport_pulse_world_map_light.svg spot_news_globe.css spot_news_globe.js spot_news_globe_data.js spot_news_globe.bundle.js spot_news_world.json package.json package-lock.json docs/spot-news-3d
git status --short
git commit -m "Add Spot News 3D supply risk globe"
git push origin main
```

If the repository uses another default branch, replace `main` with that branch name. Review `git status --short` before committing so unrelated local files are not included.

## Alternative: GitHub website upload

1. Download or open the release ZIP and extract it.
2. Open the existing GitHub repository and select **Add file > Upload files**.
3. Drag all extracted files and folders into the upload area. Preserve the `docs/spot-news-3d` folder.
4. Confirm that `spot_news_globe.bundle.js`, `spot_news_world.json` and `transport_pulse_world_map_light.svg` are included; the prototype needs them at runtime.
5. Use commit message `Add Spot News 3D supply risk globe`, then commit to a review branch or the default branch according to the team's repository policy.
6. Open `transport_pulse_phase3_eds_v2_prototype.html?page=spotnews` from a local clone or GitHub Pages deployment and verify the globe loads.

## GitHub Pages option

For a branch-based GitHub Pages site, keep the prototype files at repository root, then set **Settings > Pages > Deploy from a branch**, branch `main`, folder `/ (root)`. The entry URL will end with `/transport_pulse_phase3_eds_v2_prototype.html?page=spotnews`.

Company repositories may restrict GitHub Pages or custom JavaScript. Follow the repository's internal access and publishing policy before enabling it.

## Suggested pull request description

```text
Adds the Phase 3 Spot News redesign with a rotatable 3D Supply Risk Globe. CU selection now filters lane-linked news, quantitative risk scores, Top-2 call-offs and the next 14 days of PG12 readiness. The update includes a 2D WebGL fallback, Power BI implementation notes, lane inventory and scoring documentation.

Validation: Edge browser QA passed at 1280x720 and 1366x768, including globe rotation, zoom/reset, CU and lane selection, risk filters, tabs, empty states and fallback rendering.
```
