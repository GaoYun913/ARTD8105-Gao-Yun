const controls = {
  cloudStyle: document.getElementById("cloudStyle"),
  cloudPuff: document.getElementById("cloudPuff"),
  cloudStretch: document.getElementById("cloudStretch"),
  cloudNoise: document.getElementById("cloudNoise"),
  catSize: document.getElementById("catSize"),
  waveWidth: document.getElementById("waveWidth"),
  waveLength: document.getElementById("waveLength"),
  waveColor: document.getElementById("waveColor"),
};

const labels = {
  cloudPuff: document.getElementById("cloudPuffVal"),
  cloudStretch: document.getElementById("cloudStretchVal"),
  cloudNoise: document.getElementById("cloudNoiseVal"),
  catSize: document.getElementById("catSizeVal"),
  waveWidth: document.getElementById("waveWidthVal"),
  waveLength: document.getElementById("waveLengthVal"),
};

const cloudsLayer = document.getElementById("clouds");
const wavesLayer = document.getElementById("waves");
const catScale = document.getElementById("catScale");
const catSway = document.getElementById("catSway");
const tail = document.getElementById("tail");
const body = document.getElementById("body");
const hindLegs = document.getElementById("hindLegs");
const foreLegs = document.getElementById("foreLegs");

const cloudSlots = [
  { x: 170, y: 128, s: 1.05 },
  { x: 760, y: 150, s: 0.92 },
  { x: 250, y: 330, s: 0.78 },
];

function hash(n) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function cloudPath(style, puff, stretch, noise, seed) {
  const lobes =
    style === "scallop" ? 8 : style === "wispy" ? 5 : style === "long" ? 6 : 7;
  const baseR = 34 * puff;
  const points = [];

  for (let i = 0; i < lobes; i += 1) {
    const t = (i / lobes) * Math.PI * 2;
    const wobble = 1 + (hash(seed + i) - 0.5) * noise * 0.9;
    let rx = baseR * (style === "long" ? 1.35 : style === "wispy" ? 1.2 : 1) * stretch;
    let ry = baseR * (style === "long" ? 0.62 : style === "wispy" ? 0.48 : 0.92);
    if (style === "scallop") {
      rx *= 0.78 + 0.22 * Math.cos(t * 2);
      ry *= 0.86;
    }
    const cx = Math.cos(t) * rx * 0.72 * wobble;
    const cy = Math.sin(t) * ry * 0.55 * wobble - (style === "wispy" ? 4 : 8);
    const r = baseR * (0.55 + hash(seed + i * 3) * 0.45) * (style === "wispy" ? 0.7 : 1);
    points.push({ cx, cy, r });
  }

  const samples = 72;
  const outline = [];
  for (let i = 0; i <= samples; i += 1) {
    const a = (i / samples) * Math.PI * 2;
    let maxX = 0;
    let maxY = 0;
    let maxD = -Infinity;
    points.forEach((p) => {
      const x = p.cx + Math.cos(a) * p.r;
      const y = p.cy + Math.sin(a) * p.r * (style === "wispy" ? 0.55 : 0.9);
      const d = Math.hypot(x, y);
      if (d > maxD) {
        maxD = d;
        maxX = x;
        maxY = y;
      }
    });
    outline.push([maxX, maxY]);
  }

  return outline
    .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ") + " Z";
}

function drawClouds() {
  const style = controls.cloudStyle.value;
  const puff = Number(controls.cloudPuff.value);
  const stretch = Number(controls.cloudStretch.value);
  const noise = Number(controls.cloudNoise.value);

  cloudsLayer.replaceChildren(
    ...cloudSlots.map((slot, index) => {
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("transform", `translate(${slot.x} ${slot.y}) scale(${slot.s})`);
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", cloudPath(style, puff, stretch, noise, index * 17 + 2));
      path.setAttribute("fill", "#fff");
      path.setAttribute("stroke", "#e8f4ff");
      path.setAttribute("stroke-width", "3");
      g.appendChild(path);
      return g;
    })
  );
}

function wavePath(y, length, phase) {
  const amp = 10 + (length / 220) * 8;
  const parts = [`M 20 ${y}`];
  for (let x = 20; x <= 940; x += 8) {
    const yy = y + Math.sin((x + phase) / length * Math.PI * 2) * amp;
    parts.push(`L ${x} ${yy.toFixed(2)}`);
  }
  return parts.join(" ");
}

function drawWaves(phase = 0) {
  const width = Number(controls.waveWidth.value);
  const length = Number(controls.waveLength.value);
  const color = controls.waveColor.value;
  const rows = [508, 536, 564, 592];

  wavesLayer.setAttribute("stroke", color);
  wavesLayer.setAttribute("stroke-width", String(width));
  wavesLayer.replaceChildren(
    ...rows.map((y, i) => {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", wavePath(y, length, phase + i * 18));
      path.setAttribute("opacity", String(0.95 - i * 0.12));
      return path;
    })
  );
}

function setCatSize() {
  const size = Number(controls.catSize.value);
  catScale.setAttribute("transform", `scale(${size})`);
}

function updateLabels() {
  labels.cloudPuff.textContent = Number(controls.cloudPuff.value).toFixed(2);
  labels.cloudStretch.textContent = Number(controls.cloudStretch.value).toFixed(2);
  labels.cloudNoise.textContent = Number(controls.cloudNoise.value).toFixed(2);
  labels.catSize.textContent = Number(controls.catSize.value).toFixed(2);
  labels.waveWidth.textContent = Number(controls.waveWidth.value).toFixed(1);
  labels.waveLength.textContent = String(Math.round(Number(controls.waveLength.value)));
}

function redrawStatic() {
  updateLabels();
  drawClouds();
  setCatSize();
  drawWaves(performance.now() / 40);
}

Object.values(controls).forEach((el) => {
  el.addEventListener("input", redrawStatic);
});

function animate(now) {
  const t = now / 1000;
  const wind = 0.5 + Math.sin(t * 1.3) * 0.5;
  const sway = 8 + wind * 10;

  catSway.setAttribute("transform", `rotate(${-4 + wind * 6}) translate(${sway * 0.35} ${Math.sin(t * 1.6) * 4})`);

  const tipX = 118 + sway * 1.8;
  const tipY = 18 + Math.sin(t * 2.1) * 10;
  tail.setAttribute(
    "d",
    `M 48 18 C 78 8, ${96 + sway * 0.4} ${28 + wind * 6}, ${tipX} ${tipY} C ${tipX - 8} ${tipY + 16}, 86 42, 52 36 Z`
  );
  body.setAttribute(
    "d",
    `M -18 -8 C ${12 + sway * 0.2} -28, ${58 + sway * 0.35} -8, ${70 + sway * 0.4} 18 C ${52 + sway * 0.2} 48, 8 58, -22 42 C -48 28, -46 10, -18 -8 Z`
  );
  hindLegs.setAttribute(
    "d",
    `M 8 36 C ${28 + sway} 52, ${48 + sway * 1.2} 78, ${62 + sway * 1.4} 92 C ${48 + sway} 86, 18 70, 2 50 Z
     M 22 32 C ${42 + sway} 48, ${66 + sway * 1.1} 70, ${80 + sway * 1.3} 82 C ${64 + sway} 74, 30 58, 16 40 Z`
  );
  foreLegs.setAttribute(
    "d",
    `M -16 28 C ${-2 + sway * 0.6} 48, ${18 + sway} 70, ${30 + sway * 1.1} 86 C ${14 + sway * 0.5} 76, -18 52, -26 34 Z
     M -2 30 C ${16 + sway * 0.7} 50, ${36 + sway} 72, ${50 + sway * 1.15} 84 C ${32 + sway * 0.5} 74, -4 54, -10 36 Z`
  );

  drawWaves(now / 36);
  requestAnimationFrame(animate);
}

redrawStatic();
requestAnimationFrame(animate);
