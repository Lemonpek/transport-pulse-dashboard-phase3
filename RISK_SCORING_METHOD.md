# Transport Pulse — Quantitative Risk Scoring

## 1. Spot News risk score

The Spot News page scores each **News ID + CU** combination. The same article can therefore be High Risk for one CU and Normal for another.

### Formula

```text
Delay component       D = clamp(max(Estimated LT Impact Days, 0) × 10, 0, 100)
Order exposure        O = clamp(Impacted Active Orders / Active Orders in CU Scope × 100, 0, 100)
PG12 exposure         P = clamp(Impacted PG12 Orders / PG12 Orders in Next 14 Days × 100, 0, 100)
Top-2 exposure        T = clamp(Impacted Top-2 Call-off Volume / Total Top-2 Call-off Volume × 100, 0, 100)

Spot News Risk Score = round(0.40D + 0.25O + 0.25P + 0.10T)
```

The delay component reaches 100 at +10 days and is capped there. A negative estimated LT impact contributes zero delay risk rather than creating a negative score.

### Categories

| Score | Category | Intended response |
|---:|---|---|
| 70–100 | High Risk | Validate the impact and start an operational follow-up. |
| 40–69 | Middle Risk | Monitor the linked lane/orders and confirm mitigation options. |
| 0–39 | Normal | Keep visible; no immediate escalation from this news signal. |
| Missing critical input | Not scored | Validate the news-to-lane and order exposure mapping before classification. |

### Worked examples from the prototype

| News assessment | D | O | P | T | Calculation | Score | Category |
|---|---:|---:|---:|---:|---|---:|---|
| European port disruption — Hong Kong | 80 | 90 | 90 | 100 | 0.40×80 + 0.25×90 + 0.25×90 + 0.10×100 | 87 | High Risk |
| Cape diversion — Hong Kong | 60 | 55 | 40 | 80 | 0.40×60 + 0.25×55 + 0.25×40 + 0.10×80 | 56 | Middle Risk |
| CN/HK handover watch — Hong Kong | 15 | 20 | 35 | 30 | 0.40×15 + 0.25×20 + 0.25×35 + 0.10×30 | 23 | Normal |

The prototype inputs and weights are transparent demo assumptions pending business validation. They are deterministic calculations; no AI model produces the score.

### Data rules

- Estimated news impact and actual lane lead-time variance are separate measures. An actual variance must not automatically become the news estimate.
- Do not add LT estimates from multiple news items. They may describe overlapping disruption mechanisms.
- Use a consistent selected scope for every denominator: CU, period and mode.
- The PG12 window is report date inclusive through report date + 14 days exclusive. In the demo, this is 14–27 Jun 2026.
- Missing or non-numeric critical inputs return `Not scored`; they do not default to Normal.
- Store the input percentages and score version with the assessment so the result is auditable.

### Suggested Power BI measures

```DAX
News Delay Component =
MIN ( 100, MAX ( 0, SELECTEDVALUE ( NewsCUExposure[EstimatedLTImpactDays] ) * 10 ) )

News Risk Score =
VAR HasInputs =
    NOT ISBLANK ( SELECTEDVALUE ( NewsCUExposure[EstimatedLTImpactDays] ) ) &&
    NOT ISBLANK ( SELECTEDVALUE ( NewsCUExposure[OrderExposurePct] ) ) &&
    NOT ISBLANK ( SELECTEDVALUE ( NewsCUExposure[PG12ExposurePct] ) ) &&
    NOT ISBLANK ( SELECTEDVALUE ( NewsCUExposure[Top2ExposurePct] ) )
RETURN
IF (
    NOT HasInputs,
    BLANK (),
    ROUND (
        0.40 * [News Delay Component] +
        0.25 * SELECTEDVALUE ( NewsCUExposure[OrderExposurePct] ) +
        0.25 * SELECTEDVALUE ( NewsCUExposure[PG12ExposurePct] ) +
        0.10 * SELECTEDVALUE ( NewsCUExposure[Top2ExposurePct] ),
        0
    )
)

News Risk Category =
SWITCH (
    TRUE (),
    ISBLANK ( [News Risk Score] ), "Not scored",
    [News Risk Score] >= 70, "High Risk",
    [News Risk Score] >= 40, "Middle Risk",
    "Normal"
)
```

## 2. Lane operational risk score

Global Network has a different score for the observed lane condition:

```text
Variance score = min(40, max(0, Actual LT Variance Days × 5))
Delay score    = min(30, Delayed Shipments / Total Shipments × 100)
Capacity score = 30 Constrained; 18 Increasing; 5 Stable; otherwise 0

Lane Risk Score = round(Variance score + Delay score + Capacity score)
```

The current lane thresholds are High at 75 or above, Medium at 45–74, and Low below 45. This lane score measures observed operational condition, while the Spot News score measures estimated CU exposure to a specific news item. Keep their names, thresholds and colors distinct in the semantic model.
