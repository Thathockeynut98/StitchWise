# Changelog

## 0.2.1 — Experimental jump trim export\n- Select long jump movements automatically or individually.\n- Insert trim commands and download a new PES/JEF/VP3/DST/EXP design.\n- Preserve the original file and warn about color metadata, format trim semantics and sew-out validation.\n\n## 0.2.0 — Multi-format inspection and simulator
- Added extended-format import engine using browser-side Pyodide and pyembroidery.
- Added playback, pause, scrub and adjustable playback speed.
- Added repeated needle penetration, retracing, and micro-stitch risk heuristics.
- Added progress messages and updated file selector.

# Changelog

## 0.1.1 — Browser edition
- Removed Windows/Electron desktop requirement.
- Local browser analysis of DST and EXP designs.
- SVG stitch viewer, pan and zoom.
- Heuristic diagnostics for stitch lengths, jumps, concentration, hoop limits and color changes.
- Fabric-aware rule-based repair guidance.
- Added sample design and local Node server.

### Known limitations
- No trained AI model, automatic repair or stitch-file export.
- PES/JEF and other formats remain unsupported.
- Diagnostic findings are screening estimates; verify by sew-out.
