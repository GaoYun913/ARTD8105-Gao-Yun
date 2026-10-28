/**
 * Re-run the rectangle studio's layout function and export the canvas.
 * Source snapshot: 2026-10-28_rect_index.html
 * Commit: c6fb81ca0c0876cf6af5705276e79f177ce3a98d (index.html on
 * cursor/rect-color-blocks-interface-bcba).
 *
 * Geometry is the page's own mulberry32 + layoutRects, not a rewrite.
 * A rectangle counts as visible when its rotated corners overlap the
 * 1600×1000 canvas. Frames are the page canvas after Reset, then layout,
 * count and grain=0. Grain is zero only in the frames: the page default
 * is 16% and uses Math.random, so a default export is not repeatable.
 */
import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const here = dirname(fileURLToPath(import.meta.url));
const htmlPath = join(here, "2026-10-28_rect_index.html");
const frameDir = join(here, "2026-10-28_rect_frames");
const html = readFileSync(htmlPath, "utf8");
const htmlSha256 = createHash("sha256").update(html).digest("hex");
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];

function extractFunction(source, name) {
  const start = source.indexOf(`function ${name}(`);
  if (start < 0) throw new Error(`missing function ${name}`);
  let i = source.indexOf("{", start);
  let depth = 0;
  for (; i < source.length; i += 1) {
    if (source[i] === "{") depth += 1;
    else if (source[i] === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }
  throw new Error(`unclosed function ${name}`);
}

const extracted = [
  extractFunction(script, "mulberry32"),
  extractFunction(script, "layoutRects"),
].join("\n\n");
const extractedSha256 = createHash("sha256").update(extracted).digest("hex");

const W = 1600;
const H = 1000;
const context = vm.createContext({ canvas: { width: W, height: H }, Math });
vm.runInContext(extracted, context);
const { mulberry32, layoutRects } = context;

function corners(rect) {
  const cx = rect.x + rect.w / 2;
  const cy = rect.y + rect.h / 2;
  const a = (rect.rot * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [
    [-rect.w / 2, -rect.h / 2],
    [rect.w / 2, -rect.h / 2],
    [rect.w / 2, rect.h / 2],
    [-rect.w / 2, rect.h / 2],
  ].map(([x, y]) => [cx + x * c - y * s, cy + x * s + y * c]);
}

function overlapsCanvas(rectPoly) {
  const canvas = [
    [0, 0],
    [W, 0],
    [W, H],
    [0, H],
  ];
  const shapes = [rectPoly, canvas];
  for (const shape of shapes) {
    for (let i = 0; i < shape.length; i += 1) {
      const next = shape[(i + 1) % shape.length];
      const axis = [-(next[1] - shape[i][1]), next[0] - shape[i][0]];
      const project = (points) => {
        let min = Infinity;
        let max = -Infinity;
        for (const point of points) {
          const value = point[0] * axis[0] + point[1] * axis[1];
          min = Math.min(min, value);
          max = Math.max(max, value);
        }
        return [min, max];
      };
      const [minA, maxA] = project(rectPoly);
      const [minB, maxB] = project(canvas);
      if (maxA < minB || maxB < minA) return false;
    }
  }
  return true;
}

function fullyInside(poly) {
  return poly.every(([x, y]) => x >= 0 && x <= W && y >= 0 && y <= H);
}

function measure(partial) {
  const s = {
    layout: "cascade",
    count: 28,
    width: 0.42,
    height: 0.18,
    offsetX: 18,
    offsetY: 14,
    rotation: -6,
    ...partial,
  };
  const rects = layoutRects(s, mulberry32(8105));
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let intersecting = 0;
  let inside = 0;
  for (const rect of rects) {
    const poly = corners(rect);
    for (const [x, y] of poly) {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
    if (overlapsCanvas(poly)) intersecting += 1;
    if (fullyInside(poly)) inside += 1;
  }
  const round = (n) => Math.round(n * 100) / 100;
  return {
    layout: s.layout,
    count: s.count,
    offsetX: s.offsetX,
    offsetY: s.offsetY,
    widthRatio: s.width,
    rectangles: rects.length,
    intersectingCanvas: intersecting,
    fullyInside: inside,
    partialOrOutside: rects.length - inside,
    envelope: {
      minX: round(minX),
      minY: round(minY),
      maxX: round(maxX),
      maxY: round(maxY),
      width: round(maxX - minX),
      height: round(maxY - minY),
    },
  };
}

const layouts = ["cascade", "grid", "fan", "ribbon"];
const counts = [6, 28, 80];
const rows = [];
for (const layout of layouts) {
  for (const count of counts) rows.push(measure({ layout, count }));
}
const offsetSweep = [];
for (const offset of [0, 18, 80]) {
  for (const layout of ["cascade", "fan"]) {
    for (const count of [6, 80]) {
      offsetSweep.push(measure({ layout, count, offsetX: offset, offsetY: offset }));
    }
  }
}
const wideGrid = [6, 28, 80].map((count) =>
  measure({ layout: "grid", count, width: 0.88 })
);

function shanghaiNow() {
  const formatted = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());
  return `${formatted.replace(" ", "T")}+08:00`;
}

function cascadeState(count) {
  return {
    layout: "cascade",
    count,
    width: 0.42,
    height: 0.18,
    offsetX: 18,
    offsetY: 14,
    rotation: -6,
  };
}

const cascade28 = layoutRects(cascadeState(28), mulberry32(8105));
const cascade80 = layoutRects(cascadeState(80), mulberry32(8105));
const cascadePrefixSame = cascade28.every(
  (rect, index) => JSON.stringify(rect) === JSON.stringify(cascade80[index])
);
let maxAbsDx = 0;
let maxAbsDy = 0;
let maxAbsDrot = 0;
for (let index = 0; index < cascade28.length; index += 1) {
  const a = cascade28[index];
  const b = cascade80[index];
  maxAbsDx = Math.max(maxAbsDx, Math.abs(a.x - b.x));
  maxAbsDy = Math.max(maxAbsDy, Math.abs(a.y - b.y));
  maxAbsDrot = Math.max(maxAbsDrot, Math.abs(a.rot - b.rot));
}

const report = {
  checkedAt: shanghaiNow(),
  source: {
    repository: "GaoYun913/ARTD8105-Gao-Yun",
    commit: "c6fb81ca0c0876cf6af5705276e79f177ce3a98d",
    branch: "cursor/rect-color-blocks-interface-bcba",
    file: "index.html",
    snapshot: "my_work/outputs/2026-10-28_rect_index.html",
    htmlSha256,
    extractedFunctionsSha256: extractedSha256,
  },
  fixed: {
    canvas: [W, H],
    seed: 8105,
    defaultWidthRatio: 0.42,
    defaultHeightRatio: 0.18,
    defaultOffsetX: 18,
    defaultOffsetY: 14,
    defaultRotation: -6,
    countSlider: [6, 80],
  },
  method:
    "Executed the extracted layoutRects and mulberry32 from the snapshot. Visibility uses a separating-axis test of the rotated rectangle against the canvas. Envelope is the axis-aligned bounds of all four corners, including corners outside the canvas.",
  defaultOffsets: rows,
  offsetSweep,
  gridAtMaxWidth: wideGrid,
};

function round(n) {
  return Math.round(n * 100) / 100;
}

function delta(layout, countA, countB, list = rows) {
  const a = list.find((row) => row.layout === layout && row.count === countA);
  const b = list.find((row) => row.layout === layout && row.count === countB);
  return {
    layout,
    envelopeWidth6: a.envelope.width,
    envelopeWidth80: b.envelope.width,
    widthDelta: round(b.envelope.width - a.envelope.width),
    envelopeHeight6: a.envelope.height,
    envelopeHeight80: b.envelope.height,
    heightDelta: round(b.envelope.height - a.envelope.height),
    intersecting6: a.intersectingCanvas,
    intersecting80: b.intersectingCanvas,
  };
}

report.count6vs80AtDefaults = layouts.map((layout) => delta(layout, 6, 80));
report.cascadePrefix = {
  note: "The step i * offset does not use count, but t = i / (n - 1) still changes the sine, cosine and rotation of an earlier index when count changes. Rectangle i is therefore not stable. The measured deltas are only that normalized wobble, not the step.",
  count28IsPrefixOfCount80: cascadePrefixSame,
  comparedIndexes: cascade28.length,
  maxAbsDx: Math.round(maxAbsDx * 100) / 100,
  maxAbsDy: Math.round(maxAbsDy * 100) / 100,
  maxAbsDrot: Math.round(maxAbsDrot * 100) / 100,
};

writeFileSync(join(here, "2026-10-28_rect_count_check.json"), `${JSON.stringify(report, null, 2)}\n`);

async function captureFrames() {
  mkdirSync(frameDir, { recursive: true });
  const port = 9333;
  const chrome = spawn(
    "google-chrome",
    [
      "--headless=new",
      "--no-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      `--remote-debugging-port=${port}`,
      "--user-data-dir=/tmp/chrome-rect-claim",
      "--window-size=1440,900",
      "about:blank",
    ],
    { stdio: "ignore" }
  );

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  let version;
  for (let i = 0; i < 50; i += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (response.ok) {
        version = await response.json();
        break;
      }
    } catch {
      await sleep(200);
    }
  }
  if (!version) {
    chrome.kill();
    throw new Error("Chrome did not open a debugging port");
  }

  const targets = await fetch(`http://127.0.0.1:${port}/json/list`).then((r) => r.json());
  const page = targets.find((target) => target.type === "page");
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve);
    ws.addEventListener("error", reject);
  });

  let nextId = 0;
  const pending = new Map();
  ws.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(JSON.stringify(message.error)));
      else resolve(message.result);
    }
  });
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = ++nextId;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });

  await send("Page.enable");
  await send("Runtime.enable");
  await send("Page.navigate", { url: `file://${htmlPath}` });
  await send("Runtime.evaluate", {
    expression:
      "new Promise((resolve) => { if (document.readyState === 'complete') resolve(true); else addEventListener('load', () => resolve(true)); })",
    awaitPromise: true,
  });

  const shots = [];
  for (const layout of layouts) {
    for (const count of [6, 80]) {
      const expression = `(() => {
        document.getElementById("resetBtn").click();
        document.getElementById("layout").value = ${JSON.stringify(layout)};
        document.getElementById("count").value = ${JSON.stringify(String(count))};
        document.getElementById("grain").value = "0";
        for (const id of ["layout", "count", "grain"]) {
          const el = document.getElementById(id);
          el.dispatchEvent(new Event("input", { bubbles: true }));
          el.dispatchEvent(new Event("change", { bubbles: true }));
        }
        const field = document.getElementById("field");
        const layoutEl = document.getElementById("layout");
        return {
          layout: layoutEl.value,
          layoutLabel: layoutEl.selectedOptions[0].textContent,
          countLabel: document.getElementById("countVal").textContent,
          grainLabel: document.getElementById("grainVal").textContent,
          canvas: [field.width, field.height],
          png: field.toDataURL("image/png"),
        };
      })()`;
      const result = await send("Runtime.evaluate", {
        expression,
        returnByValue: true,
      });
      const value = result.result.value;
      const pngName = `${layout}-count-${count}-grain0.png`;
      const pngPath = join(frameDir, pngName);
      writeFileSync(pngPath, Buffer.from(value.png.split(",")[1], "base64"));
      const shot = await send("Page.captureScreenshot", { format: "png" });
      const pageName = `${layout}-count-${count}-page.png`;
      writeFileSync(join(frameDir, pageName), Buffer.from(shot.data, "base64"));
      shots.push({
        layout: value.layout,
        layoutLabel: value.layoutLabel,
        countLabel: value.countLabel,
        grainLabel: value.grainLabel,
        canvas: value.canvas,
        canvasPng: `my_work/outputs/2026-10-28_rect_frames/${pngName}`,
        pagePng: `my_work/outputs/2026-10-28_rect_frames/${pageName}`,
        canvasSha256: createHash("sha256").update(readFileSync(pngPath)).digest("hex"),
      });
    }
  }

  const cross = await send("Runtime.evaluate", {
    expression: `(() => {
      ${extracted}
      globalThis.canvas = document.getElementById("field");
      const s = { layout: "cascade", count: 80, width: 0.42, height: 0.18, offsetX: 18, offsetY: 14, rotation: -6 };
      const rects = layoutRects(s, mulberry32(8105));
      return { canvas: [canvas.width, canvas.height], n: rects.length, first: rects[0], last: rects[rects.length - 1] };
    })()`,
    returnByValue: true,
  });

  ws.close();
  chrome.kill();
  return { shots, browserCrossCheck: cross.result.value };
}

const frames = await captureFrames();
report.frames = frames.shots;
report.browserCrossCheck = frames.browserCrossCheck;
report.frameNote =
  "Each frame clicks Reset (seed 8105 and the HTML defaults), then sets layout, count and grain 0. The window was requested at 1440×900; the captured page PNGs are 1440×813. Canvas PNGs are the 1600×1000 drawing buffer.";
writeFileSync(join(here, "2026-10-28_rect_count_check.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ deltas: report.count6vs80AtDefaults, cross: report.browserCrossCheck }, null, 2));
