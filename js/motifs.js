/** Prehistoric rock-art motifs, pigments, and narrative templates. */

export const PIGMENTS = [
  { id: "hematite", name: "赤铁矿", color: "#9C3B2A" },
  { id: "red-ochre", name: "红赭石", color: "#C45C3A" },
  { id: "orange-ochre", name: "橙赭", color: "#D4723A" },
  { id: "yellow-ochre", name: "黄赭石", color: "#D4A054" },
  { id: "limonite", name: "褐铁矿", color: "#8B6914" },
  { id: "sienna", name: "生赭", color: "#6B3A22" },
  { id: "charcoal", name: "木炭", color: "#2A2218" },
  { id: "manganese", name: "锰黑", color: "#1A1816" },
  { id: "kaolin", name: "高岭土", color: "#EDE4D0" },
  { id: "malachite", name: "石绿", color: "#4A6B4A" },
];

export const WALLS = [
  { id: "limestone", name: "石灰岩" },
  { id: "sandstone", name: "砂岩" },
  { id: "granite", name: "花岗岩" },
  { id: "night", name: "夜壁" },
];

export const STYLES = [
  { id: "pictograph", name: "涂绘" },
  { id: "silhouette", name: "剪影" },
  { id: "outline", name: "勾线" },
  { id: "petroglyph", name: "线刻" },
  { id: "stencil", name: "喷绘" },
];

export const CATEGORIES = [
  { id: "all", name: "全部" },
  { id: "animal", name: "动物" },
  { id: "figure", name: "人物" },
  { id: "sign", name: "符号" },
];

/**
 * Motifs live in a 100×100 design box.
 * `fills` are closed silhouettes; `strokes` are open polylines;
 * `circles` are {x,y,r} discs (heads, suns, cupules).
 */
export const MOTIFS = [
  {
    id: "bison",
    name: "野牛",
    nameEn: "Bison",
    category: "animal",
    fills: [
      [
        [10, 44], [8, 38], [14, 30], [24, 24], [36, 14], [48, 10],
        [58, 16], [68, 24], [76, 26], [84, 24], [92, 30], [97, 38],
        [96, 46], [90, 50], [84, 48], [80, 52], [82, 66], [77, 67],
        [74, 52], [66, 54], [68, 70], [63, 70], [60, 54], [48, 56],
        [50, 72], [45, 72], [42, 56], [32, 54], [34, 68], [29, 68],
        [26, 52], [18, 52], [16, 50], [12, 50],
      ],
    ],
    strokes: [
      [[78, 24], [74, 10], [80, 6], [84, 16]],
      [[82, 24], [88, 8], [94, 12], [90, 22]],
    ],
  },
  {
    id: "horse",
    name: "马",
    nameEn: "Horse",
    category: "animal",
    fills: [
      [
        [8, 42], [6, 30], [12, 34], [20, 32], [36, 28], [52, 30],
        [64, 28], [72, 20], [76, 14], [80, 18], [82, 28], [92, 34],
        [98, 42], [94, 48], [86, 46], [78, 44], [74, 48], [76, 64],
        [71, 64], [68, 50], [58, 52], [60, 68], [55, 68], [52, 52],
        [40, 52], [42, 70], [37, 70], [34, 52], [24, 50], [26, 66],
        [21, 66], [18, 50], [12, 48],
      ],
    ],
    strokes: [
      [[6, 30], [2, 22], [8, 26]],
    ],
  },
  {
    id: "deer",
    name: "鹿",
    nameEn: "Deer",
    category: "animal",
    fills: [
      [
        [18, 48], [16, 40], [24, 36], [38, 34], [52, 36], [62, 34],
        [70, 28], [76, 30], [84, 36], [88, 44], [82, 48], [74, 46],
        [70, 50], [72, 68], [67, 68], [64, 50], [54, 52], [56, 72],
        [51, 72], [48, 52], [38, 52], [40, 70], [35, 70], [32, 52],
        [24, 52], [26, 68], [21, 68], [20, 52],
      ],
    ],
    strokes: [
      [[70, 28], [66, 12], [58, 4], [54, 10], [62, 16], [68, 26]],
      [[74, 26], [78, 10], [86, 4], [90, 12], [80, 18]],
      [[16, 40], [10, 36], [8, 42]],
    ],
  },
  {
    id: "ibex",
    name: "山羊",
    nameEn: "Ibex",
    category: "animal",
    fills: [
      [
        [22, 52], [20, 44], [28, 40], [40, 40], [52, 38], [62, 36],
        [70, 32], [78, 36], [82, 44], [78, 50], [70, 48], [66, 52],
        [68, 70], [63, 70], [60, 52], [50, 54], [52, 74], [47, 74],
        [44, 54], [34, 54], [36, 72], [31, 72], [28, 54], [24, 54],
      ],
    ],
    strokes: [
      [[70, 32], [62, 8], [50, 2], [48, 10], [58, 16], [68, 30]],
      [[74, 30], [80, 8], [90, 2], [92, 10], [82, 18]],
    ],
  },
  {
    id: "mammoth",
    name: "猛犸",
    nameEn: "Mammoth",
    category: "animal",
    fills: [
      [
        [8, 50], [10, 38], [18, 26], [32, 16], [50, 12], [66, 18],
        [76, 28], [82, 36], [86, 34], [90, 42], [86, 50], [88, 70],
        [82, 62], [80, 48], [74, 50], [76, 72], [70, 72], [66, 52],
        [52, 54], [54, 76], [48, 76], [44, 54], [30, 54], [32, 74],
        [26, 74], [24, 54], [16, 56], [14, 54],
      ],
    ],
    strokes: [
      [[86, 50], [84, 64], [78, 78], [70, 86], [66, 80]],
      [[8, 44], [4, 40], [6, 48]],
    ],
  },
  {
    id: "aurochs",
    name: "原牛",
    nameEn: "Aurochs",
    category: "animal",
    fills: [
      [
        [12, 50], [10, 42], [18, 34], [30, 28], [44, 24], [58, 26],
        [70, 30], [80, 32], [88, 30], [94, 38], [92, 48], [84, 50],
        [78, 48], [76, 54], [78, 70], [72, 70], [70, 54], [60, 56],
        [62, 74], [56, 74], [54, 56], [42, 56], [44, 72], [38, 72],
        [36, 56], [26, 54], [28, 70], [22, 70], [20, 52], [14, 52],
      ],
    ],
    strokes: [
      [[84, 30], [78, 8], [70, 2], [68, 12], [76, 18]],
      [[90, 30], [96, 10], [94, 4], [88, 14]],
    ],
  },
  {
    id: "tiger",
    name: "虎",
    nameEn: "Tiger",
    category: "animal",
    fills: [
      [
        [6, 48], [10, 40], [22, 36], [40, 34], [58, 36], [70, 34],
        [80, 30], [88, 34], [92, 42], [88, 48], [80, 46], [76, 50],
        [78, 66], [72, 66], [70, 50], [58, 52], [60, 70], [54, 70],
        [52, 52], [38, 52], [40, 70], [34, 70], [32, 52], [20, 52],
        [22, 68], [16, 68], [14, 52], [8, 52],
      ],
    ],
    strokes: [
      [[6, 48], [2, 44], [4, 54], [10, 52]],
      [[82, 34], [84, 28]],
      [[40, 40], [42, 46]],
      [[52, 40], [54, 46]],
      [[64, 40], [66, 46]],
    ],
  },
  {
    id: "wolf",
    name: "狼",
    nameEn: "Wolf",
    category: "animal",
    fills: [
      [
        [8, 46], [4, 34], [12, 38], [24, 36], [40, 36], [56, 38],
        [68, 36], [76, 30], [82, 32], [92, 40], [96, 46], [90, 48],
        [82, 46], [76, 50], [78, 68], [72, 68], [70, 50], [58, 52],
        [60, 72], [54, 72], [52, 52], [40, 52], [42, 70], [36, 70],
        [34, 52], [22, 50], [24, 66], [18, 66], [16, 50], [10, 50],
      ],
    ],
  },
  {
    id: "bird",
    name: "鸟",
    nameEn: "Bird",
    category: "animal",
    fills: [
      [
        [18, 48], [22, 36], [34, 28], [48, 26], [62, 30], [74, 28],
        [86, 34], [90, 42], [82, 46], [70, 44], [60, 48], [62, 58],
        [54, 56], [48, 48], [36, 50], [28, 56], [22, 54],
      ],
    ],
    strokes: [
      [[48, 48], [46, 72], [50, 78]],
      [[54, 50], [58, 74]],
      [[86, 34], [94, 30]],
    ],
  },
  {
    id: "fish",
    name: "鱼",
    nameEn: "Fish",
    category: "animal",
    fills: [
      [
        [12, 50], [18, 38], [32, 30], [50, 28], [68, 32], [82, 42],
        [88, 50], [82, 58], [68, 68], [50, 72], [32, 70], [18, 62],
      ],
      [[88, 50], [98, 36], [94, 50], [98, 64]],
    ],
    circles: [{ x: 28, y: 46, r: 2.4 }],
  },
  {
    id: "snake",
    name: "蛇",
    nameEn: "Snake",
    category: "animal",
    strokes: [
      [
        [8, 62], [16, 48], [28, 40], [40, 46], [52, 58], [64, 52],
        [76, 38], [86, 34], [92, 40], [90, 48],
      ],
    ],
    circles: [{ x: 90, y: 36, r: 4 }],
  },
  {
    id: "hunter",
    name: "猎人",
    nameEn: "Hunter",
    category: "figure",
    fills: [
      [
        [40, 28], [36, 32], [38, 48], [32, 72], [38, 74], [44, 52],
        [48, 74], [54, 72], [50, 48], [52, 34], [48, 28],
      ],
    ],
    circles: [{ x: 44, y: 18, r: 8 }],
    strokes: [
      [[28, 40], [78, 22], [84, 18]],
      [[78, 22], [80, 28]],
    ],
  },
  {
    id: "archer",
    name: "弓箭手",
    nameEn: "Archer",
    category: "figure",
    fills: [
      [
        [48, 28], [44, 32], [46, 50], [40, 74], [46, 76], [52, 54],
        [56, 76], [62, 74], [56, 50], [58, 32], [54, 28],
      ],
    ],
    circles: [{ x: 51, y: 18, r: 8 }],
    strokes: [
      [[28, 22], [22, 48], [30, 74]],
      [[28, 22], [34, 48], [30, 74]],
      [[22, 48], [70, 46]],
    ],
  },
  {
    id: "shaman",
    name: "萨满",
    nameEn: "Shaman",
    category: "figure",
    fills: [
      [
        [46, 30], [30, 28], [24, 32], [26, 36], [44, 40], [42, 56],
        [28, 82], [34, 86], [48, 62], [52, 86], [58, 82], [56, 56],
        [54, 40], [72, 36], [74, 32], [68, 28], [54, 30],
      ],
    ],
    circles: [{ x: 50, y: 20, r: 9 }],
    strokes: [
      [[42, 14], [34, 2], [30, 10], [38, 16]],
      [[58, 14], [66, 2], [70, 10], [62, 16]],
      [[50, 12], [50, 4]],
    ],
  },
  {
    id: "dancer",
    name: "舞者",
    nameEn: "Dancer",
    category: "figure",
    fills: [
      [
        [50, 28], [40, 24], [28, 18], [24, 22], [38, 32], [42, 50],
        [28, 70], [24, 82], [32, 84], [44, 64], [52, 84], [60, 86],
        [56, 70], [58, 50], [70, 36], [84, 28], [86, 22], [74, 22],
        [60, 30],
      ],
    ],
    circles: [{ x: 52, y: 16, r: 8 }],
  },
  {
    id: "orant",
    name: "祈者",
    nameEn: "Orant",
    category: "figure",
    fills: [
      [
        [48, 26], [36, 24], [18, 18], [12, 22], [16, 28], [36, 34],
        [40, 52], [24, 84], [32, 88], [48, 58], [52, 88], [60, 84],
        [56, 52], [60, 34], [80, 28], [84, 22], [78, 18], [60, 24],
        [52, 26],
      ],
    ],
    circles: [{ x: 50, y: 14, r: 9 }],
  },
  {
    id: "pair",
    name: "双人",
    nameEn: "Pair",
    category: "figure",
    fills: [
      [
        [22, 30], [16, 34], [18, 52], [12, 78], [18, 80], [24, 56],
        [28, 80], [34, 78], [30, 52], [32, 34], [28, 30],
      ],
      [
        [68, 30], [62, 34], [64, 52], [58, 78], [64, 80], [70, 56],
        [74, 80], [80, 78], [76, 52], [78, 34], [74, 30],
      ],
    ],
    circles: [
      { x: 24, y: 20, r: 7 },
      { x: 70, y: 20, r: 7 },
    ],
    strokes: [[[32, 40], [62, 40]]],
  },
  {
    id: "hand",
    name: "手印",
    nameEn: "Hand",
    category: "sign",
    fills: [
      [
        [38, 88], [30, 84], [24, 70], [22, 52], [18, 32], [14, 18],
        [18, 12], [26, 16], [32, 36], [34, 22], [30, 8], [36, 4],
        [42, 10], [44, 28], [48, 12], [46, 4], [52, 2], [58, 8],
        [56, 26], [62, 14], [60, 6], [66, 6], [70, 14], [64, 34],
        [72, 28], [78, 30], [76, 40], [66, 50], [64, 70], [58, 86],
      ],
    ],
  },
  {
    id: "sun",
    name: "太阳神",
    nameEn: "Sun Spirit",
    category: "sign",
    circles: [
      { x: 50, y: 50, r: 18 },
      { x: 50, y: 50, r: 10 },
    ],
    strokes: [
      [[50, 26], [50, 10]],
      [[50, 74], [50, 90]],
      [[26, 50], [10, 50]],
      [[74, 50], [90, 50]],
      [[34, 34], [22, 22]],
      [[66, 34], [78, 22]],
      [[34, 66], [22, 78]],
      [[66, 66], [78, 78]],
    ],
    fills: [
      [
        [44, 68], [40, 78], [36, 92], [44, 90], [50, 76], [56, 90],
        [64, 92], [60, 78], [56, 68],
      ],
    ],
  },
  {
    id: "face",
    name: "人面",
    nameEn: "Face",
    category: "sign",
    circles: [
      { x: 50, y: 48, r: 32 },
      { x: 38, y: 42, r: 6 },
      { x: 62, y: 42, r: 6 },
    ],
    strokes: [
      [[36, 62], [50, 70], [64, 62]],
      [[50, 16], [50, 8], [44, 4], [50, 2], [56, 4], [50, 8]],
    ],
  },
  {
    id: "spiral",
    name: "螺旋",
    nameEn: "Spiral",
    category: "sign",
    strokes: [
      spiralPoints(50, 50, 6, 34, 5.2),
    ],
  },
  {
    id: "dots",
    name: "点阵",
    nameEn: "Cupules",
    category: "sign",
    circles: [
      { x: 30, y: 30, r: 5 },
      { x: 50, y: 26, r: 4 },
      { x: 70, y: 32, r: 5 },
      { x: 24, y: 52, r: 4 },
      { x: 50, y: 50, r: 6 },
      { x: 76, y: 54, r: 4 },
      { x: 34, y: 74, r: 5 },
      { x: 56, y: 76, r: 4 },
      { x: 72, y: 72, r: 5 },
    ],
  },
  {
    id: "boat",
    name: "船",
    nameEn: "Boat",
    category: "sign",
    fills: [
      [
        [8, 58], [16, 70], [32, 76], [50, 78], [70, 76], [86, 68],
        [94, 56], [86, 60], [70, 66], [50, 68], [32, 66], [16, 60],
      ],
    ],
    strokes: [
      [[28, 58], [28, 36], [32, 36]],
      [[44, 58], [44, 30], [48, 30]],
      [[60, 58], [60, 34], [64, 34]],
      [[76, 58], [76, 38], [80, 38]],
    ],
    circles: [
      { x: 28, y: 30, r: 4 },
      { x: 44, y: 24, r: 4 },
      { x: 60, y: 28, r: 4 },
      { x: 76, y: 32, r: 4 },
    ],
  },
  {
    id: "tracks",
    name: "足迹",
    nameEn: "Tracks",
    category: "sign",
    fills: [
      [[18, 28], [14, 22], [20, 18], [26, 24], [22, 32], [16, 36], [12, 32]],
      [[28, 48], [24, 42], [30, 38], [36, 44], [32, 52], [26, 56], [22, 52]],
      [[42, 30], [38, 24], [44, 20], [50, 26], [46, 34], [40, 38], [36, 34]],
      [[54, 52], [50, 46], [56, 42], [62, 48], [58, 56], [52, 60], [48, 56]],
      [[68, 34], [64, 28], [70, 24], [76, 30], [72, 38], [66, 42], [62, 38]],
      [[78, 56], [74, 50], [80, 46], [86, 52], [82, 60], [76, 64], [72, 60]],
    ],
  },
  {
    id: "spear",
    name: "矛",
    nameEn: "Spear",
    category: "sign",
    fills: [
      [[78, 18], [96, 8], [88, 28]],
    ],
    strokes: [
      [[12, 86], [82, 22]],
    ],
  },
];

function spiralPoints(cx, cy, r0, r1, turns) {
  const pts = [];
  const steps = Math.floor(turns * 28);
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const a = t * turns * Math.PI * 2;
    const r = r0 + (r1 - r0) * t;
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  return pts;
}

export const NARRATIVES = [
  {
    id: "hunt",
    name: "围猎",
    title: "围猎",
    caption: "人与兽在岩壁上相遇，矛尖指向奔跑的脊背。",
    wall: "limestone",
    figures: [
      { motifId: "bison", nx: 0.62, ny: 0.46, size: 0.22, color: "#9C3B2A", role: "猎物", stretchX: 1.15 },
      { motifId: "horse", nx: 0.78, ny: 0.32, size: 0.14, color: "#2A2218", role: "伴行兽", rotation: -0.12 },
      { motifId: "deer", nx: 0.86, ny: 0.58, size: 0.12, color: "#6B3A22", role: "逃群" },
      { motifId: "hunter", nx: 0.22, ny: 0.52, size: 0.16, color: "#1A1816", role: "猎人" },
      { motifId: "archer", nx: 0.34, ny: 0.64, size: 0.13, color: "#2A2218", role: "弓手" },
      { motifId: "spear", nx: 0.46, ny: 0.40, size: 0.10, color: "#1A1816", role: "投掷", rotation: 0.4 },
      { motifId: "tracks", nx: 0.18, ny: 0.72, size: 0.10, color: "#6B3A22", role: "踪迹", opacity: 0.55 },
    ],
  },
  {
    id: "ritual",
    name: "祭祀",
    title: "祭环",
    caption: "舞者围着太阳神旋转，萨满戴着兽角走进光里。",
    wall: "sandstone",
    figures: [
      { motifId: "sun", nx: 0.50, ny: 0.40, size: 0.18, color: "#D4A054", role: "太阳神" },
      { motifId: "shaman", nx: 0.50, ny: 0.68, size: 0.16, color: "#9C3B2A", role: "萨满" },
      { motifId: "dancer", nx: 0.28, ny: 0.46, size: 0.13, color: "#C45C3A", role: "舞者", rotation: -0.2 },
      { motifId: "dancer", nx: 0.72, ny: 0.46, size: 0.13, color: "#C45C3A", role: "舞者", flipX: true, rotation: 0.2 },
      { motifId: "orant", nx: 0.22, ny: 0.68, size: 0.12, color: "#6B3A22", role: "祈者" },
      { motifId: "orant", nx: 0.78, ny: 0.68, size: 0.12, color: "#6B3A22", role: "祈者", flipX: true },
      { motifId: "spiral", nx: 0.50, ny: 0.18, size: 0.08, color: "#D4723A", role: "灵旋", opacity: 0.7 },
    ],
  },
  {
    id: "migration",
    name: "迁徙",
    title: "兽群过河",
    caption: "蹄印连成一条河岸，兽群从左岸走到右岸。",
    wall: "limestone",
    figures: [
      { motifId: "mammoth", nx: 0.20, ny: 0.42, size: 0.18, color: "#2A2218", role: "领路" },
      { motifId: "aurochs", nx: 0.40, ny: 0.50, size: 0.16, color: "#6B3A22", role: "原牛" },
      { motifId: "bison", nx: 0.58, ny: 0.38, size: 0.15, color: "#9C3B2A", role: "野牛" },
      { motifId: "horse", nx: 0.72, ny: 0.54, size: 0.13, color: "#8B6914", role: "马" },
      { motifId: "deer", nx: 0.84, ny: 0.40, size: 0.11, color: "#C45C3A", role: "鹿" },
      { motifId: "ibex", nx: 0.30, ny: 0.64, size: 0.10, color: "#2A2218", role: "山羊" },
      { motifId: "tracks", nx: 0.50, ny: 0.72, size: 0.14, color: "#6B3A22", role: "迁徙线", opacity: 0.5 },
      { motifId: "pair", nx: 0.14, ny: 0.70, size: 0.10, color: "#1A1816", role: "跟随的人" },
    ],
  },
  {
    id: "cosmos",
    name: "星象",
    title: "天上的兽",
    caption: "人面望着螺旋，鸟把太阳衔到夜壁之上。",
    wall: "night",
    figures: [
      { motifId: "face", nx: 0.22, ny: 0.32, size: 0.16, color: "#EDE4D0", role: "天面" },
      { motifId: "spiral", nx: 0.50, ny: 0.28, size: 0.14, color: "#D4A054", role: "星旋" },
      { motifId: "sun", nx: 0.78, ny: 0.26, size: 0.14, color: "#D4723A", role: "夜日" },
      { motifId: "bird", nx: 0.64, ny: 0.48, size: 0.12, color: "#EDE4D0", role: "信鸟" },
      { motifId: "snake", nx: 0.50, ny: 0.62, size: 0.18, color: "#4A6B4A", role: "天蛇" },
      { motifId: "dots", nx: 0.30, ny: 0.58, size: 0.10, color: "#EDE4D0", role: "星点", opacity: 0.8 },
      { motifId: "orant", nx: 0.50, ny: 0.80, size: 0.12, color: "#C45C3A", role: "观星人" },
    ],
  },
  {
    id: "hands",
    name: "手印洞窟",
    title: "我们在此",
    caption: "层层叠叠的手，像一群人同时把掌心贴上岩壁。",
    wall: "sandstone",
    figures: [
      { motifId: "hand", nx: 0.28, ny: 0.40, size: 0.16, color: "#9C3B2A", style: "stencil", role: "左壁" },
      { motifId: "hand", nx: 0.42, ny: 0.52, size: 0.14, color: "#C45C3A", style: "stencil", flipX: true, role: "叠印" },
      { motifId: "hand", nx: 0.58, ny: 0.36, size: 0.18, color: "#2A2218", style: "stencil", role: "主印" },
      { motifId: "hand", nx: 0.70, ny: 0.58, size: 0.13, color: "#6B3A22", style: "stencil", flipX: true, role: "右壁" },
      { motifId: "hand", nx: 0.36, ny: 0.68, size: 0.11, color: "#D4723A", style: "stencil", opacity: 0.7, role: "浅印" },
      { motifId: "hand", nx: 0.80, ny: 0.34, size: 0.10, color: "#9C3B2A", style: "stencil", opacity: 0.55, role: "远印" },
      { motifId: "dots", nx: 0.52, ny: 0.78, size: 0.10, color: "#8B6914", role: "点彩" },
    ],
  },
  {
    id: "life",
    name: "生命",
    title: "河与生灵",
    caption: "船渡过鱼群，虎在岸上停步，一双人影并肩而立。",
    wall: "granite",
    figures: [
      { motifId: "boat", nx: 0.50, ny: 0.42, size: 0.20, color: "#1A1816", role: "渡船" },
      { motifId: "fish", nx: 0.28, ny: 0.62, size: 0.10, color: "#4A6B4A", role: "鱼", rotation: -0.2 },
      { motifId: "fish", nx: 0.40, ny: 0.70, size: 0.08, color: "#4A6B4A", role: "鱼", flipX: true },
      { motifId: "fish", nx: 0.68, ny: 0.66, size: 0.09, color: "#2A2218", role: "鱼", rotation: 0.15 },
      { motifId: "tiger", nx: 0.22, ny: 0.32, size: 0.14, color: "#9C3B2A", role: "岸虎" },
      { motifId: "pair", nx: 0.78, ny: 0.34, size: 0.12, color: "#2A2218", role: "族人" },
      { motifId: "bird", nx: 0.58, ny: 0.22, size: 0.09, color: "#6B3A22", role: "飞鸟" },
    ],
  },
];

export function motifById(id) {
  return MOTIFS.find((m) => m.id === id);
}

export function pigmentByColor(color) {
  return PIGMENTS.find((p) => p.color.toLowerCase() === String(color).toLowerCase());
}
