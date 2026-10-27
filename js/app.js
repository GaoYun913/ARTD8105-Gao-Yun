import {
  MOTIFS,
  PIGMENTS,
  WALLS,
  STYLES,
  CATEGORIES,
  NARRATIVES,
  motifById,
} from "./motifs.js";

const SAVE_KEY = "petroglyph-narrative-v1";

const canvas = document.getElementById("wall");
const ctx = canvas.getContext("2d", { alpha: false });
const torchEl = document.getElementById("torch");
const stage = document.getElementById("stage");

const state = {
  figures: [],
  strokes: [],
  selectedId: null,
  activeMotif: "bison",
  category: "all",
  tool: "select",
  wall: "limestone",
  title: "",
  caption: "",
  torch: 0.7,
  camera: { x: 0, y: 0, z: 1 },
  undo: [],
  redo: [],
};

let rock = null;
let rockKey = "";
let dpr = 1;
let cssW = 1;
let cssH = 1;
let dirty = true;
let drag = null;
let paint = null;
let flicker = 1;

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a) {
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash2(ix, iy) {
  let n = ix * 374761393 + iy * 668265263;
  n = (n ^ (n >> 13)) * 1274126177;
  return ((n ^ (n >> 16)) >>> 0) / 4294967296;
}

function noise(x, y) {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const fx = x - x0;
  const fy = y - y0;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  return (
    lerp(lerp(hash2(x0, y0), hash2(x0 + 1, y0), ux), lerp(hash2(x0, y0 + 1), hash2(x0 + 1, y0 + 1), ux), uy)
  );
}

function fbm(x, y, oct = 4) {
  let v = 0;
  let a = 0.5;
  let f = 1;
  for (let i = 0; i < oct; i += 1) {
    v += a * noise(x * f, y * f);
    a *= 0.5;
    f *= 2;
  }
  return v;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

const WALL_PALETTES = {
  limestone: { a: [198, 168, 122], b: [156, 122, 82], c: [122, 90, 58], stain: [160, 80, 46] },
  sandstone: { a: [176, 118, 74], b: [138, 78, 46], c: [96, 52, 32], stain: [180, 70, 40] },
  granite: { a: [150, 142, 132], b: [110, 104, 98], c: [72, 68, 64], stain: [90, 70, 60] },
  night: { a: [62, 48, 36], b: [36, 26, 20], c: [18, 12, 10], stain: [90, 42, 28] },
};

function makeRock(w, h, kind) {
  const tw = Math.max(2, Math.floor(w / 2));
  const th = Math.max(2, Math.floor(h / 2));
  const off = document.createElement("canvas");
  off.width = tw;
  off.height = th;
  const octx = off.getContext("2d");
  const img = octx.createImageData(tw, th);
  const d = img.data;
  const pal = WALL_PALETTES[kind] || WALL_PALETTES.limestone;
  for (let y = 0; y < th; y += 1) {
    for (let x = 0; x < tw; x += 1) {
      const n = fbm(x / 70, y / 70, 5);
      const n2 = fbm(x / 18 + 30, y / 22, 3);
      const crack = fbm(x / 9, y / 42 + 8, 2);
      const stain = fbm(x / 90 + 12, y / 70, 3);
      let t = n * 0.7 + n2 * 0.3;
      let r = lerp(pal.c[0], pal.a[0], t);
      let g = lerp(pal.c[1], pal.a[1], t);
      let b = lerp(pal.c[2], pal.a[2], t);
      if (stain > 0.62) {
        const s = (stain - 0.62) * 2.2;
        r = lerp(r, pal.stain[0], s * 0.35);
        g = lerp(g, pal.stain[1], s * 0.35);
        b = lerp(b, pal.stain[2], s * 0.35);
      }
      if (crack > 0.72) {
        const k = (crack - 0.72) * 3;
        r *= 1 - k * 0.35;
        g *= 1 - k * 0.35;
        b *= 1 - k * 0.35;
      }
      const spec = noise(x / 3, y / 3) * 14 - 7;
      const i = (y * tw + x) * 4;
      d[i] = clamp(r + spec, 0, 255);
      d[i + 1] = clamp(g + spec * 0.85, 0, 255);
      d[i + 2] = clamp(b + spec * 0.6, 0, 255);
      d[i + 3] = 255;
    }
  }
  octx.putImageData(img, 0, 0);
  const full = document.createElement("canvas");
  full.width = w;
  full.height = h;
  const fctx = full.getContext("2d");
  fctx.imageSmoothingEnabled = true;
  fctx.drawImage(off, 0, 0, w, h);
  return full;
}

function centroid(pts) {
  let x = 0;
  let y = 0;
  for (const p of pts) {
    x += p[0];
    y += p[1];
  }
  const n = pts.length || 1;
  return [x / n, y / n];
}

function morphPts(pts, fig, rng) {
  const [cx, cy] = centroid(pts);
  const inf = 1 + fig.inflate;
  const rough = fig.roughness * 8;
  return pts.map(([x, y]) => {
    const dx = x - cx;
    const dy = y - cy;
    return [
      cx + dx * inf + (rng() - 0.5) * rough,
      cy + dy * inf + (rng() - 0.5) * rough,
    ];
  });
}

function beginTrace(c) {
  if (typeof c.beginPath === "function") c.beginPath();
}

function trace(c, pts, closed, smoothness) {
  if (!pts.length) return;
  beginTrace(c);
  if (smoothness < 0.08 || pts.length < 3) {
    c.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i += 1) c.lineTo(pts[i][0], pts[i][1]);
    if (closed) c.closePath();
    return;
  }
  if (closed) {
    const n = pts.length;
    c.moveTo((pts[n - 1][0] + pts[0][0]) / 2, (pts[n - 1][1] + pts[0][1]) / 2);
    for (let i = 0; i < n; i += 1) {
      const p = pts[i];
      const n1 = pts[(i + 1) % n];
      const mx = lerp(p[0], (p[0] + n1[0]) / 2, smoothness);
      const my = lerp(p[1], (p[1] + n1[1]) / 2, smoothness);
      c.quadraticCurveTo(p[0], p[1], mx, my);
    }
    c.closePath();
  } else {
    c.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length - 1; i += 1) {
      const p = pts[i];
      const n1 = pts[i + 1];
      c.quadraticCurveTo(p[0], p[1], (p[0] + n1[0]) / 2, (p[1] + n1[1]) / 2);
    }
    const last = pts[pts.length - 1];
    c.lineTo(last[0], last[1]);
  }
}

function buildPath(fig) {
  const motif = motifById(fig.motifId);
  if (!motif) return new Path2D();
  const rng = mulberry32(hashStr(fig.id + fig.motifId) + Math.round(fig.roughness * 20));
  const p = new Path2D();
  const addClosed = (pts) => {
    const m = morphPts(pts, fig, rng);
    const c = new Path2D();
    trace(c, m, true, fig.smoothness);
    p.addPath(c);
  };
  for (const fill of motif.fills || []) addClosed(fill);
  for (const cir of motif.circles || []) {
    const [cx, cy] = morphPts([[cir.x, cir.y]], fig, rng)[0];
    const r = cir.r * (1 + fig.inflate) + (rng() - 0.5) * fig.roughness * 2;
    p.moveTo(cx + r, cy);
    p.arc(cx, cy, Math.max(0.6, r), 0, Math.PI * 2);
  }
  return { path: p, motif, rng };
}

function drawStrokesOfMotif(c, motif, fig, rng) {
  c.save();
  c.strokeStyle = fig.color;
  c.lineWidth = 1.2 * fig.weight;
  c.lineCap = "round";
  c.lineJoin = "round";
  c.globalAlpha *= 0.92;
  for (const stroke of motif.strokes || []) {
    const m = morphPts(stroke, fig, rng);
    trace(c, m, false, fig.smoothness);
    c.stroke();
  }
  c.restore();
}

const hitProbe = document.createElement("canvas").getContext("2d");

function sprayAround(c, path, fig) {
  const rng = mulberry32(hashStr(fig.id + "spray"));
  c.save();
  c.fillStyle = fig.color;
  for (let i = 0; i < 520; i += 1) {
    const x = rng() * 110 - 5;
    const y = rng() * 110 - 5;
    if (hitProbe.isPointInPath(path, x, y)) continue;
    const near = rng() > 0.35;
    if (!near) continue;
    c.globalAlpha = 0.08 + rng() * 0.22;
    const r = 0.6 + rng() * 1.8;
    c.beginPath();
    c.arc(x, y, r, 0, Math.PI * 2);
    c.fill();
  }
  c.restore();
}

function paintFigure(c, fig, selected) {
  const built = buildPath(fig);
  const { path, motif, rng } = built;
  c.save();
  c.translate(fig.nx * cssW, fig.ny * cssH);
  c.rotate(fig.rotation);
  const unit = Math.min(cssW, cssH) * fig.size;
  c.transform(
    unit * fig.stretchX * (fig.flipX ? -1 : 1) / 100,
    0,
    Math.tan(fig.lean) * unit / 100,
    unit * fig.stretchY / 100,
    0,
    0,
  );
  c.translate(-50, -50);

  const wear = 1 - fig.weathering * 0.65;
  c.globalAlpha = fig.opacity * wear * (0.82 + rng() * 0.18 * fig.weathering);
  c.globalCompositeOperation = state.wall === "night" ? "screen" : "multiply";
  if (fig.color.toLowerCase() === "#ede4d0" || fig.color.toLowerCase() === "#ead9c1") {
    c.globalCompositeOperation = "overlay";
  }

  if (fig.style === "stencil") {
    c.globalCompositeOperation = state.wall === "night" ? "screen" : "multiply";
    sprayAround(c, path, fig);
  } else if (fig.style === "petroglyph") {
    c.globalCompositeOperation = "multiply";
    c.strokeStyle = "#1a120c";
    c.lineWidth = 2.2 * fig.weight;
    c.lineJoin = "round";
    c.stroke(path);
    drawStrokesOfMotif(c, motif, fig, rng);
    c.globalCompositeOperation = "overlay";
    c.strokeStyle = "rgba(236, 214, 176, 0.55)";
    c.lineWidth = 0.7 * fig.weight;
    c.translate(-0.6, -0.8);
    c.stroke(path);
  } else if (fig.style === "outline") {
    c.strokeStyle = fig.color;
    c.lineWidth = 1.6 * fig.weight;
    c.lineJoin = "round";
    c.lineCap = "round";
    c.stroke(path);
    drawStrokesOfMotif(c, motif, fig, rng);
  } else {
    c.fillStyle = fig.color;
    c.fill(path, "evenodd");
    if (fig.style !== "silhouette") drawStrokesOfMotif(c, motif, fig, rng);
  }

  c.restore();

  if (selected) {
    c.save();
    c.translate(fig.nx * cssW, fig.ny * cssH);
    const unit = Math.min(cssW, cssH) * fig.size;
    const hw = unit * fig.stretchX * 0.62;
    const hh = unit * fig.stretchY * 0.62;
    c.rotate(fig.rotation);
    c.strokeStyle = "rgba(224, 138, 74, 0.85)";
    c.lineWidth = 1.2 / state.camera.z;
    c.setLineDash([5 / state.camera.z, 4 / state.camera.z]);
    c.strokeRect(-hw, -hh, hw * 2, hh * 2);
    c.restore();
  }
}

function paintFreehand(c, stroke) {
  if (stroke.points.length < 2) return;
  c.save();
  c.globalCompositeOperation = state.wall === "night" ? "screen" : "multiply";
  c.strokeStyle = stroke.color;
  c.globalAlpha = stroke.opacity;
  c.lineWidth = stroke.weight;
  c.lineCap = "round";
  c.lineJoin = "round";
  c.beginPath();
  const pts = stroke.points;
  c.moveTo(pts[0][0] * cssW, pts[0][1] * cssH);
  for (let i = 1; i < pts.length - 1; i += 1) {
    const x = pts[i][0] * cssW;
    const y = pts[i][1] * cssH;
    const nx = pts[i + 1][0] * cssW;
    const ny = pts[i + 1][1] * cssH;
    c.quadraticCurveTo(x, y, (x + nx) / 2, (y + ny) / 2);
  }
  const last = pts[pts.length - 1];
  c.lineTo(last[0] * cssW, last[1] * cssH);
  c.stroke();
  c.restore();
}

function resize() {
  const rect = canvas.getBoundingClientRect();
  cssW = Math.max(1, rect.width);
  cssH = Math.max(1, rect.height);
  dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.floor(cssW * dpr);
  canvas.height = Math.floor(cssH * dpr);
  const key = `${Math.floor(cssW)}x${Math.floor(cssH)}:${state.wall}`;
  if (key !== rockKey) {
    rock = makeRock(canvas.width, canvas.height, state.wall);
    rockKey = key;
  }
  dirty = true;
}

function worldFromEvent(e) {
  const rect = canvas.getBoundingClientRect();
  const sx = e.clientX - rect.left;
  const sy = e.clientY - rect.top;
  const x = (sx - state.camera.x) / state.camera.z;
  const y = (sy - state.camera.y) / state.camera.z;
  return { x, y, nx: x / cssW, ny: y / cssH, sx, sy };
}

function hitFigure(nx, ny) {
  for (let i = state.figures.length - 1; i >= 0; i -= 1) {
    const fig = state.figures[i];
    const unit = Math.min(cssW, cssH) * fig.size;
    const dx = (nx - fig.nx) * cssW;
    const dy = (ny - fig.ny) * cssH;
    const c = Math.cos(-fig.rotation);
    const s = Math.sin(-fig.rotation);
    const lx = (dx * c - dy * s) / (unit * fig.stretchX * 0.7 || 1);
    const ly = (dx * s + dy * c) / (unit * fig.stretchY * 0.7 || 1);
    if (lx * lx + ly * ly < 1) return fig;
  }
  return null;
}

function snapshot() {
  return JSON.stringify({
    figures: state.figures,
    strokes: state.strokes,
    wall: state.wall,
    title: state.title,
    caption: state.caption,
  });
}

function pushUndo() {
  const snap = snapshot();
  if (state.undo[state.undo.length - 1] === snap) return;
  state.undo.push(snap);
  if (state.undo.length > 60) state.undo.shift();
  state.redo.length = 0;
}

function undo() {
  if (!state.undo.length) return;
  state.redo.push(snapshot());
  applySnap(state.undo.pop());
}

function redo() {
  if (!state.redo.length) return;
  state.undo.push(snapshot());
  applySnap(state.redo.pop());
}

function applySnap(raw) {
  if (!raw) return;
  const data = JSON.parse(raw);
  state.figures = data.figures || [];
  state.strokes = data.strokes || [];
  state.wall = data.wall || state.wall;
  state.title = data.title || "";
  state.caption = data.caption || "";
  if (state.selectedId && !state.figures.some((f) => f.id === state.selectedId)) {
    state.selectedId = state.figures.at(-1)?.id || null;
  }
  rockKey = "";
  resize();
  syncInspector();
  renderUiChrome();
  persist();
  dirty = true;
}

function persist() {
  try {
    localStorage.setItem(SAVE_KEY, snapshot());
  } catch {
    /* ignore quota */
  }
}

function defaultFigure(motifId, nx, ny) {
  return {
    id: uid(),
    motifId,
    nx,
    ny,
    size: 0.14,
    stretchX: 1,
    stretchY: 1,
    rotation: 0,
    lean: 0,
    inflate: 0,
    roughness: 0.28,
    smoothness: 0.72,
    weight: 1.4,
    opacity: 0.88,
    weathering: 0.18,
    color: "#9C3B2A",
    style: motifId === "hand" ? "stencil" : "pictograph",
    flipX: false,
    role: "",
  };
}

function addFigure(motifId, nx, ny) {
  pushUndo();
  const fig = defaultFigure(motifId, clamp(nx, 0.04, 0.96), clamp(ny, 0.06, 0.94));
  state.figures.push(fig);
  state.selectedId = fig.id;
  dirty = true;
  syncInspector();
  persist();
}

function selected() {
  return state.figures.find((f) => f.id === state.selectedId) || null;
}

function render() {
  flicker = 0.92 + Math.sin(performance.now() / 180) * 0.04 + Math.sin(performance.now() / 73) * 0.03;
  torchEl.style.opacity = String(state.torch * flicker);
  if (!dirty) {
    requestAnimationFrame(render);
    return;
  }
  dirty = false;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cssW, cssH);
  ctx.save();
  ctx.translate(state.camera.x, state.camera.y);
  ctx.scale(state.camera.z, state.camera.z);
  if (rock) ctx.drawImage(rock, 0, 0, cssW, cssH);
  else {
    ctx.fillStyle = "#c4a574";
    ctx.fillRect(0, 0, cssW, cssH);
  }
  for (const stroke of state.strokes) paintFreehand(ctx, stroke);
  if (paint) paintFreehand(ctx, paint);
  for (const fig of state.figures) paintFigure(ctx, fig, fig.id === state.selectedId);
  ctx.restore();
  requestAnimationFrame(render);
}

function markDirty() {
  dirty = true;
}

function bindRange(id, apply, scale = (v) => Number(v)) {
  const el = document.getElementById(id);
  const out = el.parentElement.querySelector("output");
  const onInput = () => {
    const fig = selected();
    if (!fig) return;
    apply(fig, scale(el.value));
    if (out) out.textContent = el.value;
    markDirty();
  };
  el.addEventListener("pointerdown", () => pushUndo());
  el.addEventListener("input", onInput);
  el.addEventListener("change", persist);
  return el;
}

function fillCats() {
  const root = document.getElementById("cats");
  root.innerHTML = "";
  for (const cat of CATEGORIES) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = cat.name;
    b.className = cat.id === state.category ? "active" : "";
    b.addEventListener("click", () => {
      state.category = cat.id;
      fillCats();
      fillMotifs();
    });
    root.appendChild(b);
  }
}

function drawThumb(c, motif) {
  const w = c.width;
  const h = c.height;
  const tctx = c.getContext("2d");
  tctx.fillStyle = "#cbb08a";
  tctx.fillRect(0, 0, w, h);
  tctx.save();
  tctx.translate(w / 2, h / 2);
  const s = Math.min(w, h) * 0.82 / 100;
  tctx.scale(s, s);
  tctx.translate(-50, -50);
  tctx.fillStyle = "#8a3a22";
  tctx.strokeStyle = "#8a3a22";
  tctx.lineWidth = 1.8;
  tctx.lineJoin = "round";
  tctx.lineCap = "round";
  const dummy = { inflate: 0, roughness: 0.12, smoothness: 0.7, weight: 1, id: motif.id };
  const rng = mulberry32(hashStr(motif.id));
  for (const fill of motif.fills || []) {
    trace(tctx, morphPts(fill, dummy, rng), true, 0.7);
    tctx.fill();
  }
  for (const cir of motif.circles || []) {
    tctx.beginPath();
    tctx.arc(cir.x, cir.y, cir.r, 0, Math.PI * 2);
    tctx.fill();
  }
  for (const stroke of motif.strokes || []) {
    trace(tctx, morphPts(stroke, dummy, rng), false, 0.7);
    tctx.stroke();
  }
  tctx.restore();
}

function fillMotifs() {
  const root = document.getElementById("motif-grid");
  root.innerHTML = "";
  const list = MOTIFS.filter((m) => state.category === "all" || m.category === state.category);
  for (const motif of list) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "motif-card" + (state.activeMotif === motif.id ? " active" : "");
    card.draggable = true;
    const cv = document.createElement("canvas");
    cv.width = 160;
    cv.height = 110;
    drawThumb(cv, motif);
    const name = document.createElement("b");
    name.textContent = motif.name;
    card.append(cv, name);
    card.addEventListener("click", () => {
      state.activeMotif = motif.id;
      state.tool = "stamp";
      fillMotifs();
      renderUiChrome();
    });
    card.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/motif", motif.id);
      e.dataTransfer.effectAllowed = "copy";
      state.activeMotif = motif.id;
    });
    root.appendChild(card);
  }
}

function fillSwatches() {
  const root = document.getElementById("swatches");
  root.innerHTML = "";
  for (const p of PIGMENTS) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "swatch";
    b.title = p.name;
    b.style.background = p.color;
    b.addEventListener("click", () => {
      const fig = selected();
      if (!fig) return;
      pushUndo();
      fig.color = p.color;
      document.getElementById("color").value = p.color;
      syncSwatch();
      markDirty();
      persist();
    });
    root.appendChild(b);
  }
}

function syncSwatch() {
  const fig = selected();
  const buttons = document.querySelectorAll("#swatches .swatch");
  buttons.forEach((b, i) => {
    b.classList.toggle("active", fig && PIGMENTS[i].color.toLowerCase() === fig.color.toLowerCase());
  });
}

function fillSeg(rootId, items, current, onPick) {
  const root = document.getElementById(rootId);
  root.innerHTML = "";
  for (const item of items) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = item.name;
    b.className = item.id === current ? "active" : "";
    b.addEventListener("click", () => onPick(item.id));
    root.appendChild(b);
  }
}

function setRange(id, value) {
  const el = document.getElementById(id);
  el.value = String(value);
  const out = el.parentElement.querySelector("output");
  if (out) out.textContent = el.value;
}

function setWall(id) {
  if (id === state.wall) return;
  pushUndo();
  state.wall = id;
  rockKey = "";
  resize();
  persist();
  syncInspector();
}

function syncInspector() {
  const fig = selected();
  document.getElementById("fig-controls").hidden = !fig;
  document.getElementById("empty-hint").hidden = !!fig;
  document.getElementById("title").value = state.title;
  fillSeg("wall-seg", WALLS, state.wall, setWall);
  if (!fig) return;
  document.getElementById("color").value = fig.color;
  setRange("opacity", Math.round(fig.opacity * 100));
  setRange("weathering", Math.round(fig.weathering * 100));
  setRange("size", Math.round(fig.size * 100));
  setRange("stretchX", Math.round(fig.stretchX * 100));
  setRange("stretchY", Math.round(fig.stretchY * 100));
  setRange("rotation", Math.round((fig.rotation * 180) / Math.PI));
  setRange("lean", Math.round((fig.lean * 180) / Math.PI));
  setRange("inflate", Math.round(fig.inflate * 100));
  setRange("roughness", Math.round(fig.roughness * 100));
  setRange("smoothness", Math.round(fig.smoothness * 100));
  setRange("weight", Math.round(fig.weight * 10));
  document.getElementById("role").value = fig.role;
  fillSeg("style-seg", STYLES, fig.style, (id) => {
    pushUndo();
    fig.style = id;
    syncInspector();
    markDirty();
    persist();
  });
  syncSwatch();
}

function renderUiChrome() {
  document.getElementById("hud-count").textContent = `${state.figures.length} 个图符`;
  document.getElementById("hud-zoom").textContent = `${Math.round(state.camera.z * 100)}%`;
  const toolName = { select: "选择", stamp: "放置", paint: "涂绘" }[state.tool];
  document.getElementById("hud-tool").textContent = toolName;
  document.getElementById("tool-select").classList.toggle("active", state.tool === "select");
  document.getElementById("tool-stamp").classList.toggle("active", state.tool === "stamp");
  document.getElementById("tool-paint").classList.toggle("active", state.tool === "paint");
  document.getElementById("caption").textContent = state.title || state.caption || "";
  document.getElementById("torch").style.setProperty("--tx", "50%");
  const narr = document.getElementById("narr-btns");
  [...narr.querySelectorAll(".narr-btn")].forEach((b) => {
    b.classList.toggle("active", b.dataset.id && state.caption && NARRATIVES.find((n) => n.id === b.dataset.id)?.caption === state.caption);
  });
}

function applyNarrative(nar, randomize = false) {
  pushUndo();
  state.wall = nar.wall;
  state.title = nar.title;
  state.caption = nar.caption;
  state.figures = nar.figures.map((src) => {
    const fig = defaultFigure(src.motifId, src.nx, src.ny);
    Object.assign(fig, src, { id: uid() });
    if (randomize) {
      fig.color = PIGMENTS[Math.floor(Math.random() * PIGMENTS.length)].color;
      fig.roughness = 0.12 + Math.random() * 0.5;
      fig.inflate = (Math.random() - 0.4) * 0.28;
      fig.stretchX = 0.85 + Math.random() * 0.4;
      fig.stretchY = 0.85 + Math.random() * 0.35;
      fig.rotation += (Math.random() - 0.5) * 0.35;
      fig.weathering = Math.random() * 0.45;
      fig.nx += (Math.random() - 0.5) * 0.06;
      fig.ny += (Math.random() - 0.5) * 0.05;
    }
    return fig;
  });
  state.strokes = [];
  state.selectedId = state.figures[0]?.id || null;
  rockKey = "";
  resize();
  syncInspector();
  renderUiChrome();
  persist();
  markDirty();
}

function fillNarratives() {
  const root = document.getElementById("narr-btns");
  root.innerHTML = "";
  for (const nar of NARRATIVES) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "narr-btn";
    b.dataset.id = nar.id;
    b.innerHTML = `<b>${nar.name}</b><span>${nar.caption.slice(0, 18)}…</span>`;
    b.addEventListener("click", () => applyNarrative(nar, false));
    root.appendChild(b);
  }
}

function exportPng() {
  const prev = state.selectedId;
  state.selectedId = null;
  dirty = true;
  const rect = canvas.getBoundingClientRect();
  const out = document.createElement("canvas");
  out.width = Math.floor(rect.width * 2);
  out.height = Math.floor(rect.height * 2);
  const o = out.getContext("2d");
  const savedCam = { ...state.camera };
  state.camera = { x: 0, y: 0, z: 1 };
  const oldDpr = dpr;
  const oldW = cssW;
  const oldH = cssH;
  cssW = rect.width;
  cssH = rect.height;
  dpr = 2;
  const key = rockKey;
  rock = makeRock(out.width, out.height, state.wall);
  o.setTransform(2, 0, 0, 2, 0, 0);
  o.drawImage(rock, 0, 0, cssW, cssH);
  for (const stroke of state.strokes) {
    const bak = ctx;
    paintFreehand(o, stroke);
    void bak;
  }
  for (const fig of state.figures) paintFigure(o, fig, false);
  if (state.title) {
    o.save();
    o.setTransform(2, 0, 0, 2, 0, 0);
    o.font = "16px serif";
    o.fillStyle = "rgba(234,217,193,0.9)";
    o.textAlign = "center";
    o.fillText(state.title, cssW / 2, cssH - 28);
    o.restore();
  }
  out.toBlob((blob) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `岩壁叙事-${state.title || "untitled"}.png`;
    a.click();
    URL.revokeObjectURL(a.href);
  });
  state.selectedId = prev;
  state.camera = savedCam;
  dpr = oldDpr;
  cssW = oldW;
  cssH = oldH;
  rockKey = "";
  rock = makeRock(canvas.width, canvas.height, state.wall);
  rockKey = key || `${Math.floor(cssW)}x${Math.floor(cssH)}:${state.wall}`;
  markDirty();
}

function onPointerDown(e) {
  if (e.button !== 0) return;
  canvas.setPointerCapture(e.pointerId);
  const p = worldFromEvent(e);
  if (state.tool === "paint" || e.shiftKey && state.tool === "select") {
    pushUndo();
    const fig = selected();
    paint = {
      points: [[p.nx, p.ny]],
      color: fig?.color || "#9C3B2A",
      opacity: 0.75,
      weight: 3.2,
    };
    drag = { type: "paint" };
    markDirty();
    return;
  }
  if (e.spaceHeld || state.tool === "select" && !hitFigure(p.nx, p.ny) && !document.body.dataset.space) {
    /* fall through */
  }
  if (document.body.dataset.space === "1") {
    drag = { type: "pan", x: e.clientX, y: e.clientY, cx: state.camera.x, cy: state.camera.y };
    canvas.classList.add("moving");
    return;
  }
  const hit = hitFigure(p.nx, p.ny);
  if (hit && state.tool !== "stamp") {
    state.selectedId = hit.id;
    drag = { type: "fig", id: hit.id, dx: p.nx - hit.nx, dy: p.ny - hit.ny };
    pushUndo();
    syncInspector();
    renderUiChrome();
    markDirty();
    return;
  }
  if (state.tool === "stamp" || (!hit && state.tool === "select" && state.activeMotif && e.altKey)) {
    addFigure(state.activeMotif, p.nx, p.ny);
    renderUiChrome();
    return;
  }
  if (state.tool === "stamp") {
    addFigure(state.activeMotif, p.nx, p.ny);
    renderUiChrome();
    return;
  }
  if (!hit) {
    state.selectedId = null;
    drag = { type: "pan", x: e.clientX, y: e.clientY, cx: state.camera.x, cy: state.camera.y };
    canvas.classList.add("moving");
    syncInspector();
    markDirty();
  }
}

function onPointerMove(e) {
  const rect = canvas.getBoundingClientRect();
  const tx = ((e.clientX - rect.left) / rect.width) * 100;
  const ty = ((e.clientY - rect.top) / rect.height) * 100;
  torchEl.style.setProperty("--tx", `${tx}%`);
  torchEl.style.setProperty("--ty", `${ty}%`);
  if (!drag) return;
  if (drag.type === "pan") {
    state.camera.x = drag.cx + (e.clientX - drag.x);
    state.camera.y = drag.cy + (e.clientY - drag.y);
    markDirty();
    return;
  }
  const p = worldFromEvent(e);
  if (drag.type === "paint" && paint) {
    paint.points.push([p.nx, p.ny]);
    markDirty();
    return;
  }
  if (drag.type === "fig") {
    const fig = state.figures.find((f) => f.id === drag.id);
    if (!fig) return;
    fig.nx = clamp(p.nx - drag.dx, 0.02, 0.98);
    fig.ny = clamp(p.ny - drag.dy, 0.04, 0.96);
    markDirty();
  }
}

function onPointerUp() {
  if (drag?.type === "paint" && paint) {
    state.strokes.push(paint);
    paint = null;
    persist();
  }
  if (drag?.type === "fig") persist();
  drag = null;
  canvas.classList.remove("moving");
}

function onWheel(e) {
  e.preventDefault();
  const fig = selected();
  if (fig && e.altKey) {
    fig.size = clamp(fig.size * (e.deltaY < 0 ? 1.06 : 0.94), 0.04, 0.42);
    setRange("size", Math.round(fig.size * 100));
    markDirty();
    return;
  }
  const p = worldFromEvent(e);
  const old = state.camera.z;
  const next = clamp(old * (e.deltaY < 0 ? 1.08 : 0.92), 0.45, 3.2);
  const sx = p.sx;
  const sy = p.sy;
  state.camera.x = sx - (sx - state.camera.x) * (next / old);
  state.camera.y = sy - (sy - state.camera.y) * (next / old);
  state.camera.z = next;
  renderUiChrome();
  markDirty();
}

function duplicateSelected() {
  const fig = selected();
  if (!fig) return;
  pushUndo();
  const copy = { ...fig, id: uid(), nx: clamp(fig.nx + 0.04, 0, 1), ny: clamp(fig.ny + 0.03, 0, 1) };
  state.figures.push(copy);
  state.selectedId = copy.id;
  syncInspector();
  renderUiChrome();
  persist();
  markDirty();
}

function deleteSelected() {
  const fig = selected();
  if (!fig) return;
  pushUndo();
  state.figures = state.figures.filter((f) => f.id !== fig.id);
  state.selectedId = state.figures.at(-1)?.id || null;
  syncInspector();
  renderUiChrome();
  persist();
  markDirty();
}

function bindUi() {
  fillCats();
  fillMotifs();
  fillSwatches();
  fillNarratives();
  fillSeg("wall-seg", WALLS, state.wall, setWall);

  bindRange("opacity", (f, v) => { f.opacity = v / 100; });
  bindRange("weathering", (f, v) => { f.weathering = v / 100; });
  bindRange("size", (f, v) => { f.size = v / 100; });
  bindRange("stretchX", (f, v) => { f.stretchX = v / 100; });
  bindRange("stretchY", (f, v) => { f.stretchY = v / 100; });
  bindRange("rotation", (f, v) => { f.rotation = (v * Math.PI) / 180; });
  bindRange("lean", (f, v) => { f.lean = (v * Math.PI) / 180; });
  bindRange("inflate", (f, v) => { f.inflate = v / 100; });
  bindRange("roughness", (f, v) => { f.roughness = v / 100; });
  bindRange("smoothness", (f, v) => { f.smoothness = v / 100; });
  bindRange("weight", (f, v) => { f.weight = v / 10; });

  document.getElementById("color").addEventListener("input", (e) => {
    const fig = selected();
    if (!fig) return;
    fig.color = e.target.value;
    syncSwatch();
    markDirty();
  });
  document.getElementById("color").addEventListener("change", persist);
  document.getElementById("role").addEventListener("change", (e) => {
    const fig = selected();
    if (!fig) return;
    pushUndo();
    fig.role = e.target.value.trim();
    persist();
  });
  document.getElementById("title").addEventListener("input", (e) => {
    state.title = e.target.value;
    renderUiChrome();
  });
  document.getElementById("title").addEventListener("change", persist);

  document.getElementById("torch-level").addEventListener("input", (e) => {
    state.torch = Number(e.target.value) / 100;
    document.getElementById("torch-level-out").textContent = e.target.value;
  });

  document.getElementById("btn-flip").addEventListener("click", () => {
    const fig = selected();
    if (!fig) return;
    pushUndo();
    fig.flipX = !fig.flipX;
    persist();
    markDirty();
  });
  document.getElementById("btn-dup").addEventListener("click", duplicateSelected);
  document.getElementById("btn-del").addEventListener("click", deleteSelected);
  document.getElementById("btn-front").addEventListener("click", () => {
    const i = state.figures.findIndex((f) => f.id === state.selectedId);
    if (i < 0 || i === state.figures.length - 1) return;
    pushUndo();
    const [fig] = state.figures.splice(i, 1);
    state.figures.splice(i + 1, 0, fig);
    persist();
    markDirty();
  });
  document.getElementById("btn-back").addEventListener("click", () => {
    const i = state.figures.findIndex((f) => f.id === state.selectedId);
    if (i <= 0) return;
    pushUndo();
    const [fig] = state.figures.splice(i, 1);
    state.figures.splice(i - 1, 0, fig);
    persist();
    markDirty();
  });

  document.getElementById("tool-select").addEventListener("click", () => {
    state.tool = "select";
    renderUiChrome();
  });
  document.getElementById("tool-stamp").addEventListener("click", () => {
    state.tool = "stamp";
    renderUiChrome();
  });
  document.getElementById("tool-paint").addEventListener("click", () => {
    state.tool = "paint";
    renderUiChrome();
  });

  document.getElementById("btn-undo").addEventListener("click", undo);
  document.getElementById("btn-redo").addEventListener("click", redo);
  document.getElementById("btn-export").addEventListener("click", exportPng);
  document.getElementById("btn-help").addEventListener("click", () => {
    document.getElementById("help").hidden = false;
  });
  document.getElementById("btn-help-close").addEventListener("click", () => {
    document.getElementById("help").hidden = true;
  });
  document.getElementById("btn-random").addEventListener("click", () => {
    const nar = NARRATIVES[Math.floor(Math.random() * NARRATIVES.length)];
    applyNarrative(nar, true);
  });
  document.getElementById("btn-clear").addEventListener("click", () => {
    pushUndo();
    state.figures = [];
    state.strokes = [];
    state.selectedId = null;
    state.title = "";
    state.caption = "";
    syncInspector();
    renderUiChrome();
    persist();
    markDirty();
  });

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerUp);
  canvas.addEventListener("wheel", onWheel, { passive: false });
  canvas.addEventListener("dragover", (e) => e.preventDefault());
  canvas.addEventListener("drop", (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/motif");
    if (!id) return;
    const p = worldFromEvent(e);
    state.activeMotif = id;
    addFigure(id, p.nx, p.ny);
    renderUiChrome();
  });

  window.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !e.target.matches("input, textarea")) {
      e.preventDefault();
      document.body.dataset.space = "1";
    }
    if (e.target.matches("input, textarea")) return;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
      e.preventDefault();
      document.getElementById("btn-undo").click();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") {
      e.preventDefault();
      duplicateSelected();
    } else if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      deleteSelected();
    } else if (e.key.toLowerCase() === "f") {
      document.getElementById("btn-flip").click();
    } else if (e.key === "v") {
      state.tool = "select";
      renderUiChrome();
    } else if (e.key === "b") {
      state.tool = "paint";
      renderUiChrome();
    } else if (e.key === "s" && !e.ctrlKey) {
      state.tool = "stamp";
      renderUiChrome();
    }
  });
  window.addEventListener("keyup", (e) => {
    if (e.code === "Space") document.body.dataset.space = "0";
  });
}

function boot() {
  bindUi();
  window.addEventListener("resize", resize);
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) applySnap(saved);
  } catch {
    /* ignore */
  }
  if (!state.figures.length && !state.strokes.length) {
    applyNarrative(NARRATIVES[0], false);
    state.undo.length = 0;
    state.redo.length = 0;
  }
  resize();
  syncInspector();
  renderUiChrome();
  const firstVisit = !localStorage.getItem(`${SAVE_KEY}:seen`);
  if (firstVisit) {
    document.getElementById("help").hidden = false;
    localStorage.setItem(`${SAVE_KEY}:seen`, "1");
  }
  requestAnimationFrame(render);
}

boot();
