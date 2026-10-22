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
