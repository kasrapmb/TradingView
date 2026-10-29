export const drawingGroups = [
  [
    "LINES",
    [
      ["trend", "Trendline", "Alt + T"],
      ["ray", "Ray"],
      ["info", "Info line"],
      ["extended", "Extended line"],
      ["angle", "Trend angle"],
      ["horizontal", "Horizontal line", "Alt + H"],
      ["horizontal-ray", "Horizontal ray", "Alt + J"],
      ["vertical", "Vertical line", "Alt + V"],
      ["crossline", "Crossline", "Alt + C"],
    ],
  ],
  [
    "CHANNELS",
    [
      ["parallel", "Parallel channel"],
      ["regression", "Regression trend"],
      ["flat-channel", "Flat top/bottom"],
      ["disjoint", "Disjoint channel"],
    ],
  ],
  [
    "PITCHFORKS",
    [
      ["pitchfork", "Pitchfork"],
      ["schiff", "Schiff pitchfork"],
    ],
  ],
];
export const fibGroups = [
  [
    "FIBONACCI",
    [
      ["fib", "Fib retracement", "Alt + F"],
      ["fib-extension", "Trend-based fib extension"],
      ["fib-channel", "Fib channel"],
      ["fib-time", "Fib time zone"],
      ["fib-fan", "Fib speed resistance fan"],
      ["fib-trend-time", "Trend-based fib time"],
      ["fib-circles", "Fib circles"],
      ["fib-spiral", "Fib spiral"],
      ["fib-arcs", "Fib speed resistance arcs"],
      ["fib-wedge", "Fib wedge"],
      ["pitchfan", "Pitchfan"],
    ],
  ],
  [
    "GANN",
    [
      ["gann-box", "Gann box"],
      ["gann-fixed", "Gann square fixed"],
      ["gann-square", "Gann square"],
      ["gann-fan", "Gann fan"],
    ],
  ],
];
export const onePoint = new Set([
  "horizontal",
  "horizontal-ray",
  "vertical",
  "crossline",
  "text",
  "emoji",
]);
export const fourPoint = new Set(["disjoint"]);
export const threePoint = new Set([
  "parallel",
  "pitchfork",
  "schiff",
  "fib-extension",
  "fib-channel",
  "fib-trend-time",
  "pitchfan",
]);
const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
const colors = [
  "#ef5350",
  "#ff9800",
  "#ffd54f",
  "#66bb6a",
  "#26a69a",
  "#42a5f5",
  "#ab47bc",
];
const safe = (s) => String(s).replace(/[<>&"']/g, "");
export function drawingMarkup(d, convert, width, height, candles = []) {
  const a = convert(d.a),
    b = convert(d.b || d.a),
    c = convert(d.c || d.b || d.a),
    fourth = convert(d.d || d.c || d.b || d.a);
  if (
    [a.x, a.y, b.x, b.y, c.x, c.y].some((v) => v == null || !Number.isFinite(v))
  )
    return "";
  const color = d.color || "#638cff";
  const line = (x1, y1, x2, y2, stroke = color, dash = "") =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="1.5" ${dash ? 'stroke-dasharray="5 4"' : ""}/>`;
  const text = (x, y, t, fill = color) =>
    `<text x="${x}" y="${y}" fill="${fill}" font-size="12">${safe(t)}</text>`;
  const path = (v, fill = "none") =>
    `<path d="${v}" stroke="${color}" fill="${fill}" stroke-width="1.5"/>`;
  const ray = (p, q, both = false) => {
    const dx = q.x - p.x,
      dy = q.y - p.y;
    if (Math.abs(dx) < 0.001)
      return line(p.x, both ? 0 : p.y, p.x, dy < 0 ? 0 : height);
    const t = (dx > 0 ? width - p.x : -p.x) / dx;
    const start = both
      ? {
          x: dx > 0 ? 0 : width,
          y: p.y + (((dx > 0 ? 0 : width) - p.x) * dy) / dx,
        }
      : p;
    return line(start.x, start.y, p.x + t * dx, p.y + t * dy);
  };
  if (d.type === "horizontal")
    return (
      line(0, a.y, width, a.y) + text(width - 60, a.y - 5, d.a.price.toFixed(2))
    );
  if (d.type === "horizontal-ray") return line(a.x, a.y, width, a.y);
  if (d.type === "vertical") return line(a.x, 0, a.x, height);
  if (d.type === "crossline")
    return line(0, a.y, width, a.y) + line(a.x, 0, a.x, height);
  if (d.type === "text" || d.type === "emoji") return text(a.x, a.y, d.text);
  if (d.type === "ray" || d.type === "extended")
    return ray(a, b, d.type === "extended");
  if (d.type === "rectangle")
    return `<rect x="${Math.min(a.x, b.x)}" y="${Math.min(a.y, b.y)}" width="${Math.abs(b.x - a.x)}" height="${Math.abs(b.y - a.y)}" fill="#2962ff18" stroke="${color}"/>`;
  if (d.type === "fib" || d.type === "fib-extension")
    return (d.type === "fib" ? levels : [0, 0.618, 1, 1.618, 2.618, 3.618])
      .map((v, i) => {
        const y =
          d.type === "fib" ? a.y + (b.y - a.y) * v : c.y + (b.y - a.y) * v;
        return (
          line(a.x, y, Math.max(b.x, c.x), y, colors[i % 7]) +
          text(a.x + 5, y - 5, v, colors[i % 7])
        );
      })
      .join("");
  if (d.type === "fib-time" || d.type === "fib-trend-time")
    return [0, 1, 2, 3, 5, 8, 13, 21]
      .map((v) => {
        const x = (d.type === "fib-time" ? a.x : c.x) + (b.x - a.x) * v;
        return line(x, 0, x, height) + text(x + 3, 20, v);
      })
      .join("");
  if (d.type === "fib-fan" || d.type === "gann-fan" || d.type === "pitchfan")
    return (
      d.type === "gann-fan"
        ? [0.125, 0.25, 0.5, 1, 2, 4, 8]
        : [0.236, 0.382, 0.5, 0.618, 0.786, 1]
    )
      .map((v) => ray(a, { x: b.x, y: a.y + (b.y - a.y) * v }))
      .join("");
  if (["fib-circles", "fib-arcs", "fib-wedge"].includes(d.type)) {
    const r = Math.hypot(b.x - a.x, b.y - a.y);
    return (
      [0.236, 0.382, 0.5, 0.618, 1, 1.618]
        .map((v) =>
          d.type === "fib-circles"
            ? `<circle cx="${a.x}" cy="${a.y}" r="${r * v}" fill="none" stroke="${color}"/>`
            : path(
                `M ${a.x - r * v} ${a.y} A ${r * v} ${r * v} 0 0 1 ${a.x + r * v} ${a.y}`,
              ),
        )
        .join("") + (d.type === "fib-wedge" ? line(a.x, a.y, b.x, b.y) : "")
    );
  }
  if (d.type === "fib-spiral") {
    const r = Math.hypot(b.x - a.x, b.y - a.y),
      theta = Math.atan2(b.y - a.y, b.x - a.x);
    return path(
      Array.from({ length: 241 }, (_, i) => {
        const t = (i / 240) * 4 * Math.PI,
          rr = r * Math.exp(0.306349 * (t - 4 * Math.PI));
        return `${i ? "L" : "M"} ${a.x + rr * Math.cos(t + theta)} ${a.y + rr * Math.sin(t + theta)}`;
      }).join(" "),
    );
  }
  if (["gann-box", "gann-fixed", "gann-square"].includes(d.type)) {
    let bx = b.x,
      by = b.y;
    if (d.type !== "gann-box") {
      const size = Math.max(Math.abs(b.x - a.x), Math.abs(b.y - a.y));
      bx = a.x + Math.sign(b.x - a.x || 1) * size;
      by = a.y + Math.sign(b.y - a.y || 1) * size;
    }
    return (
      [0, 0.25, 0.5, 0.75, 1]
        .map(
          (v) =>
            line(a.x + (bx - a.x) * v, a.y, a.x + (bx - a.x) * v, by) +
            line(a.x, a.y + (by - a.y) * v, bx, a.y + (by - a.y) * v),
        )
        .join("") +
      line(a.x, a.y, bx, by) +
      line(a.x, by, bx, a.y)
    );
  }
  if (d.type === "disjoint")
    return (
      line(a.x, a.y, b.x, b.y) +
      line(c.x, c.y, fourth.x, fourth.y) +
      line(
        (a.x + c.x) / 2,
        (a.y + c.y) / 2,
        (b.x + fourth.x) / 2,
        (b.y + fourth.y) / 2,
        color,
        true,
      )
    );
  if (["parallel", "flat-channel", "fib-channel"].includes(d.type)) {
    const dy = c.y - b.y,
      dx = c.x - b.x;
    const end = d.type === "flat-channel" ? { x: b.x, y: a.y } : b;
    return (
      line(a.x, a.y, end.x, end.y) +
      line(a.x + dx, a.y + dy, end.x + dx, end.y + dy) +
      line(
        a.x + dx / 2,
        a.y + dy / 2,
        end.x + dx / 2,
        end.y + dy / 2,
        color,
        true,
      ) +
      (d.type === "fib-channel"
        ? levels
            .map((v) =>
              line(
                a.x + dx * v,
                a.y + dy * v,
                end.x + dx * v,
                end.y + dy * v,
                colors[levels.indexOf(v)],
              ),
            )
            .join("")
        : "")
    );
  }
  if (d.type === "regression") {
    const start = Math.max(0, Math.ceil(Math.min(d.a.time, d.b.time))),
      end = Math.min(
        candles.length - 1,
        Math.floor(Math.max(d.a.time, d.b.time)),
      );
    const points = candles.slice(start, end + 1);
    if (points.length < 2) return line(a.x, a.y, b.x, b.y);
    const n = points.length,
      mx = (n - 1) / 2,
      my = points.reduce((s, p) => s + p.close, 0) / n;
    const denom = points.reduce((s, _, i) => s + (i - mx) ** 2, 0);
    const slope =
      points.reduce((s, p, i) => s + (i - mx) * (p.close - my), 0) / denom;
    const residual = Math.sqrt(
      points.reduce(
        (s, p, i) => s + (p.close - (my + slope * (i - mx))) ** 2,
        0,
      ) / n,
    );
    return [-2, 0, 2]
      .map((k) => {
        const p = convert({
            time: start,
            price: my - slope * mx + k * residual,
          }),
          q = convert({
            time: end,
            price: my + slope * (n - 1 - mx) + k * residual,
          });
        return line(p.x, p.y, q.x, q.y);
      })
      .join("");
  }
  if (d.type === "pitchfork" || d.type === "schiff") {
    const origin =
      d.type === "schiff" ? { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } : a;
    const mid = { x: (b.x + c.x) / 2, y: (b.y + c.y) / 2 };
    const delta = { x: mid.x - origin.x, y: mid.y - origin.y };
    return (
      ray(origin, mid) +
      ray(b, { x: b.x + delta.x, y: b.y + delta.y }) +
      ray(c, { x: c.x + delta.x, y: c.y + delta.y }) +
      line(b.x, b.y, c.x, c.y)
    );
  }
  const base = line(a.x, a.y, b.x, b.y);
  if (d.type === "angle")
    return (
      base +
      line(a.x, a.y, a.x + 70, a.y) +
      text(
        b.x,
        b.y - 10,
        `${((Math.atan2(a.y - b.y, b.x - a.x) * 180) / Math.PI).toFixed(1)}° (screen)`,
      )
    );
  if (d.type === "info" || d.type === "measure")
    return (
      base +
      text(
        b.x,
        b.y - 12,
        `${((d.b.price / d.a.price - 1) * 100).toFixed(2)}% · ${Math.abs(d.b.time - d.a.time).toFixed(0)} bars`,
      )
    );
  return base;
}
