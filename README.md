# StitchWise AI — Browser Edition v0.2

Live app: https://thathockeynut98.github.io/StitchWise/

## Features
- Local DST and EXP stitch decoding.
- Extended browser-only decoding through Pyodide + pyembroidery for mainstream machine formats, including PES, PEC, JEF, VP3, HUS, VIP, SEW, XXX and more.
- Zoomable/pannable stitch explorer with jump paths and flagged stitch segments.
- Stitch-by-stitch simulation with play/pause, scrubber, and speed control.
- Heuristic diagnostics: very short/long stitches, long jumps, endpoint concentration, repeated needle penetrations, retraced routes, hoop limits, color changes and risk indicators for puckering/thread breaks.
- Fabric-specific rule-based repair guidance.

## Running
Use the GitHub Pages link above or run `node server.cjs` and visit http://localhost:4173.

## Extended formats
The first import of an extended format downloads Pyodide and installs the open-source pyembroidery Python package into the browser runtime. This requires an internet connection and may take a minute. Design bytes remain in the browser; they are not sent to a StitchWise server. Formats vary in what data they encode, and individual files may fail to parse. The supported extension list reflects the reader's known family of formats, not a guarantee that every variant works.

## Experimental Repair Design Studio\nLoad a design, select jumps longer than a chosen distance or check individual jumps, choose PES/JEF/VP3/DST/EXP, and download a new file. The source design is unchanged. This inserts trims before selected travel runs and optionally removes consecutive zero-length stitch commands. It does not remove necessary travel, recalculate stitch routing or fix dense embroidery automatically. Some formats do not preserve explicit trim commands. Export may lose original thread-color metadata, so verify output in dedicated embroidery software before using it. This feature has not been validated against real-world machine files yet.\n\n## Limitations
- Selective jump-trim export is experimental. No automatic geometry repair, density reduction or safe sew-out guarantee.
- Diagnostics are approximations, not reliable predictions of real sew-out results, and the risk score is heuristic.
- Registration errors, real fill density and fabric puckering cannot be reliably diagnosed from stitch coordinates alone; highlighted findings are indicators for human review.
- No trained AI model is involved.
- External runtime dependencies are downloaded from a CDN for extended formats; do not use in offline mode on first load.

## Development
Changes to `main` deploy to GitHub Pages. Test imports against actual embroidery files before relying on results.
