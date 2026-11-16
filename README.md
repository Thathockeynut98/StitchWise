# 🧵 StitchWise AI
### A closer look at every stitch, before it reaches the hoop.

**A design can look beautiful on the screen and still cause trouble at the machine.** Too many needle penetrations in one spot, long traveling stitches, tiny stitches that pile up, or a design that pushes the limits of your hoop can turn a simple project into a frustrating sew-out.

That's why I wanted **StitchWise**: a place to slow down, look closely at a design, and catch potential stitching problems *before* wasting thread, stabilizer, fabric, and time.

**[Open StitchWise Workshop](https://thathockeynut98.github.io/StitchWise/)**

---

## What can StitchWise help you spot?

- **Crowded stitching:** Find areas where stitch endpoints bunch together and may deserve a closer look for stiffness, thread buildup, or puckering.
- **Long jumps:** See where the machine travels between stitched areas, and decide where a thread trim may help keep the back cleaner.
- **Tiny or repeated stitches:** Identify spots with repeated needle penetrations or very short stitches that could contribute to thread breaks or bulky areas.
- **Unusually long stitches:** Review stitches that may snag or fail to cover the fabric as intended.
- **Hoop fit:** Check the design's overall size against your selected hoop dimensions.
- **Questionable travel paths:** Highlight retraced routes and other stitch patterns worth reviewing before you press Start.

These are **warning signs, not verdicts**. The right density and stitch length depend on the fabric, stabilizer, thread, needle, and digitizing method.

## Your embroidery workbench

### 🔎 Inspector
Open a design and see how it's stitched, not just how it looks when finished. Zoom in, pan around, show or hide jump paths, and play through the stitch sequence to follow the machine's route.

### 🎯 Select a problem area
Use **Select area** to drag around a section of the design. StitchWise shows the stitch count, selected area, and any flagged stitches nearby. From there, you can look at density or send nearby jump runs to the repair plan.

### 🌡️ Density & Flaws
Use the heatmap to find areas with lots of stitch endpoints packed into a small space. Adjust the hotspot threshold to make possible trouble spots easier to see.

**Good to know:** This is a *stitch-concentration guide*, not a true satin or fill-density measurement. The slider changes what gets highlighted; it does **not** change the stitching.

### ✂️ Repair Studio
Review long jump runs, choose where to add trims, and preview the planned changes alongside the original design. You can also choose to remove certain redundant zero-length stitch commands.

StitchWise checks a newly exported file by reopening it and comparing important details, including needle positions, stitch counts, color changes, and design size. If those checks fail, it blocks the download.

**A trim cuts the thread; it doesn't erase the machine's travel.** StitchWise does not yet automatically redigitize objects, change fill spacing, fix registration, or reroute the design.

## Getting started

1. **[Open StitchWise](https://thathockeynut98.github.io/StitchWise/)** in your browser.
2. Choose **Import design** and select an embroidery file.
3. Start in **Inspector** to look over the stitch path and any flagged areas.
4. Use **Select area** or **Density & Flaws** to investigate a section more closely.
5. If needed, open **Repair Studio** to preview trims or conservative cleanup before exporting.

StitchWise can read many common embroidery machine file types, including **DST, EXP, PES, PEC, JEF, VP3, HUS, VIP, SEW, and XXX**. Support can vary between files and format versions, so not every design is guaranteed to open correctly.

## A note from the workbench

StitchWise is here to help you **make better decisions before a sew-out**, not replace a good digitizer's judgment.

A heatmap can't tell you everything about how a satin column will lay on a towel. A stitch file alone can't tell you whether your stabilizer is right for a stretchy knit. And a design that passes every on-screen check can still behave differently once it's under the presser foot.

Always review edited designs in your embroidery software, double-check the thread colors and trim behavior, and **test-stitch on scrap fabric** before committing to the finished project.

Your design stays in your browser while StitchWise analyzes it. Some file types require a one-time download of the embroidery-file reader, so an internet connection may be needed when you first open them.

---

### Made for the details that matter.

**Cleaner stitching starts with knowing what's happening between the stitches.**

**[Try StitchWise AI →](https://thathockeynut98.github.io/StitchWise/)**

<details>
<summary>For anyone who wants to run StitchWise locally</summary>

You can also run the project on your own computer with `node server.cjs`, then open `http://localhost:4173`. The public version is hosted through GitHub Pages.

</details>
