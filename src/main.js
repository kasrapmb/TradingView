import {
  createChart,
  CandlestickSeries,
  LineSeries,
  AreaSeries,
  BarSeries,
  HistogramSeries,
  BaselineSeries,
  ColorType,
} from "lightweight-charts";
import {
  createIcons,
  Crosshair,
  MoveUpRight,
  Minus,
  SlidersHorizontal,
  Pentagon,
  Pencil,
  Type,
  Smile,
  Ruler,
  ZoomIn,
  Magnet,
  LockKeyhole,
  Eye,
  Trash2,
  CircleHelp,
  PlusCircle,
  CandlestickChart,
  ChartNoAxesCombined,
  ChevronDown,
  AlarmClockPlus,
  Rewind,
  Undo2,
  Redo2,
  LayoutDashboard,
  Settings2,
  Maximize,
  Camera,
  PanelsTopLeft,
  AlarmClock,
  Layers,
  Star,
  CalendarDays,
  Radio,
  Bell,
  MessagesSquare,
  Plus,
  Ellipsis,
  LayoutGrid,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  ChevronUp,
} from "lucide";
const icons = {
  Crosshair,
  MoveUpRight,
  Minus,
  SlidersHorizontal,
  Pentagon,
  Pencil,
  Type,
  Smile,
  Ruler,
  ZoomIn,
  Magnet,
  LockKeyhole,
  Eye,
  Trash2,
  CircleHelp,
  PlusCircle,
  CandlestickChart,
  ChartNoAxesCombined,
  ChevronDown,
  AlarmClockPlus,
  Rewind,
  Undo2,
  Redo2,
  LayoutDashboard,
  Settings2,
  Maximize,
  Camera,
  PanelsTopLeft,
  AlarmClock,
  Layers,
  Star,
  CalendarDays,
  Radio,
  Bell,
  MessagesSquare,
  Plus,
  Ellipsis,
  LayoutGrid,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  ChevronUp,
};
import { demo, sma, ema, rsi, bands } from "./data.js";
import "./style.css";
import {
  drawingGroups,
  annotationGroups,
  projectionGroups,
  fibGroups,
  onePoint,
  threePoint,
  fourPoint,
  drawingMarkup,
} from "./drawing.js";
import {
  indicatorCatalog,
  unavailableIndicators,
  computeStudy,
  heikinAshi,
} from "./indicators.js";
const icon = (name) => `<i data-lucide="${name}"></i>`;
const btn = (name, title, action, cls = "") =>
  `<button class="${cls}" title="${title}" aria-label="${title}" data-action="${action}">${icon(name)}</button>`;
const tools = [
  ["crosshair", "Crosshair", "cursor"],
  ["move-up-right", "Lines and channels", "lines-menu"],
  ["minus", "Horizontal line", "horizontal"],
  ["sliders-horizontal", "Fibonacci and Gann", "fib-menu"],
  ["pentagon", "Rectangle", "rectangle"],
  ["ruler", "Projection and measurement", "projection-menu"],
  ["type", "Text and notes", "text-menu"],
  ["smile", "Emoji marker", "emoji"],
  ["ruler", "Measure", "measure"],
  ["zoom-in", "Zoom in", "zoom"],
  ["magnet", "Snap to candle", "snap"],
  ["lock-keyhole", "Lock drawings", "lock"],
  ["eye", "Hide drawings", "hide"],
  ["trash-2", "Delete all drawings", "clear"],
];
document.querySelector("#app").innerHTML =
  `<header><a class="brand" href="#" title="Chart Workspace">CW<span>◆</span></a><button data-action="symbol" class="symbol">BTCUSD</button>${btn("plus-circle", "Compare symbol", "compare")}<span class="divider"></span><button data-action="interval" id="interval">15m</button><span class="divider"></span>${btn("candlestick-chart", "Chart style", "style")}<button data-action="indicators" class="wide">${icon("chart-no-axes-combined")} Indicators ${icon("chevron-down")}</button><span class="divider"></span><button data-action="alert" class="wide">${icon("alarm-clock-plus")} Alert</button><button data-action="replay" class="wide">${icon("rewind")} Replay</button><span class="divider"></span>${btn("undo-2", "Undo drawing", "undo")}${btn("redo-2", "Redo drawing", "redo")}<div class="spacer"></div><button data-action="save" id="layout">${icon("layout-dashboard")} Unnamed ${icon("chevron-down")}</button>${btn("settings-2", "Chart settings", "settings")}${btn("maximize", "Fullscreen", "fullscreen")}${btn("camera", "Download chart screenshot", "screenshot")}<button data-action="trade" class="trade">Paper Trade</button></header><div class="workspace"><aside class="drawing-tools">${tools.map(([i, t, a], n) => btn(i, t, a, n === 0 ? "selected" : "")).join("")}<div class="spacer"></div>${btn("circle-help", "Help & shortcuts", "help")}</aside><main><div class="chart-shell"><div class="chart-heading"><div><span class="coin">₿</span> <strong id="instrument">Bitcoin / U.S. Dollar · 15 · Bitstamp</strong><span id="source" class="source">DEMO DATA</span><span id="ohlc"></span></div><div class="quotes"><button data-action="trade" class="sell"><b id="sell">78,789</b><small>SELL</small></button><span>0</span><button data-action="trade" class="buy"><b id="buy">78,789</b><small>BUY</small></button></div><div id="study-labels"></div></div><div id="chart"></div><svg id="drawings"></svg><div id="draw-hint"></div><div class="watermark">Chart Workspace<span> / BTCUSD</span></div><div class="chart-controls">${btn("minus", "Zoom out", "zoomout")}${btn("plus", "Zoom in", "zoom")}${btn("arrow-left", "Scroll left", "left")}${btn("arrow-right", "Scroll right", "right")}${btn("rotate-ccw", "Fit chart", "fit")}</div></div><div class="rangebar">${["1D", "5D", "1M", "3M", "6M", "YTD", "1Y", "5Y", "All"].map((x) => `<button data-range="${x}">${x}</button>`).join("")}<span class="spacer"></span><span id="clock"></span><button data-action="log" id="log">log</button><button data-action="auto">auto</button></div><div class="bottom-tabs"><button class="active" data-panel="screener">Crypto Screener</button><button data-panel="editor">Indicator Editor</button><button data-panel="strategy">Strategy Tester</button><button data-panel="trading">Trading Panel</button><div class="spacer"></div>${btn("chevron-up", "Expand panel", "panel")}</div><section id="bottom-panel" hidden></section></main><aside class="watchlist"><div class="watch-head"><b>Watchlist</b>${icon("chevron-down")}<span class="spacer"></span>${btn("plus", "Add symbol", "symbol")}${btn("ellipsis", "Watchlist options", "watch-options")}</div><div class="table-head"><span>Symbol</span><span>Last</span><span>Chg%</span></div><div id="watch-rows"></div><div class="details"><div><span class="coin">₿</span><b id="detail-symbol">BTCUSD</b><span class="spacer"></span>${icon("layout-grid")}</div><p id="detail-name">Bitcoin / U.S. Dollar · BITSTAMP</p><small>Spot · Crypto</small><h1 id="detail-price">78,789<span>USD</span></h1><p class="red" id="detail-change">−2,461 −3.03%</p><p class="green">● Market open</p><div class="detail-line"><span>Volume</span><b id="detail-volume">—</b></div><div class="detail-line"><span>Data source</span><b id="detail-source">Demo</b></div><p class="muted">Independent charting workspace. Not affiliated with TradingView.</p></div></aside><aside class="right-tools">${[
    ["panels-top-left", "Toggle watchlist", "watch"],
    ["alarm-clock", "Alerts", "alerts"],
    ["layers", "Object tree", "objects"],
    ["star", "Favorites", "favorites"],
    ["calendar-days", "Calendar", "calendar"],
    ["radio", "Connection status", "connection"],
    ["bell", "Notifications", "alerts"],
    ["messages-square", "Notes", "notes"],
  ]
    .map((x) => btn(...x))
    .join(
      "",
    )}<div class="spacer"></div>${btn("circle-help", "Help", "help")}</aside></div><div id="modal-root"></div><div id="toast"></div>`;
createIcons({ icons });
let symbol = "btcusd",
  step = 900,
  mode = "candles",
  data = demo(),
  studies = new Map(),
  drawings = JSON.parse(localStorage.getItem("cw-drawings") || "[]"),
  redo = [],
  tool = "cursor",
  first = null,
  second = null,
  third = null,
  hidden = false,
  locked = false,
  snap = false,
  live = false,
  replaying = false,
  replayIndex = 0,
  loadId = 0;
const host = document.querySelector("#chart");
const svg = document.querySelector("#drawings");
const paneLabels = document.createElement("div");
paneLabels.id = "pane-labels";
document.querySelector(".chart-shell").append(paneLabels);
const drawingToolbar = document.createElement("div");
drawingToolbar.id = "drawing-toolbar";
document.querySelector(".chart-shell").append(drawingToolbar);
let selectedDrawing = -1,
  previewPoint = null,
  dragState = null,
  suppressClick = false;
let undoSnapshots = [],
  redoSnapshots = [];
function checkpoint() {
  undoSnapshots.push(structuredClone(drawings));
  if (undoSnapshots.length > 100) undoSnapshots.shift();
  redoSnapshots = [];
}
const studyOptions = JSON.parse(
  localStorage.getItem("cw-study-options") || "{}",
);
const hiddenStudies = new Set();
const lastPriceMarker = document.createElement("div");
lastPriceMarker.id = "last-price-marker";
document.querySelector(".chart-shell").append(lastPriceMarker);
let paneSizeSignature = "";

const chart = createChart(host, {
  autoSize: true,
  layout: {
    background: { type: ColorType.Solid, color: "#171b26" },
    textColor: "#a5a9b6",
    fontSize: 12,
    attributionLogo: true,
  },
  grid: { vertLines: { color: "#242833" }, horzLines: { color: "#242833" } },
  rightPriceScale: { borderColor: "#2a2e39", minimumWidth: 84 },
  timeScale: {
    borderColor: "#2a2e39",
    timeVisible: true,
    secondsVisible: false,
    rightOffset: 8,
  },
  crosshair: { mode: 0 },
  handleScroll: true,
  handleScale: true,
});
let series;
const chartTypes = [
  ["bars", "Bars"],
  ["candles", "Candles"],
  ["hollow", "Hollow candles"],
  ["line", "Line"],
  ["markers", "Line with markers"],
  ["step", "Step line"],
  ["area", "Area"],
  ["baseline", "Baseline"],
  ["columns", "Columns"],
  ["high-low", "High-low"],
  ["heikin", "Heikin Ashi"],
];
const singleValue = () =>
  ["line", "markers", "step", "area", "baseline", "columns"].includes(mode);
function createSeries() {
  const previousSeries = series;
  const kind = ["line", "markers", "step"].includes(mode)
    ? LineSeries
    : mode === "area"
      ? AreaSeries
      : mode === "baseline"
        ? BaselineSeries
        : mode === "columns"
          ? HistogramSeries
          : ["bars", "high-low"].includes(mode)
            ? BarSeries
            : CandlestickSeries;
  series = chart.addSeries(kind, {
    upColor: mode === "hollow" ? "#171b2600" : "#089981",
    downColor: "#f23645",
    borderVisible: mode === "hollow",
    borderUpColor: "#089981",
    borderDownColor: "#f23645",
    wickUpColor: "#089981",
    wickDownColor: "#f23645",
    color: "#2962ff",
    lineColor: "#2962ff",
    topColor: "#2962ff55",
    bottomColor: "#2962ff00",
    priceLineVisible: true,
    lastValueVisible: false,
    pointMarkersVisible: mode === "markers",
    lineType: mode === "step" ? 1 : 0,
    openVisible: mode !== "high-low",
    baseValue: { type: "price", price: data[0].close },
  });
  if (previousSeries) chart.removeSeries(previousSeries);
  series
    .priceScale()
    .applyOptions({ scaleMargins: { top: 0.12, bottom: 0.08 } });
  setData();
}
function setData() {
  const shown = replaying ? data.slice(0, replayIndex) : data;
  const prices = mode === "heikin" ? heikinAshi(shown) : shown;
  series.setData(
    prices.map((d) =>
      singleValue()
        ? { time: d.time, value: d.close }
        : mode === "high-low"
          ? { ...d, open: d.low, close: d.high }
          : d,
    ),
  );
  for (const [name, ss] of studies) {
    const values = computeStudy(name, shown, step, studyOptions[name]);
    ss.forEach((s, i) => s.setData(values[i] || []));
  }
  updateQuote(shown.at(-1));
  renderDrawings();
  studyLabels();
  queueOverlayLayout();
}
function updateQuote(d, hover = false) {
  if (!d) return;
  const f = (n) => n.toLocaleString("en-US", { maximumFractionDigits: 2 });
  document.querySelector("#ohlc").innerHTML =
    `O<span>${f(d.open)}</span> H<span>${f(d.high)}</span> L<span>${f(d.low)}</span> C<span class="${d.close >= d.open ? "green" : "red"}">${f(d.close)}</span>`;
  if (hover) return;
  ["sell", "buy", "detail-price"].forEach(
    (id) => (document.getElementById(id).textContent = f(d.close)),
  );
  document.querySelector("#detail-volume").textContent = f(d.volume);
  const pct = (d.close / data[0].close - 1) * 100;
  const change = document.querySelector("#detail-change");
  change.textContent = `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}% · loaded period`;
  change.className = pct >= 0 ? "green" : "red";
  document.querySelector("#detail-source").textContent = live
    ? "Bitstamp OHLC"
    : "Synthetic demo";
  document.querySelector("#source").textContent = live
    ? "● BITSTAMP · 30s POLL"
    : "DEMO DATA";
  document.querySelector("#source").classList.toggle("live", live);
}
createSeries();
chart.timeScale().setVisibleLogicalRange({ from: 265, to: 410 });
const watch = [
  ["CRYPTO", ""],
  ["₿ BTCUSD", "btcusd"],
  ["Ξ ETHUSD", "ethusd"],
  ["◎ SOLUSD", "solusd"],
  ["◈ XRPUSD", "xrpusd"],
  ["Ł LTCUSD", "ltcusd"],
];
function renderWatch() {
  document.querySelector("#watch-rows").innerHTML = watch
    .map(([n, s]) =>
      !s
        ? `<div class="group">⌄ ${n}</div>`
        : `<button class="watch-row ${s === symbol ? "current" : ""}" data-symbol="${s}"><b>${n}</b><span>${s === symbol ? data.at(-1).close.toLocaleString("en-US", { maximumFractionDigits: 2 }) : "—"}</span><span class="${s === symbol ? "red" : "muted"}">${s === symbol ? "●" : "—"}</span></button>`,
    )
    .join("");
}
async function load() {
  const id = ++loadId;
  live = false;
  data = demo(step);
  setData();
  renderWatch();
  try {
    const res = await fetch(`/api/ohlc/${symbol}?step=${step}&limit=400`, {
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) throw Error("Market data unavailable");
    const body = await res.json();
    const rows = body.data.ohlc
      .map((x) => ({
        time: +x.timestamp,
        open: +x.open,
        high: +x.high,
        low: +x.low,
        close: +x.close,
        volume: +x.volume,
      }))
      .sort((a, b) => a.time - b.time)
      .filter((d, i, a) => !i || d.time !== a[i - 1].time);
    if (id !== loadId) return;
    if (
      rows.length < 2 ||
      rows.some((d) => Object.values(d).some((v) => !Number.isFinite(v)))
    )
      throw Error("Invalid market data");
    data = rows;
    live = true;
    setData();
    renderWatch();
  } catch (e) {
    if (id === loadId) {
      toast("Live feed unavailable — showing clearly labeled demo data");
      updateQuote(data.at(-1));
    }
  }
}
load();
setInterval(() => {
  if (!replaying) loadRefresh();
}, 30000);
async function loadRefresh() {
  const id = loadId;
  try {
    const r = await fetch(`/api/ohlc/${symbol}?step=${step}&limit=400`, {
      signal: AbortSignal.timeout(10000),
    });
    if (!r.ok) throw Error();
    const b = await r.json();
    if (id !== loadId || replaying) return;
    const rows = b.data.ohlc.map((d) => ({
      time: +d.timestamp,
      open: +d.open,
      high: +d.high,
      low: +d.low,
      close: +d.close,
      volume: +d.volume,
    }));
    if (
      !rows.length ||
      rows.some((d) => Object.values(d).some((v) => !Number.isFinite(v)))
    )
      throw Error();
    data = rows;
    live = true;
    setData();
    renderWatch();
  } catch {
    live = false;
    document.querySelector("#source").textContent = "FEED OFFLINE · LAST DATA";
  }
}
function addStudy(name) {
  if (studies.has(name)) return;
  const def = indicatorCatalog.find((d) => d[0] === name);
  if (!def) return;
  const pane = def[3] === "pane" ? chart.panes().length : 0;
  const count = computeStudy(name, data, step).length;
  const ss = Array.from({ length: count }, (_, i) =>
    chart.addSeries(
      ["Volume", "OBV", "24-hour volume"].includes(name) ||
        (name === "MACD" && i === 2)
        ? HistogramSeries
        : LineSeries,
      {
        color:
          studyOptions[name]?.color ||
          (["Volume", "24-hour volume"].includes(name)
            ? "#2962ff"
            : ["#638cff", "#ffb74d", "#26c6da"][i % 3]),
        priceFormat: [
          "Volume",
          "24-hour volume",
          "OBV",
          "Accumulation/distribution",
        ].includes(name)
          ? { type: "volume" }
          : { type: "price", precision: 2, minMove: 0.01 },
        lineWidth: 1,
        priceLineVisible: false,
        lastValueVisible: true,
      },
      pane,
    ),
  );
  studies.set(name, ss);
  if (pane)
    chart.panes().forEach((p, i) => p.setStretchFactor(i === 0 ? 4 : 1));
  setData();
  studyLabels();
}
function studyLabels() {
  const label = (n) =>
    `<div class="study-label ${hiddenStudies.has(n) ? "study-hidden" : ""}"><span>${n}${studyOptions[n]?.period ? " · " + studyOptions[n].period : ""}</span><button data-toggle-study="${n}" title="Show/hide indicator" aria-label="Toggle ${n}">${icon("eye")}</button><button data-study-settings="${n}" title="Indicator settings" aria-label="Settings ${n}">${icon("settings-2")}</button><button data-remove-study="${n}" title="Remove indicator" aria-label="Remove ${n}">×</button></div>`;
  const overlays = [...studies.keys()].filter(
    (n) => indicatorCatalog.find((x) => x[0] === n)[3] === "overlay",
  );
  document.querySelector("#study-labels").innerHTML = overlays
    .map(label)
    .join("");
  paneLabels.innerHTML = [...studies]
    .filter(([n]) => !overlays.includes(n))
    .map(([n, ss]) => {
      const pane = ss[0].getPane();
      const idx = pane.paneIndex();
      const top = chart
        .panes()
        .slice(0, idx)
        .reduce((sum, p) => sum + p.getHeight() + 1, 0);
      return `<div class="pane-study" style="top:${top + 4}px">${label(n)}</div>`;
    })
    .join("");
  createIcons({ icons });
}
function removeStudy(name) {
  if (!studies.has(name)) return;
  studies.get(name).forEach((s) => chart.removeSeries(s));
  studies.delete(name);
  hiddenStudies.delete(name);
  studyLabels();
  queueOverlayLayout();
}
function studySettings(name) {
  const opts = studyOptions[name] || {};
  modal(
    name + " · Settings",
    `<form id="study-settings-form" data-name="${name}">${["SMA 20", "EMA 20", "RSI 14", "Bollinger Bands"].includes(name) ? `<label>Length<input type="number" name="period" min="2" max="500" required value="${opts.period || (name === "RSI 14" ? 14 : 20)}"></label>` : ""}${name === "24-hour volume" ? `<label>Volume unit<select name="volumeUnit"><option value="quote" ${opts.volumeUnit !== "base" ? "selected" : ""}>Quote currency (USD)</option><option value="base" ${opts.volumeUnit === "base" ? "selected" : ""}>Base currency</option></select></label>` : ""}<label>Line / column color<input type="color" name="color" value="${opts.color || "#2962ff"}"></label><button class="primary">Apply</button></form>`,
  );
}
function toast(t) {
  const el = document.querySelector("#toast");
  el.textContent = t;
  el.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove("show"), 4500);
}
function modal(title, body) {
  document.querySelector("#modal-root").innerHTML =
    `<div class="backdrop"><section class="modal"><div class="modal-title"><h2>${title}</h2><button data-action="close">×</button></div>${body}</section></div>`;
  createIcons({ icons });
  document.querySelector(".backdrop").onclick = (e) => {
    if (e.target.classList.contains("backdrop")) close();
  };
}
function close() {
  document.querySelector("#modal-root").innerHTML = "";
  document.querySelector("#flyout")?.remove();
}
function chooseSymbol(s) {
  symbol = s;
  drawings = [];
  undoSnapshots = [];
  redoSnapshots = [];
  setTool("cursor");
  document.querySelector(".symbol").textContent = s.toUpperCase();
  document.querySelector("#detail-symbol").textContent = s.toUpperCase();
  document.querySelector("#instrument").textContent =
    `${s.toUpperCase()} / U.S. Dollar · ${document.querySelector("#interval").textContent} · Bitstamp`;
  document.querySelector("#detail-name").textContent =
    `${s.toUpperCase()} · BITSTAMP`;
  close();
  load();
}
function setTool(t) {
  close();
  previewPoint = null;
  tool = t;
  first = null;
  second = null;
  third = null;
  document
    .querySelectorAll(".drawing-tools button")
    .forEach((b) =>
      b.classList.toggle(
        "selected",
        b.dataset.action === t ||
          (b.dataset.action === "lines-menu" &&
            drawingGroups.some((g) => g[1].some((x) => x[0] === t))) ||
          (b.dataset.action === "fib-menu" &&
            fibGroups.some((g) => g[1].some((x) => x[0] === t))),
      ),
    );
  selectedDrawing = -1;
  renderSelectionToolbar();
  renderDrawings();
  host.style.cursor = t === "cursor" ? "default" : "crosshair";
  document.querySelector("#drawings").style.pointerEvents = [
    "cursor",
    "zoom",
  ].includes(t)
    ? "none"
    : "auto";
  document.querySelector("#draw-hint").textContent =
    t === "cursor"
      ? ""
      : `${t.toUpperCase()} · ${onePoint.has(t) ? "Click to place" : fourPoint.has(t) ? "Click four points" : threePoint.has(t) ? "Click three points" : "Click two points"} · Esc to exit`;
}
function saveDraw() {
  localStorage.setItem("cw-drawings", JSON.stringify(drawings));
  renderDrawings();
}

function point(e) {
  const r = svg.getBoundingClientRect();
  let x = e.clientX - r.left,
    y = e.clientY - r.top;
  const time = chart.timeScale().coordinateToLogical(x),
    price = series.coordinateToPrice(y);
  if (time === null || price === null) return null;
  return { time: snap ? Math.round(time) : time, price };
}
function coords(p) {
  return {
    x: chart.timeScale().logicalToCoordinate(p.time),
    y: series.priceToCoordinate(p.price),
  };
}
function renderDrawings() {
  if (!series) return;
  const latest = (replaying ? data.slice(0, replayIndex) : data).at(-1);
  if (latest) {
    const y = series.priceToCoordinate(latest.close);
    const paneH = chart.panes()[0]?.getHeight() || svg.clientHeight;
    const visible = y != null && y > 0 && y < paneH;
    lastPriceMarker.hidden = !visible;
    if (visible) {
      lastPriceMarker.style.top = y - 10 + "px";
      lastPriceMarker.style.setProperty(
        "--price-color",
        latest.close >= latest.open ? "#089981" : "#f23645",
      );
      const seconds = Math.max(
        0,
        Math.floor(latest.time + step - Date.now() / 1000),
      );
      lastPriceMarker.innerHTML = `<span>${symbol.toUpperCase()}</span><b>${latest.close.toLocaleString("en-US", { maximumFractionDigits: 2 })}<small>${live ? String(Math.floor(seconds / 60)).padStart(2, "0") + ":" + String(seconds % 60).padStart(2, "0") : "DEMO"}</small></b>`;
    }
  }
  const paneHeight = chart.panes()[0]?.getHeight() || svg.clientHeight;
  const width = Math.max(0, svg.clientWidth - 75);
  const temp =
    first && previewPoint
      ? {
          type: tool,
          a: first,
          b: second || previewPoint,
          ...(second ? { c: third || previewPoint } : {}),
          ...(third ? { d: previewPoint } : {}),
        }
      : null;
  const shapes = drawings
    .map(
      (d, i) =>
        `<g data-drawing="${i}" class="drawing-object ${i === selectedDrawing ? "is-selected" : ""}">${drawingMarkup(d, coords, width, paneHeight, data)}</g>`,
    )
    .join("");
  const handles =
    selectedDrawing >= 0 && !hidden
      ? ["a", "b", "c", "d"]
          .filter((k) => drawings[selectedDrawing]?.[k])
          .map((k) => {
            const p = coords(drawings[selectedDrawing][k]);
            return `<circle class="drawing-handle" data-handle="${k}" cx="${p.x}" cy="${p.y}" r="5" fill="#171b26" stroke="#448aff" stroke-width="2"/>`;
          })
          .join("")
      : "";
  svg.innerHTML = `<defs><clipPath id="price-clip"><rect width="${width}" height="${paneHeight}"/></clipPath></defs><g clip-path="url(#price-clip)">${hidden ? "" : shapes}${temp ? `<g class="drawing-preview">${drawingMarkup(temp, coords, width, paneHeight, data)}</g>` : ""}${handles}</g>`;
}
function renderSelectionToolbar() {
  const d = drawings[selectedDrawing];
  drawingToolbar.hidden = !d;
  drawingToolbar.innerHTML = d
    ? `<span>${d.type}</span><input aria-label="Drawing color" type="color" value="${d.color || "#638cff"}" id="drawing-color"><select aria-label="Drawing thickness" id="drawing-width">${[1, 2, 3, 4].map((n) => `<option ${Math.round(d.width || 1.5) === n ? "selected" : ""}>${n}</option>`).join("")}</select><button data-drawing-action="duplicate" title="Duplicate drawing">${icon("plus")}</button><button data-drawing-action="delete" title="Delete selected drawing">${icon("trash-2")}</button>`
    : "";
  createIcons({ icons });
}
function finishDrawing(d) {
  checkpoint();
  drawings.push(d);
  redo = [];
  saveDraw();
  setTool("cursor");
  selectedDrawing = drawings.length - 1;
  renderSelectionToolbar();
  renderDrawings();
}
svg.addEventListener("click", (e) => {
  if (suppressClick) {
    suppressClick = false;
    return;
  }
  const object = e.target.closest("[data-drawing]");
  if (tool === "cursor") {
    if (object) {
      selectedDrawing = +object.dataset.drawing;
      renderSelectionToolbar();
      renderDrawings();
    }
    return;
  }
  if (locked) return toast("Drawings are locked");
  const p = point(e);
  if (!p || e.offsetY > chart.panes()[0].getHeight()) return;
  if (onePoint.has(tool)) {
    if (
      [
        "text",
        "note",
        "price-note",
        "callout",
        "comment",
        "price-label",
        "signpost",
      ].includes(tool)
    ) {
      const type = tool;
      modal(
        "Text & notes",
        `<form id="annotation-form"><label>Text<input name="text" maxlength="120" required value="${["price-note", "price-label"].includes(type) ? p.price.toFixed(2) : ""}"></label><button class="primary">Add to chart</button></form>`,
      );
      document.querySelector("#annotation-form").onsubmit = (e) => {
        e.preventDefault();
        const text = new FormData(e.target).get("text");
        finishDrawing({ type, a: p, text });
      };
      return;
    }
    finishDrawing({ type: tool, a: p, text: tool === "emoji" ? "★" : "" });
    return;
  }
  if (!first) {
    first = p;
    return;
  }
  if ((threePoint.has(tool) || fourPoint.has(tool)) && !second) {
    second = p;
    return;
  }
  if (fourPoint.has(tool) && !third) {
    third = p;
    return;
  }
  finishDrawing({
    type: tool,
    a: first,
    b: second || p,
    ...(second ? { c: third || p } : {}),
    ...(third ? { d: p } : {}),
  });
});
svg.addEventListener("pointerdown", (e) => {
  if (tool !== "cursor") return;
  const object = e.target.closest("[data-drawing]"),
    handle = e.target.dataset.handle;
  if (!object && !handle) return;
  if (locked) {
    toast("Drawings are locked");
    return;
  }
  if (object) selectedDrawing = +object.dataset.drawing;
  const start = point(e);
  if (!start) return;
  dragState = {
    start,
    original: structuredClone(drawings[selectedDrawing]),
    handle,
    moved: false,
    snapshot: structuredClone(drawings),
  };
  svg.setPointerCapture(e.pointerId);
  chart.applyOptions({ handleScroll: false, handleScale: false });
  e.preventDefault();
  renderSelectionToolbar();
  renderDrawings();
});
svg.addEventListener("pointermove", (e) => {
  const p = point(e);
  if (!p) return;
  if (dragState) {
    const dt = p.time - dragState.start.time,
      dp = p.price - dragState.start.price;
    if (Math.abs(dt) > 0.02 || Math.abs(dp) > 0.01) dragState.moved = true;
    const d = structuredClone(dragState.original);
    if (dragState.handle) d[dragState.handle] = p;
    else
      for (const k of ["a", "b", "c", "d"])
        if (d[k]) d[k] = { time: d[k].time + dt, price: d[k].price + dp };
    drawings[selectedDrawing] = d;
    renderDrawings();
    return;
  }
  if (first) {
    previewPoint = p;
    renderDrawings();
  }
});
function endDrag(e) {
  if (!dragState) return;
  suppressClick = dragState.moved;
  if (dragState.moved) {
    undoSnapshots.push(dragState.snapshot);
    redoSnapshots = [];
  }
  dragState = null;
  chart.applyOptions({ handleScroll: true, handleScale: true });
  if (svg.hasPointerCapture(e.pointerId))
    svg.releasePointerCapture(e.pointerId);
  saveDraw();
}
svg.addEventListener("pointerup", endDrag);
svg.addEventListener("pointercancel", endDrag);
// Blank canvas clicks deselect a drawing and leave normal pan/zoom active.
host.addEventListener("pointerdown", () => {
  if (tool === "cursor") {
    selectedDrawing = -1;
    renderSelectionToolbar();
    renderDrawings();
  }
});
function queueOverlayLayout() {
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      renderDrawings();
      studyLabels();
    }),
  );
}
chart.timeScale().subscribeVisibleLogicalRangeChange(queueOverlayLayout);
host.addEventListener("pointerup", queueOverlayLayout);
new ResizeObserver(() => {
  renderDrawings();
  studyLabels();
}).observe(host);
chart.subscribeClick(() => studyLabels());
chart.subscribeCrosshairMove((p) => {
  const d = p.seriesData.get(series);
  if (!p.point) {
    updateQuote((replaying ? data.slice(0, replayIndex) : data).at(-1));
    return;
  }
  if (d && "close" in d) {
    const full = data.find((x) => x.time === d.time);
    if (full) updateQuote(full, true);
  }
});
function panel(name) {
  const p = document.querySelector("#bottom-panel");
  p.hidden = false;
  document
    .querySelectorAll("[data-panel]")
    .forEach((b) => b.classList.toggle("active", b.dataset.panel === name));
  if (name === "screener")
    p.innerHTML =
      "<h3>Crypto Screener</h3><p>Choose a market to load its OHLC candles.</p>" +
      watch
        .filter((x) => x[1])
        .map((x) => `<button data-symbol="${x[1]}">${x[0]}</button>`)
        .join("");
  if (name === "editor")
    p.innerHTML =
      "<h3>Indicator parameters</h3><p>Built-in studies use standard periods. Pine Script execution is not supported.</p>" +
      indicatorCatalog
        .map((d) => d[0])
        .map((n) => `<button data-study="${n}">${n}</button>`)
        .join("");
  if (name === "strategy")
    p.innerHTML =
      "<h3>Strategy Tester</h3><p>No strategy engine is installed. Chart replay is available from the top toolbar; historical performance is not simulated.</p>";
  if (name === "trading")
    p.innerHTML =
      '<h3>Paper Trading · local simulation</h3><p>No real orders are sent.</p><button data-action="trade">New paper order</button><div id="orders"></div>';
}
let orders = JSON.parse(localStorage.getItem("cw-orders") || "[]");
const actions = {
  symbol: () =>
    modal(
      "Symbol search",
      `<input id="symbol-search" placeholder="Search BTC, ETH, SOL…" autofocus><div id="symbol-results">${watch
        .filter((x) => x[1])
        .map(
          (x) =>
            `<button class="search-result" data-symbol="${x[1]}">${x[0]}<small>BITSTAMP · Crypto</small></button>`,
        )
        .join("")}</div>`,
    ),
  compare: () =>
    toast(
      "Use the watchlist to switch markets. Multi-symbol overlays are not implemented.",
    ),
  interval: () =>
    modal(
      "Chart interval",
      `<div class="options">${[
        ["1m", 60],
        ["5m", 300],
        ["15m", 900],
        ["30m", 1800],
        ["1h", 3600],
        ["4h", 14400],
        ["1D", 86400],
        ["1W", 604800],
      ]
        .map(
          ([l, s]) =>
            `<button data-step="${s}" data-label="${l}">${l}</button>`,
        )
        .join("")}</div>`,
    ),
  style: () => showStyles(),
  indicators: () => showIndicators(),
  alert: () =>
    modal(
      "Create price alert",
      '<p>Checked while this page is open, against the latest available candle.</p><form id="alert-form"><label>Price crosses above<input name="price" type="number" step="any" required min="0"></label><button class="primary">Create alert</button></form>',
    ),
  alerts: () =>
    modal(
      "Alerts",
      alerts.length
        ? alerts
            .map(
              (a) =>
                `<p>${a.symbol.toUpperCase()} above ${a.price} · ${a.fired ? "Triggered" : "Active"}</p>`,
            )
            .join("")
        : "<p>No alerts. Create one from the top toolbar.</p>",
    ),
  replay: () => {
    replaying = !replaying;
    replayIndex = Math.max(2, data.length - 80);
    toast(
      replaying ? "Replay started · one candle per second" : "Replay stopped",
    );
    setData();
  },
  undo: () => {
    if (!undoSnapshots.length) return;
    redoSnapshots.push(structuredClone(drawings));
    drawings = undoSnapshots.pop();
    selectedDrawing = -1;
    saveDraw();
    renderSelectionToolbar();
  },
  redo: () => {
    if (!redoSnapshots.length) return;
    undoSnapshots.push(structuredClone(drawings));
    drawings = redoSnapshots.pop();
    selectedDrawing = -1;
    saveDraw();
    renderSelectionToolbar();
  },
  clear: () => {
    checkpoint();
    drawings = [];
    selectedDrawing = -1;
    saveDraw();
    renderSelectionToolbar();
  },
  hide: () => {
    hidden = !hidden;
    renderDrawings();
  },
  lock: () => {
    locked = !locked;
    toast(locked ? "Drawings locked" : "Drawings unlocked");
  },
  snap: () => {
    snap = !snap;
    toast(`Candle snapping ${snap ? "on" : "off"}`);
  },
  zoom: () => zoom(0.8),
  zoomout: () => zoom(1.25),
  fit: () => chart.timeScale().fitContent(),
  auto: () => series.priceScale().applyOptions({ autoScale: true }),
  left: () => scroll(-20),
  right: () => scroll(20),
  log: () => {
    const b = document.querySelector("#log");
    b.classList.toggle("selected");
    series
      .priceScale()
      .applyOptions({ mode: b.classList.contains("selected") ? 1 : 0 });
  },
  watch: () =>
    document.querySelector(".watchlist").classList.toggle("collapsed"),
  fullscreen: () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else
      document.documentElement
        .requestFullscreen()
        .catch(() => toast("Fullscreen unavailable"));
  },
  save: () => {
    localStorage.setItem(
      "cw-layout",
      JSON.stringify({ symbol, step, mode, studies: [...studies.keys()] }),
    );
    toast("Layout saved on this browser");
  },
  settings: () =>
    modal(
      "Chart settings",
      '<label>Chart background<input type="color" id="bg-color" value="#171b26"></label><label><input type="checkbox" id="grid-toggle" checked> Show grid</label><p class="muted">Drag to pan · scroll to zoom · double-click price scale to reset.</p>',
    ),
  screenshot: () => {
    const a = document.createElement("a");
    a.download = `${symbol}-chart.png`;
    a.href = chart.takeScreenshot().toDataURL();
    a.click();
    toast("Chart image downloaded (drawings are a separate overlay)");
  },
  trade: () =>
    modal(
      "Paper order",
      `<p>Local simulation · ${symbol.toUpperCase()} · ${data.at(-1).close.toFixed(2)} USD</p><form id="trade-form"><label>Side<select name="side"><option>Buy</option><option>Sell</option></select></label><label>Quantity<input name="quantity" type="number" min="0.000001" step="any" value="0.01" required></label><button class="primary">Place paper order</button></form>`,
    ),
  panel: () => {
    const p = document.querySelector("#bottom-panel");
    if (p.hidden) panel("screener");
    else p.hidden = true;
  },
  objects: () =>
    modal(
      "Object tree",
      drawings.length
        ? drawings
            .map(
              (d, i) =>
                `<p>${i + 1}. ${d.type} <button data-delete="${i}">Delete</button></p>`,
            )
            .join("")
        : "<p>No drawings. Select a tool on the left.</p>",
    ),
  favorites: () => {
    actions.indicators();
  },
  calendar: () =>
    modal("Calendar", "<p>Economic calendar data is not connected.</p>"),
  connection: () =>
    modal(
      "Data connection",
      `<p>${live ? "Bitstamp OHLC · refreshing every 30 seconds" : "Live feed unavailable; demo or last received candles displayed."}</p><p>No tick-by-tick or exchange order-book feed is connected.</p>`,
    ),
  notes: () =>
    modal(
      "Chart notes",
      '<textarea id="notes" placeholder="Private notes stored in this browser"></textarea>',
    ),
  help: () =>
    modal(
      "Chart Workspace",
      "<p>Scroll to zoom, drag to pan. Select a drawing tool, then click one or two points. Escape returns to crosshair; Ctrl/Cmd+Z undoes a drawing.</p><p>Indicators: SMA, EMA, Bollinger Bands, RSI and VWAP. Layouts, notes, drawings and paper orders are stored locally.</p><p>This is an independent implementation, not TradingView. Pine Script, brokerage execution and the full TradingView tool catalog are not included.</p>",
    ),
  "watch-options": () =>
    toast(
      "Click a market to load candles. Watchlist quotes are shown only for the active market.",
    ),
};
function zoom(k) {
  const r = chart.timeScale().getVisibleLogicalRange();
  if (r) {
    const m = (r.from + r.to) / 2,
      w = ((r.to - r.from) * k) / 2;
    chart.timeScale().setVisibleLogicalRange({ from: m - w, to: m + w });
  }
}
function scroll(n) {
  const r = chart.timeScale().getVisibleLogicalRange();
  if (r)
    chart
      .timeScale()
      .setVisibleLogicalRange({ from: r.from + n, to: r.to + n });
}
let alerts = JSON.parse(localStorage.getItem("cw-alerts") || "[]");
setInterval(() => {
  if (replaying) {
    replayIndex++;
    if (replayIndex > data.length) {
      replaying = false;
      toast("Replay complete");
    }
    setData();
  }
  for (const a of alerts)
    if (
      !a.fired &&
      a.symbol === symbol &&
      live &&
      data.at(-1).close >= a.price
    ) {
      a.fired = true;
      toast(`Price alert: ${symbol.toUpperCase()} above ${a.price}`);
      localStorage.setItem("cw-alerts", JSON.stringify(alerts));
    }
  document.querySelector("#clock").textContent =
    new Date().toLocaleTimeString("en-GB", { timeZone: "UTC" }) + " UTC";
}, 1000);
document.addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  if (b.dataset.action) {
    const a = b.dataset.action;
    if (a === "close") close();
    else if (actions[a]) actions[a]();
    else setTool(a);
    if (a === "notes")
      document.querySelector("#notes").value =
        localStorage.getItem("cw-notes") || "";
  }
  if (b.dataset.symbol) chooseSymbol(b.dataset.symbol);
  if (b.dataset.step) {
    step = +b.dataset.step;
    document.querySelector("#interval").textContent = b.dataset.label;
    document.querySelector("#instrument").textContent =
      `${symbol.toUpperCase()} / U.S. Dollar · ${b.dataset.label} · Bitstamp`;
    drawings = [];
    undoSnapshots = [];
    redoSnapshots = [];
    setTool("cursor");
    replaying = false;
    close();
    load();
  }
  if (b.dataset.draw) setTool(b.dataset.draw);
  if (b.dataset.style) {
    mode = b.dataset.style;
    createSeries();
    close();
  }
  if (b.dataset.study) {
    addStudy(b.dataset.study);
    if (document.querySelector(".indicator-modal")) {
      renderIndicatorResults();
      toast("Indicator added to chart");
    } else close();
  }
  if (b.dataset.removeStudy) {
    removeStudy(b.dataset.removeStudy);
  }
  if (b.dataset.studySettings) studySettings(b.dataset.studySettings);
  if (b.dataset.toggleStudy) {
    const n = b.dataset.toggleStudy;
    if (hiddenStudies.has(n)) hiddenStudies.delete(n);
    else hiddenStudies.add(n);
    studies
      .get(n)
      .forEach((s) => s.applyOptions({ visible: !hiddenStudies.has(n) }));
    studyLabels();
  }
  if (b.dataset.drawingAction) {
    if (locked) return toast("Drawings are locked");
    checkpoint();
    if (b.dataset.drawingAction === "delete") {
      drawings.splice(selectedDrawing, 1);
      selectedDrawing = -1;
    } else {
      const d = structuredClone(drawings[selectedDrawing]);
      for (const k of ["a", "b", "c", "d"]) if (d[k]) d[k].time += 3;
      drawings.push(d);
      selectedDrawing = drawings.length - 1;
    }
    saveDraw();
    renderSelectionToolbar();
  }
  if (b.dataset.panel) panel(b.dataset.panel);
  if (b.dataset.delete) {
    checkpoint();
    drawings.splice(+b.dataset.delete, 1);
    selectedDrawing = -1;
    renderSelectionToolbar();
    saveDraw();
    actions.objects();
  }
  if (b.dataset.range) {
    const days = {
      "1D": 1,
      "5D": 5,
      "1M": 30,
      "3M": 90,
      "6M": 180,
      YTD: 300,
      "1Y": 365,
      "5Y": 1825,
    };
    if (b.dataset.range === "All") chart.timeScale().fitContent();
    else {
      const n = Math.min(data.length, (days[b.dataset.range] * 86400) / step);
      chart
        .timeScale()
        .setVisibleLogicalRange({ from: data.length - n, to: data.length + 3 });
    }
  }
});
document.addEventListener("input", (e) => {
  if (e.target.id === "symbol-search")
    document
      .querySelectorAll("[data-symbol].search-result")
      .forEach(
        (b) =>
          (b.hidden = !b.textContent
            .toLowerCase()
            .includes(e.target.value.toLowerCase())),
      );
  if (e.target.id === "drawing-color" || e.target.id === "drawing-width") {
    if (selectedDrawing >= 0) {
      if (locked) return toast("Drawings are locked");
      checkpoint();
      drawings[selectedDrawing][
        e.target.id === "drawing-color" ? "color" : "width"
      ] = e.target.id === "drawing-color" ? e.target.value : +e.target.value;
      saveDraw();
    }
  }
  if (e.target.id === "bg-color")
    chart.applyOptions({
      layout: { background: { type: ColorType.Solid, color: e.target.value } },
    });
  if (e.target.id === "grid-toggle")
    chart.applyOptions({
      grid: {
        vertLines: { visible: e.target.checked },
        horzLines: { visible: e.target.checked },
      },
    });
  if (e.target.id === "notes") localStorage.setItem("cw-notes", e.target.value);
});
document.addEventListener("submit", (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  if (e.target.id === "study-settings-form") {
    const name = e.target.dataset.name;
    const opts = Object.fromEntries(f);
    if (opts.period) opts.period = +opts.period;
    studyOptions[name] = opts;
    localStorage.setItem("cw-study-options", JSON.stringify(studyOptions));
    studies.get(name).forEach((s) => s.applyOptions({ color: opts.color }));
    setData();
    studyLabels();
    close();
  }
  if (e.target.id === "trade-form") {
    orders.push({
      symbol,
      side: f.get("side"),
      quantity: +f.get("quantity"),
      price: data.at(-1).close,
      time: new Date().toISOString(),
      demo: !live,
    });
    localStorage.setItem("cw-orders", JSON.stringify(orders));
    close();
    panel("trading");
    document.querySelector("#orders").textContent = orders
      .map(
        (o) =>
          `${o.side} ${o.quantity} ${o.symbol.toUpperCase()} @ ${o.price.toFixed(2)}${o.demo ? " (demo price)" : ""}`,
      )
      .join(" | ");
    toast("Paper order recorded locally");
  }
  if (e.target.id === "alert-form") {
    alerts.push({ symbol, price: +f.get("price"), fired: false });
    localStorage.setItem("cw-alerts", JSON.stringify(alerts));
    close();
    toast("Price alert created");
  }
});
document.addEventListener("keydown", (e) => {
  if (
    ["Delete", "Backspace"].includes(e.key) &&
    selectedDrawing >= 0 &&
    !["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)
  ) {
    e.preventDefault();
    if (locked) return;
    checkpoint();
    drawings.splice(selectedDrawing, 1);
    selectedDrawing = -1;
    saveDraw();
    renderSelectionToolbar();
  }
  if (e.key === "Escape") {
    close();
    setTool("cursor");
  }
  if (
    (e.ctrlKey || e.metaKey) &&
    e.key === "z" &&
    !["INPUT", "TEXTAREA"].includes(e.target.tagName)
  ) {
    e.preventDefault();
    actions.undo();
  }
});
try {
  const l = JSON.parse(localStorage.getItem("cw-layout"));
  if (l) {
    symbol = l.symbol;
    step = l.step;
    mode = l.mode;
    document.querySelector(".symbol").textContent = symbol.toUpperCase();
    document.querySelector("#interval").textContent =
      step >= 3600 ? `${step / 3600}h` : `${step / 60}m`;
    createSeries();
    l.studies.forEach(addStudy);
    load();
  }
} catch {}

function flyout(title, content, left = 64) {
  close();
  const el = document.createElement("section");
  el.id = "flyout";
  el.className = "flyout";
  el.style.left = left + "px";
  el.innerHTML = `<div class="flyout-heading">${title}<button data-action="close" aria-label="Close menu">×</button></div>${content}`;
  document.body.append(el);
  createIcons({ icons });
}
function showDrawingMenu(groups) {
  flyout(
    "Drawing tools",
    groups
      .map(
        ([title, items]) =>
          `<div class="menu-group">${title}</div>${items.map(([id, name, key]) => `<button class="menu-item ${tool === id ? "chosen" : ""}" data-draw="${id}">${icon(title === "GANN" ? "layout-grid" : title === "FIBONACCI" ? "sliders-horizontal" : "move-up-right")}<span>${name}</span><small>${key || ""}</small></button>`).join("")}`,
      )
      .join(""),
  );
}
actions["text-menu"] = () => showDrawingMenu(annotationGroups);
actions["projection-menu"] = () => showDrawingMenu(projectionGroups);
actions["lines-menu"] = () => showDrawingMenu(drawingGroups);
actions["fib-menu"] = () => showDrawingMenu(fibGroups);
function showStyles() {
  const button = document.querySelector('[data-action="style"]');
  flyout(
    "Chart type",
    chartTypes
      .map(
        ([id, name]) =>
          `<button class="menu-item ${mode === id ? "chosen" : ""}" data-style="${id}">${icon(["line", "markers", "step"].includes(id) ? "chart-no-axes-combined" : "candlestick-chart")}<span>${name}</span>${mode === id ? "<small>✓</small>" : ""}</button>`,
      )
      .join("") +
      `<div class="menu-group">Requires additional market data / renderer</div>${["Volume candles", "HLC area", "Volume footprint", "Time price opportunity", "Session volume profile"].map((n) => `<button class="menu-item" disabled title="Not implemented">${n}<small>Unavailable</small></button>`).join("")}`,
    Math.min(button.getBoundingClientRect().left, innerWidth - 340),
  );
}
let indicatorSection = "Technicals",
  indicatorTab = "Indicators";
function showIndicators() {
  modal(
    "Indicators, metrics, and strategies",
    `<div class="indicator-search">${icon("zoom-in")}<input id="study-search" placeholder="Search" aria-label="Search indicators"></div><div class="indicator-browser"><nav>${[
      ["PERSONAL", ["My scripts", "Purchased"]],
      ["BUILT-IN", ["Technicals", "Fundamentals"]],
      ["COMMUNITY", ["Editors’ picks", "Top", "Trending", "Marketplace"]],
    ]
      .map(
        ([group, items]) =>
          `<small>${group}</small>${items.map((n) => `<button data-section="${n}" class="${n === indicatorSection ? "active" : ""}">${icon(n === "Technicals" ? "chart-no-axes-combined" : "layers")}${n}</button>`).join("")}`,
      )
      .join(
        "",
      )}</nav><div class="indicator-content"><div class="indicator-tabs">${(indicatorSection === "Fundamentals" ? ["Financials", "Network", "Ownership", "Social"] : ["Indicators", "Strategies", "Profiles", "Patterns", "Options"]).map((n) => `<button data-indicator-tab="${n}" class="${n === indicatorTab ? "active" : ""}">${n}</button>`).join("")}</div><div id="indicator-results"></div></div></div>`,
  );
  document.querySelector(".modal").classList.add("indicator-modal");
  renderIndicatorResults();
  createIcons({ icons });
}
function renderIndicatorResults() {
  const target = document.querySelector("#indicator-results");
  if (!target) return;
  if (indicatorSection !== "Technicals" || indicatorTab !== "Indicators") {
    target.innerHTML = `<div class="catalog-empty"><h3>${indicatorSection} · ${indicatorTab}</h3><p>${indicatorSection === "My scripts" ? "Pine Script is not supported. Built-in calculations are available under Technicals." : "This catalog is not connected. Available local indicators are under Technicals → Indicators."}</p><button data-section="Technicals" data-indicator-tab="Indicators">Browse built-in indicators</button></div>`;
    return;
  }
  const q = (
    document.querySelector("#study-search")?.value || ""
  ).toLowerCase();
  const available = indicatorCatalog.filter((n) =>
    (n[0] + " " + n[1]).toLowerCase().includes(q),
  );
  const unavailable = unavailableIndicators.filter((n) =>
    n.toLowerCase().includes(q),
  );
  target.innerHTML =
    '<div class="script-heading">SCRIPT NAME <span>LOCAL BUILT-IN</span></div>' +
    available
      .map(
        ([n, desc]) =>
          `<button class="search-result" data-study="${n}" title="${desc}"><span>${n}<small>${desc}</small></span><em>${studies.has(n) ? "Added" : "+"}</em></button>`,
      )
      .join("") +
    (unavailable.length
      ? '<div class="script-heading">NOT IMPLEMENTED / ADDITIONAL DATA REQUIRED</div>' +
        unavailable
          .map(
            (n) =>
              `<button class="search-result unavailable" disabled>${n}<small>Unavailable</small></button>`,
          )
          .join("")
      : "") +
    (!available.length && !unavailable.length
      ? '<p class="catalog-empty">No matching indicators</p>'
      : "");
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (b?.dataset.section) {
    indicatorSection = b.dataset.section;
    indicatorTab =
      indicatorSection === "Fundamentals" ? "Financials" : "Indicators";
  }
  if (b?.dataset.indicatorTab) indicatorTab = b.dataset.indicatorTab;
  if (b?.dataset.section || b?.dataset.indicatorTab) showIndicators();
  if (
    e.target.closest("header,.chart-shell,.watchlist") &&
    !e.target.closest('[data-action="style"],[data-action="interval"]')
  )
    document.querySelector("#flyout")?.remove();
});
document.addEventListener("input", (e) => {
  if (e.target.id === "study-search") renderIndicatorResults();
});
document.addEventListener("keydown", (e) => {
  if (!e.altKey || ["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName))
    return;
  const keys = {
    t: "trend",
    h: "horizontal",
    j: "horizontal-ray",
    v: "vertical",
    c: "crossline",
    f: "fib",
  };
  if (keys[e.key.toLowerCase()]) {
    e.preventDefault();
    setTool(keys[e.key.toLowerCase()]);
  }
});

actions.interval = () => {
  const rect = document.querySelector("#interval").getBoundingClientRect();
  flyout(
    "Time interval",
    `<div class="menu-group">MINUTES</div>${[
      [60, "1m"],
      [180, "3m"],
      [300, "5m"],
      [900, "15m"],
      [1800, "30m"],
    ]
      .map(
        ([v, l]) =>
          `<button class="menu-item ${step === v ? "chosen" : ""}" data-step="${v}" data-label="${l}">${v / 60} minutes</button>`,
      )
      .join("")}<div class="menu-group">HOURS</div>${[
      [3600, "1h"],
      [7200, "2h"],
      [14400, "4h"],
      [21600, "6h"],
      [43200, "12h"],
    ]
      .map(
        ([v, l]) =>
          `<button class="menu-item ${step === v ? "chosen" : ""}" data-step="${v}" data-label="${l}">${v / 3600} hours</button>`,
      )
      .join("")}<div class="menu-group">DAYS</div>${[
      [86400, "1D"],
      [259200, "3D"],
    ]
      .map(
        ([v, l]) =>
          `<button class="menu-item ${step === v ? "chosen" : ""}" data-step="${v}" data-label="${l}">${l}</button>`,
      )
      .join(
        "",
      )}<p class="muted">Intervals supported by the Bitstamp OHLC feed. Tick and second data are unavailable.</p>`,
    Math.min(rect.left, innerWidth - 340),
  );
};

setInterval(() => {
  const next = chart
    .panes()
    .map((p) => p.getHeight())
    .join(",");
  if (next !== paneSizeSignature) {
    paneSizeSignature = next;
    studyLabels();
  }
  renderDrawings();
}, 1000);
