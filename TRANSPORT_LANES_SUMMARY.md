# Transport Pulse — Current Transport Lane Inventory

This inventory describes the demonstration routes currently shown in Global Network and reused by the Spot News Supply Risk Globe. Geographic paths are planning references rather than shipment GPS tracks. Brazil-origin routes are deliberately excluded from map overviews because the order volume is too low; related shipment detail can remain available in Shipment Explorer.

## Sea lanes

| Lane ID | Display lane | Planning path | CU | Standard LT | Actual LT | Variance | In transit | Delayed | Capacity |
|---|---|---|---|---:|---:|---:|---:|---:|---|
| `eu-hk` | Europe → Hong Kong | Germany → Atlantic → Cape of Good Hope → Hong Kong | Hong Kong | 61.0d | 68.5d | +7.5d | 14 | 6 | Constrained |
| `eu-cn` | Europe → China | Spain → Atlantic → Cape of Good Hope → China | China | 31.0d | 34.2d | +3.2d | 6 | 2 | Constrained |
| `sea-cross` | Sea — Cross Region | Spain → Atlantic → Cape of Good Hope → Hong Kong | Hong Kong | 69.0d | 68.5d | −0.5d | 8 | 1 | Increasing |
| `asia-taiwan` | Asia → Taiwan | East China → Taiwan | Taiwan | 18.0d | 19.4d | +1.4d | 12 | 2 | Stable |
| `intra-asia` | Sea — Intra Asia | East China → Korea | Korea | 24.5d | 28.5d | +4.0d | 18 | 5 | Increasing |

The European sea paths retain the Cape diversion geometry. The current demo does not draw a direct line through the Eurasian landmass.

## Air lanes

| Lane ID | Display lane | Route instances represented on globe | Standard LT | Actual LT | Variance | In transit | Delayed | Capacity |
|---|---|---|---:|---:|---:|---:|---:|---|
| `air-cross` | Air — Cross Region | Sweden → Japan; Sweden → Korea; Estonia → China; Poland → Taiwan | 7.6d | 5.6d | −2.0d | 7 | 0 | Stable |
| `asia-japan` | Asia → Japan | China → Japan | 6.8d | 7.4d | +0.6d | 11 | 1 | Stable |

`air-cross` is currently one aggregated business lane ID displayed as four origin/destination path instances. Production Power BI data should split these into child route IDs when metrics differ by origin or destination.

## Road lanes

| Lane ID | Display lane | Planning path | CU | Standard LT | Actual LT | Variance | In transit | Delayed | Capacity |
|---|---|---|---|---:|---:|---:|---:|---:|---|
| `road-cn-hk` | Road — CN/HK | East China → South China → Hong Kong | Hong Kong | 10.5d | 12.0d | +1.5d | 9 | 2 | Stable |
| `south-cn` | Road — South China | East China → South China → Mainland Southeast Asia → Malaysia | China | 8.0d | 9.1d | +1.1d | 10 | 2 | Stable |

The road polylines are simplified corridor references. Production paths should use approved logistics nodes or lane master coordinates rather than inferred road geometry.

## Implementation notes

- The globe has 12 displayed path instances mapped to 9 unique sea, air and road lane IDs.
- Sea is blue, air is green and road is orange. Risk markers are separate from mode color.
- Direction is shown by path order and arrow markers.
- Global Network owns the lane performance metrics. Spot News references those values and adds a separate estimated disruption impact for each News ID + CU assessment.
- Courier — Asia exists in the Global Network lane table, but it is not included in this sea/air/road map inventory because no geographic path is defined for the current prototype.
