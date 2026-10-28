# Claim

## 2026-10-22 · Class-project practice · v1

Status: provisional · [AGENT DRAFT] · initial formulation retained for comparison

1. **I made** a Drakula-inspired drawing system with a “one stitch, one generation” mode.
2. **In making it, I found that** a small number of hand inputs can produce a much larger drawing.
3. **This means** that the system amplifies human labour.
4. **This is useful for** helping participants understand the relationship between human labour and algorithmic generation.

**Evidence:** The existing [eight-input output](artist_system/outputs/04_one_stitch_one_generation.png), [project README](artist_system/README.md), and [generation mapping](artist_system/js/system.js).

**Strongest objection — agent challenge:** “Stitch” is a name for a mouse/keyboard input in this prototype, not a measured physical stitch. A static export does not establish how it developed, and the README's eight-input attribution is not an independent interaction record. Neither participant understanding nor the value of human labour was tested. “Larger” also confuses segment count with image size because the drawing is fitted to the canvas. Other presets change several parameters simultaneously, so their differences cannot isolate this mapping's effect.

**Next action:** Hold the generation parameters fixed, check segment counts with the actual geometry functions, then restrict the claim to the behaviour verified.

## 2026-10-22 · Class-project practice · v2

Status: supported by initial evidence for code behaviour; provisional interpretation · [AGENT DRAFT] · student review pending

1. **I made** a Drakula-inspired drawing prototype whose “one stitch, one generation” mode maps mouse or keyboard input count to the generation order of a folded path.
2. **In making it, I found that** inspecting the existing output and checking the current geometry code with fixed two-layer settings gave 30 path segments at four inputs and 510 at eight, while thirteen and fourteen inputs both gave 16,382 because the order is capped at thirteen.
3. **This means** that this prototype's chosen mapping produces nonlinear growth in path-segment count up to a programmed limit; it does not measure the amount or value of physical stitching labour.
4. **This is useful for** planning a classroom comparison of input count and generated segment count, with the conversion rule and its limit made explicit.

**Evidence:**
- [Existing exported frame](artist_system/outputs/04_one_stitch_one_generation.png): inspected on 22 October; shows two contrasting path layers. It has no visible input counter, so its eight-input attribution comes from the [README](artist_system/README.md), not from the image alone.
- [Current mapping and preset](artist_system/js/system.js): `stitch-gen` selects two layers, 90° turns and a full path; `buildWorld()` uses `Math.min(13, state.stitches.length)`. Mouse and Space events add input records.
- [Geometry implementation](artist_system/js/dragon.js): `heighwayTurns()`, `buildSingleLayers()` and `countSegments()` produce and count the paths. Counts are generated segments, including separate layers, not unique visible lines or physical stitches.
- [Dated verification results](artist_system/outputs/2026-10-22_generation_check.json): executes the actual geometry functions with the generation branch reproduced from `system.js`; checks 0, 1, 2, 4, 8, 13 and 14 inputs. This is a code-level check, not an end-to-end browser or participant test.
- [Earlier project journal](process_journal/2026-09-14.md): retrospective context only; explicitly reconstructed on 14 October. [Today's journal](process_journal/2026-10-22-claim-practice.md) records this inspection and revision.

**Strongest objection:** The check confirms a programmed mapping rather than a new general finding about collaboration. It does not verify the browser's displayed counter or establish that people understand, prefer or value the mapping. The exported image alone cannot prove its input history.

**Revision after agent challenge:** Replaced “amplifies human labour” with measured segment-count growth; named simulated inputs, fixed settings and the generation cap; changed the educational claim from an observed benefit to a proposed use. This is the agent's revision, not a recorded student rejection or endorsement.

**Next action:** In the browser, capture counter-visible frames at 4, 8, 13 and 14 inputs with identical settings. Then ask participants to explain the conversion rule before claiming any learning benefit. Physical embroidery would require a separate input and labour record.

**Scope:** Classroom-project practice only. This does not replace the final-project topic in [topic.md](topic.md) or the earlier drafts in [artist_system/statements.md](artist_system/statements.md).

## 2026-10-28 · Class-project practice · v1

Status: provisional · [AGENT DRAFT] · initial formulation retained for comparison

1. **I made** a one-page rectangle studio whose count slider runs from 6 to 80.
2. **In making it, I found that** raising the count makes a larger composition.
3. **This means** that one quantity control sets the scale of the drawing.
4. **This is useful for** teaching how a single slider becomes compositional scale.

**Evidence:** The cascade frames at count 6 and count 80, [count 6](outputs/2026-10-28_rect_frames/cascade-count-6-page.png) and [count 80](outputs/2026-10-28_rect_frames/cascade-count-80-page.png), show a small pile and then a pile cut by the right and bottom edges. That pair is only one of the four layouts.

**Strongest objection — agent challenge:** Every layout builds `count` rectangles, so the slider does mean quantity in all four modes. The cascade pair shows a larger unclipped pile only while the offset is nonzero; at offset 0 the same count stays on the canvas. Fan keeps the same envelope at the default offsets. Grid and ribbon refill a canvas-sized field, and ribbon's envelope width is higher at count 28 than at count 80. A canvas export has no count label. Grain on the page defaults to 16% and uses `Math.random`, so these frames, which set grain to 0, are not default exports. Nothing here tests what a viewer learns.

**Next action:** Report envelope and canvas intersection for all four layouts at one seed, and repeat cascade with the offsets at 0, before treating "larger" as the effect of count.

## 2026-10-28 · Class-project practice · v2

Status: supported for this source at seed 8105; provisional as a claim about generators in general · [AGENT DRAFT] · student review pending

1. **I made** the one-page rectangle studio 色块叠层, with four layouts sharing one count slider, from commit `c6fb81ca0c0876cf6af5705276e79f177ce3a98d`, on a 1600×1000 canvas at seed 8105.
2. **In making it, I found that** with width 42%, height 18%, rotation −6° and offsets 18 and 14, cascade's unclipped envelope grows from 838.03×394.06 at count 6, to 1730.03×1019.71 at count 28, to 3785.91×2501.06 at count 80, while the blocks that still meet the canvas go 6 of 6, 28 of 28, then 31 of 80; fan's envelope stays 763.84×402.95 at all three counts and every block is fully inside; grid's envelope widths are 1614.75, 1649.11 and 1649.48, with every block meeting the canvas; ribbon's envelope widths are 1572.72, 1671.82 and 1560.74, with every block meeting the canvas. With both offsets at 0, cascade's envelope only moves from 711.66×282.55 to 729.09×294.72 and all 80 blocks stay fully inside.
3. **This means** that a shared count can be recorded in two separate results: how many rectangles are built, which rises in every mode, and how far the position rule carries them, which grows with the raw index only in cascade and only while the offset is nonzero. Fan, grid and ribbon place each index as a fraction of the series or of the canvas, so the added rectangles stay in the field that mode already occupies.
4. **This is useful for** the next comparison of a multi-mode generator, where the note beside a count should give the position rule, the unclipped envelope, and how many rectangles still meet the crop. That comparison is still to be done. This check does not show what a viewer understands.

**Evidence:**
- [Snapshot of the studio](outputs/2026-10-28_rect_index.html), copied from [commit c6fb81c](https://github.com/GaoYun913/ARTD8105-Gao-Yun/blob/c6fb81ca0c0876cf6af5705276e79f177ce3a98d/index.html) on branch `cursor/rect-color-blocks-interface-bcba`. `layoutRects()` steps cascade by `i * offset`; fan, grid and ribbon normalize the index.
- [Measurement record](outputs/2026-10-28_rect_count_check.json), run at 10:16 Asia/Shanghai on 28 October 2026. The script executes the snapshot's `mulberry32` and `layoutRects`. A rectangle "meets the canvas" when its rotated corners overlap the 1600×1000 canvas. The same run checked that the count-28 cascade list is not a prefix of the count-80 list: the largest shift among those 28 indexes is 15.99 px in x, 9.10 px in y and 5.27°. The live page returned the same first and last cascade rectangle as that extraction.
- [Method script](outputs/2026-10-28_rect_count_check.mjs). Re-run with `node my_work/outputs/2026-10-28_rect_count_check.mjs`.
- Page frames, after Reset, with the count label visible and grain set to 0: [cascade 6](outputs/2026-10-28_rect_frames/cascade-count-6-page.png), [cascade 80](outputs/2026-10-28_rect_frames/cascade-count-80-page.png), [fan 6](outputs/2026-10-28_rect_frames/fan-count-6-page.png), [fan 80](outputs/2026-10-28_rect_frames/fan-count-80-page.png), [grid 6](outputs/2026-10-28_rect_frames/grid-count-6-page.png), [grid 80](outputs/2026-10-28_rect_frames/grid-count-80-page.png), [ribbon 6](outputs/2026-10-28_rect_frames/ribbon-count-6-page.png), [ribbon 80](outputs/2026-10-28_rect_frames/ribbon-count-80-page.png). Matching 1600×1000 canvas buffers use the same names with `-grain0.png`.

**Strongest objection:** Count still means "build this many rectangles" in every mode, and the page frames show that number, so a viewer of the whole page is not forced to infer quantity from the pile. Fan's envelope is identical at the default offsets, but at offsets 80 and 80 it moves from 826.95 wide at count 6 to 830.50 wide at count 80. Grid at count 6 has no block fully inside the canvas, because the layout starts at a negative bleed; "meets the canvas" includes that partial overlap. The frames turn grain off. One seed is not a sample of seeds. Overlap area was not calculated, so this file does not call the result density.

**Revision after agent challenge:** Sentence 2 of v1 used the cascade pair as if it were the generator. v2 keeps cardinality and extent as separate results, adds the offset-0 cascade check, and reports fan, grid and ribbon instead of folding them into "larger." The revision is the agent's, done in the same sitting. It is not a recorded student rejection or endorsement.

**Next action:** Repeat the envelope test at a second seed, and compare colour at the same count across layouts. The layouts do not draw the same number of random values before colouring, and that coupling was not measured. Leave grain at its 16% default only after the grain itself is seeded; otherwise the export will not match a later run.

**Scope:** Classroom-project practice on 28 October 2026. The 22 October Drakula versions above are unchanged. `artist_system` is not in this repository, so those segment counts were not re-checked. No separate final-project claim was in this file. Flying-cat and petroglyph were not measured. This section does not replace a final-project claim.
