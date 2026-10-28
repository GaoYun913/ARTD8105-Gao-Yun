---
date: 2026-10-28
week:
step: "NA"
session_minutes:
entry_type: "surprise"
artifacts: ["my_work/claim.md", "my_work/outputs/2026-10-28_rect_index.html", "my_work/outputs/2026-10-28_rect_count_check.json", "my_work/outputs/2026-10-28_rect_count_check.mjs", "my_work/outputs/2026-10-28_rect_frames/", "my_work/_research_log/sessions/2026-10-28_1017.jsonl"]
---

# [AGENT DRAFT] Class-project claim practice — shared count, different position rules

## What I set out to do

The student asked for the class-project claim exercise: choose an earlier project that can be inspected, write the four sentences, challenge what the evidence supports, revise, keep earlier claim text, and record the work in the journal and the agent log.

The course guide calls this kind of writing Step 7. The student message did not name a workbook step, so the log uses `NA`. The assignment's 25 minutes is the exercise length, not a measured duration.

## What I expected to happen

The count slider is one control, labelled 色块数量, with the same range in every layout. The first formulation treated a rise from 6 to 80 as a larger composition. The cascade frames at those two counts look like that.

## What actually happened

The studio in this account that can be inspected is 色块叠层, commit `c6fb81ca0c0876cf6af5705276e79f177ce3a98d`. `artist_system` from the 22 October claim is not in the repository. Flying-cat and petroglyph are on other branches and were not measured.

`layoutRects()` was executed from a snapshot of that file, at seed 8105, on the 1600×1000 canvas. At width 42%, height 18%, rotation −6° and offsets 18 and 14:

- Cascade envelope: 838.03×394.06 at count 6, 1730.03×1019.71 at 28, 3785.91×2501.06 at 80. Blocks meeting the canvas: 6, 28, 31. Fully inside: 6, 19, 19.
- Fan envelope: 763.84×402.95 at 6, 28 and 80. All blocks fully inside.
- Grid envelope widths: 1614.75, 1649.11, 1649.48. All blocks meet the canvas. Fully inside at count 6 is 0, because the layout starts at a negative bleed.
- Ribbon envelope widths: 1572.72, 1671.82, 1560.74. All blocks meet the canvas. The width is highest at count 28.

With both offsets at 0, cascade at count 80 stays fully inside an envelope of 729.09×294.72. The count-28 cascade rectangles are not the count-80 prefix. Across those 28 indexes the largest shift is 15.99 px in x, 9.10 px in y and 5.27°, from `t = i / (n - 1)` in the wobble and the rotation. The live page returned the same first and last cascade rectangle as the extracted function.

The page frames click Reset, then set layout, count and grain 0. Grain on the page defaults to 16% and uses `Math.random`. The captured page bitmaps are 1440×813 and show the layout name and the count. The canvas buffers are 1600×1000.

## The gap

The label names a quantity. The position formulas do not all use that quantity as a step. Cascade adds `i * offset` to a fixed start. Fan, grid and ribbon fold the index into a fraction of the series or of the canvas. The guess, marked as a guess, is that a shared slider name was written for the number of items, and the spatial formulas were written per layout without a second pass to make "count" change the same spatial result. This file does not establish why the formulas were written that way.

## Numbers

Seed 8105. Canvas 1600×1000. Default structural values: count slider 6–80, width 0.42, height 0.18, offsetX 18, offsetY 14, rotation −6°. Check time 2026-10-28T10:16:14+08:00.

Cascade, default offsets, unclipped envelope width from count 6 to 80: +2947.88. Height: +2107. Intersection: 6 of 6, then 31 of 80.

Fan, same settings, envelope change from count 6 to 80: 0 in width and height.

Grid width change, count 6 to 80: +34.73. Ribbon width change, count 6 to 80: −11.98.

Cascade, offsets 0, envelope width from count 6 to 80: 711.66 to 729.09. Fully inside: 80 of 80.

Fan, offsets 80, envelope width: 826.95 at count 6 and 830.50 at count 80.

## Alternatives I rejected, and why

Rewriting the 22 October Drakula claim. Its source files are not in this repository, so a new inspection could not check them.

Calling the fan and grid result "density." Overlap area was not calculated. The measured quantities are the unclipped envelope and canvas intersection.

Using the cascade 6-versus-80 frames as the whole finding. They support v1 and fail as soon as the other layouts, and cascade at offset 0, are included.

A claim about what a viewer learns. No one was asked.

## What this constrains going forward

A later count comparison needs the position rule, the envelope, and the intersection count written beside the slider value. A second seed is still open. Colour across layouts is still open, because the layouts consume different numbers of random values before colouring. Grain has to be seeded before a default-grain export can be used as a repeatable frame. The wording is an agent draft until the student keeps, changes, or drops it. No decision record was written: the student has not accepted or rejected the sentences.
