const canvas = document.getElementById("field");
const ctx = canvas.getContext("2d");

const controls = {
  layout: document.getElementById("layout"),
  count: document.getElementById("count"),
  width: document.getElementById("width"),
  height: document.getElementById("height"),
  offsetX: document.getElementById("offsetX"),
  offsetY: document.getElementById("offsetY"),
  rotation: document.getElementById("rotation"),
  radius: document.getElementById("radius"),
  colorA: document.getElementById("colorA"),
  colorB: document.getElementById("colorB"),
  colorC: document.getElementById("colorC"),
  spread: document.getElementById("spread"),
  saturation: document.getElementById("saturation"),
  lightness: document.getElementById("lightness"),
  bg: document.getElementById("bg"),
  opacity: document.getElementById("opacity"),
  fade: document.getElementById("fade"),
  blend: document.getElementById("blend"),
  gradient: document.getElementById("gradient"),
  angle: document.getElementById("angle"),
  gradientType: document.getElementById("gradientType"),
  feather: document.getElementById("feather"),
  shadow: document.getElementById("shadow"),
  grain: document.getElementById("grain"),
  stroke: document.getElementById("stroke"),
};

const labels = {
  count: document.getElementById("countVal"),
  width: document.getElementById("widthVal"),
  height: document.getElementById("heightVal"),
  offsetX: document.getElementById("offsetXVal"),
  offsetY: document.getElementById("offsetYVal"),
  rotation: document.getElementById("rotationVal"),
  radius: document.getElementById("radiusVal"),
  spread: document.getElementById("spreadVal"),
  saturation: document.getElementById("saturationVal"),
  lightness: document.getElementById("lightnessVal"),
  opacity: document.getElementById("opacityVal"),
  fade: document.getElementById("fadeVal"),
  gradient: document.getElementById("gradientVal"),
  angle: document.getElementById("angleVal"),
  feather: document.getElementById("featherVal"),
  shadow: document.getElementById("shadowVal"),
  grain: document.getElementById("grainVal"),
  stroke: document.getElementById("strokeVal"),
};

const defaults = Object.fromEntries(
  Object.entries(controls).map(([key, el]) => [key, el.value])
);

let seed = 8105;

function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hexToRgb(hex) {
  const n = hex.replace("#", "");
  const v = parseInt(n, 16);
  return { r: (v >> 16) & 255, g: (v >> 8) & 255, b: v & 255 };
}

function rgbToHsl({ r, g, b }) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  const d = max - min;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case r:
        h = ((g - b) / d) % 6;
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s, l };
}

function hslToRgb(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

function mixHsl(a, b, t) {
  let dh = b.h - a.h;
  if (dh > 180) dh -= 360;
  if (dh < -180) dh += 360;
  return {
    h: (a.h + dh * t + 360) % 360,
    s: a.s + (b.s - a.s) * t,
    l: a.l + (b.l - a.l) * t,
  };
}

function rgba({ r, g, b }, a) {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function roundRect(context, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + w, y, x + w, y + h, radius);
  context.arcTo(x + w, y + h, x, y + h, radius);
  context.arcTo(x, y + h, x, y, radius);
  context.arcTo(x, y, x + w, y, radius);
  context.closePath();
}

function state() {
  return {
    layout: controls.layout.value,
    count: Number(controls.count.value),
    width: Number(controls.width.value) / 100,
    height: Number(controls.height.value) / 100,
    offsetX: Number(controls.offsetX.value),
    offsetY: Number(controls.offsetY.value),
    rotation: Number(controls.rotation.value),
    radius: Number(controls.radius.value),
    colorA: controls.colorA.value,
    colorB: controls.colorB.value,
    colorC: controls.colorC.value,
    spread: Number(controls.spread.value) / 100,
    saturation: Number(controls.saturation.value) / 100,
    lightness: Number(controls.lightness.value) / 100,
    bg: controls.bg.value,
    opacity: Number(controls.opacity.value) / 100,
    fade: Number(controls.fade.value) / 100,
    blend: controls.blend.value,
    gradient: Number(controls.gradient.value) / 100,
    angle: Number(controls.angle.value),
    gradientType: controls.gradientType.value,
    feather: Number(controls.feather.value),
    shadow: Number(controls.shadow.value),
    grain: Number(controls.grain.value) / 100,
    stroke: Number(controls.stroke.value),
  };
}

function updateLabels() {
  const s = state();
  labels.count.textContent = String(s.count);
  labels.width.textContent = `${Math.round(s.width * 100)}%`;
  labels.height.textContent = `${Math.round(s.height * 100)}%`;
  labels.offsetX.textContent = String(controls.offsetX.value);
  labels.offsetY.textContent = String(controls.offsetY.value);
  labels.rotation.textContent = `${s.rotation}°`;
  labels.radius.textContent = String(s.radius);
  labels.spread.textContent = String(controls.spread.value);
  labels.saturation.textContent = `${controls.saturation.value}%`;
  labels.lightness.textContent = `${controls.lightness.value}%`;
  labels.opacity.textContent = `${controls.opacity.value}%`;
  labels.fade.textContent = `${controls.fade.value}%`;
  labels.gradient.textContent = `${controls.gradient.value}%`;
  labels.angle.textContent = `${s.angle}°`;
  labels.feather.textContent = String(s.feather);
  labels.shadow.textContent = String(s.shadow);
  labels.grain.textContent = `${controls.grain.value}%`;
  labels.stroke.textContent = Number(controls.stroke.value).toFixed(1);
}

function paletteColors(s) {
  const a = rgbToHsl(hexToRgb(s.colorA));
  const b = rgbToHsl(hexToRgb(s.colorB));
  const c = rgbToHsl(hexToRgb(s.colorC));
  return [a, b, c].map((color) => ({
    h: color.h,
    s: color.s * 0.35 + s.saturation * 0.65,
    l: color.l * 0.35 + s.lightness * 0.65,
  }));
}

function colorAt(palette, t, jitter) {
  const scaled = t * (palette.length - 1);
  const i = Math.floor(scaled);
  const f = scaled - i;
  const base = mixHsl(palette[i], palette[Math.min(i + 1, palette.length - 1)], f);
  return {
    h: (base.h + jitter * 48 + 360) % 360,
    s: Math.min(1, Math.max(0, base.s + jitter * 0.08)),
    l: Math.min(0.9, Math.max(0.08, base.l + jitter * 0.06)),
  };
}

function layoutRects(s, rand) {
  const { width: W, height: H } = canvas;
  const n = s.count;
  const w = W * s.width;
  const h = H * s.height;
  const rects = [];

  if (s.layout === "grid") {
    const cols = Math.ceil(Math.sqrt(n * (W / H)));
    const rows = Math.ceil(n / cols);
    const gapX = (W - w) / Math.max(1, cols - 1);
    const gapY = (H - h) / Math.max(1, rows - 1);
    for (let i = 0; i < n; i += 1) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const stagger = (row % 2) * (s.offsetX * 1.8);
      rects.push({
        x: col * gapX + stagger - w * 0.08,
        y: row * gapY - h * 0.08,
        w,
        h,
        rot: s.rotation + (rand() - 0.5) * 4,
      });
    }
  } else if (s.layout === "fan") {
    const cx = W * 0.5;
    const cy = H * 0.58;
    for (let i = 0; i < n; i += 1) {
      const t = n === 1 ? 0.5 : i / (n - 1);
      const rot = s.rotation + (t - 0.5) * (s.offsetX * 1.6);
      rects.push({
        x: cx - w / 2 + (t - 0.5) * s.offsetX * 4,
        y: cy - h / 2 - t * s.offsetY * 3.2,
        w,
        h,
        rot,
      });
    }
  } else if (s.layout === "ribbon") {
    const rows = Math.max(3, Math.round(Math.sqrt(n)));
    const cols = Math.ceil(n / rows);
    for (let i = 0; i < n; i += 1) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const t = col / Math.max(1, cols - 1);
      rects.push({
        x: t * (W - w) + (row % 2 ? s.offsetX : -s.offsetX) * 0.8,
        y: (row / Math.max(1, rows - 1)) * (H - h),
        w: w * (0.78 + rand() * 0.28),
        h: h * 0.72,
        rot: s.rotation * 0.25 + (row % 2 ? 1.4 : -1.4),
      });
    }
  } else {
    const startX = W * 0.12;
    const startY = H * 0.1;
    for (let i = 0; i < n; i += 1) {
      const t = i / Math.max(1, n - 1);
      rects.push({
        x: startX + i * (s.offsetX * 2.2) + Math.sin(t * 6) * 8,
        y: startY + i * (s.offsetY * 2.05) + Math.cos(t * 5) * 6,
        w: w * (0.92 + rand() * 0.12),
        h: h * (0.88 + rand() * 0.16),
        rot: s.rotation + (t - 0.5) * 8,
      });
    }
  }

  return rects;
}

function makeFill(rect, c1, c2, s) {
  const rad = (s.angle * Math.PI) / 180;
  if (s.gradientType === "radial") {
    const g = ctx.createRadialGradient(
      rect.x + rect.w * 0.35,
      rect.y + rect.h * 0.3,
      8,
      rect.x + rect.w / 2,
      rect.y + rect.h / 2,
      Math.max(rect.w, rect.h)
    );
    g.addColorStop(0, rgba(c1, 1));
    g.addColorStop(1, rgba(c2, 1));
    return g;
  }
  const cx = rect.x + rect.w / 2;
  const cy = rect.y + rect.h / 2;
  const len = Math.hypot(rect.w, rect.h) / 2;
  const x1 = cx - Math.cos(rad) * len;
  const y1 = cy - Math.sin(rad) * len;
  const x2 = cx + Math.cos(rad) * len;
  const y2 = cy + Math.sin(rad) * len;
  const g = ctx.createLinearGradient(x1, y1, x2, y2);
  g.addColorStop(0, rgba(c1, 1));
  g.addColorStop(1, rgba(c2, 1));
  return g;
}

function drawGrain(s) {
  if (s.grain <= 0) return;
  const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = image.data;
  const amount = s.grain * 46;
  for (let i = 0; i < data.length; i += 16) {
    const n = (Math.random() - 0.5) * amount;
    data[i] = Math.max(0, Math.min(255, data[i] + n));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + n));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + n));
  }
  ctx.putImageData(image, 0, 0);
}

function render() {
  const s = state();
  const rand = mulberry32(seed);
  const palette = paletteColors(s);
  const rects = layoutRects(s, rand);

  ctx.globalCompositeOperation = "source-over";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = s.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.globalCompositeOperation = s.blend;

  rects.forEach((rect, i) => {
    const t = rects.length === 1 ? 0.5 : i / (rects.length - 1);
    const jitter = (rand() - 0.5) * s.spread;
    const cA = colorAt(palette, t, jitter);
    const cB = colorAt(palette, Math.min(1, t + 0.28), jitter * -0.6);
    const rgbA = hslToRgb(cA.h, cA.s, cA.l);
    const rgbB = hslToRgb(cB.h, cB.s, cB.l);
    const mixed = {
      r: Math.round(rgbA.r * (1 - s.gradient) + rgbB.r * s.gradient),
      g: Math.round(rgbA.g * (1 - s.gradient) + rgbB.g * s.gradient),
      b: Math.round(rgbA.b * (1 - s.gradient) + rgbB.b * s.gradient),
    };
    const alpha = Math.max(0.08, s.opacity * (1 - t * s.fade));

    ctx.save();
    ctx.translate(rect.x + rect.w / 2, rect.y + rect.h / 2);
    ctx.rotate((rect.rot * Math.PI) / 180);
    ctx.translate(-(rect.x + rect.w / 2), -(rect.y + rect.h / 2));

    if (s.shadow > 0) {
      ctx.shadowColor = "rgba(0,0,0,0.38)";
      ctx.shadowBlur = s.shadow * 1.4;
      ctx.shadowOffsetX = s.shadow * 0.35;
      ctx.shadowOffsetY = s.shadow * 0.55;
    }

    roundRect(ctx, rect.x, rect.y, rect.w, rect.h, s.radius);
    if (s.gradient > 0.02) {
      ctx.fillStyle = makeFill(rect, rgbA, mixed, s);
    } else {
      ctx.fillStyle = rgba(rgbA, 1);
    }
    ctx.globalAlpha = alpha;
    ctx.fill();

    if (s.feather > 0) {
      ctx.shadowColor = "transparent";
      const inset = s.feather;
      roundRect(
        ctx,
        rect.x + inset,
        rect.y + inset,
        Math.max(4, rect.w - inset * 2),
        Math.max(4, rect.h - inset * 2),
        Math.max(0, s.radius - inset / 2)
      );
      ctx.globalAlpha = alpha * 0.18;
      ctx.fillStyle = rgba({ r: 255, g: 255, b: 255 }, 0.35);
      ctx.fill();
    }

    if (s.stroke > 0) {
      ctx.shadowColor = "transparent";
      ctx.globalAlpha = Math.min(0.9, alpha + 0.15);
      ctx.lineWidth = s.stroke;
      ctx.strokeStyle = "rgba(255,255,255,0.28)";
      roundRect(ctx, rect.x, rect.y, rect.w, rect.h, s.radius);
      ctx.stroke();
    }

    ctx.restore();
  });

  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  drawGrain(s);
}

function bind() {
  Object.values(controls).forEach((el) => {
    el.addEventListener("input", () => {
      updateLabels();
      render();
    });
    el.addEventListener("change", () => {
      updateLabels();
      render();
    });
  });

  document.getElementById("shuffleBtn").addEventListener("click", () => {
    seed = Math.floor(Math.random() * 99999);
    render();
  });

  document.getElementById("resetBtn").addEventListener("click", () => {
    Object.entries(defaults).forEach(([key, value]) => {
      controls[key].value = value;
    });
    seed = 8105;
    updateLabels();
    render();
  });

  document.getElementById("exportBtn").addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = `composition-${seed}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
}

updateLabels();
bind();
render();
