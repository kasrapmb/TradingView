import { sma, ema, rsi, bands } from "./data.js";
const value = (d, v) => ({ time: d.time, value: v });
const rolling = (ds, n, fn) =>
  ds.flatMap((d, i) =>
    i < n - 1 ? [] : [value(d, fn(ds.slice(i - n + 1, i + 1), i))],
  );
export const indicatorCatalog = [
  ["24-hour volume", "Volume over the trailing 24 hours", "volume24", "pane"],
  ["Accumulation/distribution", "Cumulative money flow volume", "adl", "pane"],
  [
    "Arnaud Legoux moving average",
    "ALMA · 9 · offset 0.85 · sigma 6",
    "alma",
    "overlay",
  ],
  ["Aroon", "Aroon up/down · 25", "aroon", "pane"],
  ["Aroon oscillator", "Aroon up minus down · 25", "aroon-osc", "pane"],
  ["Average daily range", "Daily high minus low, SMA 14", "adr", "pane"],
  ["Average true range", "ATR · Wilder 14", "atr", "pane"],
  ["Bollinger Bands", "20 periods · 2 standard deviations", "bb", "overlay"],
  ["CCI 20", "Commodity channel index", "cci", "pane"],
  ["EMA 20", "Exponential moving average", "ema", "overlay"],
  ["MACD", "12 / 26 / 9", "macd", "pane"],
  ["OBV", "On balance volume", "obv", "pane"],
  ["Rate of change", "ROC · 12", "roc", "pane"],
  ["RSI 14", "Relative strength index", "rsi", "pane"],
  ["SMA 20", "Simple moving average", "sma", "overlay"],
  ["Stochastic", "%K 14 · %D 3", "stoch", "pane"],
  ["Volume", "Candle traded volume", "volume", "pane"],
  ["VWAP", "Cumulative over loaded candles", "vwap", "overlay"],
  ["Williams %R", "14 periods", "williams", "pane"],
];
export const unavailableIndicators = [
  "Advance-decline line",
  "Advance-decline ratio",
  "Advance-decline ratio (bars)",
  "Auto fib extension",
  "Auto fib retracement",
  "Auto key levels",
  "Auto pitchfork",
  "Auto trendlines",
];
export function computeStudy(name, ds, step = 900) {
  const def = indicatorCatalog.find((x) => x[0] === name);
  if (!def) throw Error(`Unknown study: ${name}`);
  const id = def[2];
  if (id === "sma") return [sma(ds)];
  if (id === "ema") return [ema(ds)];
  if (id === "rsi") return [rsi(ds)];
  if (id === "bb") {
    const b = bands(ds);
    return ["upper", "value", "lower"].map((k) => b.map((d) => value(d, d[k])));
  }
  if (id === "volume") return [ds.map((d) => value(d, d.volume))];
  if (id === "volume24") {
    return [
      ds.map((d, i) =>
        value(
          d,
          ds
            .slice(0, i + 1)
            .filter((x) => x.time > d.time - 86400)
            .reduce((s, x) => s + x.volume, 0),
        ),
      ),
    ];
  }
  if (id === "obv") {
    let v = 0;
    return [
      ds.map((d, i) =>
        value(
          d,
          (v += i ? Math.sign(d.close - ds[i - 1].close) * d.volume : 0),
        ),
      ),
    ];
  }
  if (id === "adl") {
    let v = 0;
    return [
      ds.map((d) =>
        value(
          d,
          (v +=
            d.high === d.low
              ? 0
              : ((2 * d.close - d.low - d.high) / (d.high - d.low)) * d.volume),
        ),
      ),
    ];
  }
  if (id === "vwap") {
    let pv = 0,
      v = 0;
    return [
      ds.map((d) => {
        pv += ((d.high + d.low + d.close) / 3) * d.volume;
        v += d.volume;
        return value(d, v ? pv / v : d.close);
      }),
    ];
  }
  if (id === "alma") {
    const n = 9,
      m = 0.85 * (n - 1),
      s = n / 6;
    const weights = Array.from({ length: n }, (_, i) =>
      Math.exp(-((i - m) ** 2) / (2 * s * s)),
    );
    const norm = weights.reduce((a, b) => a + b, 0);
    return [
      rolling(
        ds,
        n,
        (w) => w.reduce((sum, d, i) => sum + d.close * weights[i], 0) / norm,
      ),
    ];
  }
  if (id === "aroon" || id === "aroon-osc") {
    const both = rolling(ds, 26, (w) => {
      const hi = Math.max(...w.map((d) => d.high)),
        lo = Math.min(...w.map((d) => d.low));
      let up = 0,
        down = 0;
      w.forEach((d, i) => {
        if (d.high === hi) up = (i / 25) * 100;
        if (d.low === lo) down = (i / 25) * 100;
      });
      return { up, down };
    });
    return id === "aroon"
      ? ["up", "down"].map((k) => both.map((d) => value(d, d.value[k])))
      : [both.map((d) => value(d, d.value.up - d.value.down))];
  }
  if (id === "atr") {
    let avg = 0;
    return [
      ds.flatMap((d, i) => {
        const prev = ds[i - 1]?.close ?? d.close,
          tr = Math.max(
            d.high - d.low,
            Math.abs(d.high - prev),
            Math.abs(d.low - prev),
          );
        avg = i < 14 ? avg + tr / 14 : (avg * 13 + tr) / 14;
        return i < 13 ? [] : [value(d, avg)];
      }),
    ];
  }
  if (id === "adr") {
    const days = [];
    for (const d of ds) {
      const time = Math.floor(d.time / 86400) * 86400;
      let day = days.at(-1);
      if (!day || day.time !== time) {
        day = { time, high: d.high, low: d.low };
        days.push(day);
      } else {
        day.high = Math.max(day.high, d.high);
        day.low = Math.min(day.low, d.low);
      }
    }
    return [
      rolling(days, 14, (w) => w.reduce((s, d) => s + d.high - d.low, 0) / 14),
    ];
  }
  if (id === "macd") {
    const fast = ema(ds, 12),
      slow = ema(ds, 26),
      macd = ds.map((d, i) => ({ ...d, close: fast[i].value - slow[i].value })),
      signal = ema(macd, 9);
    return [
      macd.map((d) => value(d, d.close)),
      signal,
      macd.map((d, i) => value(d, d.close - signal[i].value)),
    ];
  }
  if (id === "roc")
    return [
      ds.slice(12).map((d, i) => value(d, (d.close / ds[i].close - 1) * 100)),
    ];
  if (id === "cci")
    return [
      rolling(ds, 20, (w) => {
        const tp = w.map((d) => (d.high + d.low + d.close) / 3),
          mean = tp.reduce((a, b) => a + b, 0) / 20,
          dev = tp.reduce((s, v) => s + Math.abs(v - mean), 0) / 20;
        return dev ? (tp.at(-1) - mean) / (0.015 * dev) : 0;
      }),
    ];
  if (id === "stoch" || id === "williams") {
    const k = rolling(ds, 14, (w) => {
      const hi = Math.max(...w.map((d) => d.high)),
        lo = Math.min(...w.map((d) => d.low));
      return hi === lo ? 50 : ((w.at(-1).close - lo) / (hi - lo)) * 100;
    });
    return id === "williams"
      ? [k.map((d) => value(d, d.value - 100))]
      : [k, rolling(k, 3, (w) => w.reduce((s, d) => s + d.value, 0) / 3)];
  }
  return [];
}
export function heikinAshi(ds) {
  let prev;
  return ds.map((d) => {
    const close = (d.open + d.high + d.low + d.close) / 4,
      open = prev ? (prev.open + prev.close) / 2 : (d.open + d.close) / 2;
    prev = {
      ...d,
      open,
      close,
      high: Math.max(d.high, open, close),
      low: Math.min(d.low, open, close),
    };
    return prev;
  });
}
