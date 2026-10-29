export function demo(step = 900, count = 400) {
  let p = 80500,
    seed = 42;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const end = Math.floor(Date.now() / 1000 / step) * step;
  return Array.from({ length: count }, (_, i) => {
    const open = p;
    const impulse = i > count - 50 && i < count - 45 ? -350 : 0;
    p = Math.max(100, open + (rand() - 0.49) * 230 + impulse);
    return {
      time: end - (count - 1 - i) * step,
      open,
      close: p,
      high: Math.max(open, p) + rand() * 120,
      low: Math.min(open, p) - rand() * 120,
      volume: rand() * 70 + 10,
    };
  });
}
export function sma(data, n = 20) {
  return data.flatMap((d, i) =>
    i < n - 1
      ? []
      : [
          {
            time: d.time,
            value:
              data.slice(i - n + 1, i + 1).reduce((s, x) => s + x.close, 0) / n,
          },
        ],
  );
}
export function ema(data, n = 20) {
  let e = data[0]?.close;
  return data.map((d) => ({
    time: d.time,
    value: (e = (d.close * 2) / (n + 1) + e * (1 - 2 / (n + 1))),
  }));
}
export function rsi(data, n = 14) {
  let gain = 0,
    loss = 0;
  return data.flatMap((d, i) => {
    if (!i) return [];
    const delta = d.close - data[i - 1].close;
    if (i <= n) {
      gain += Math.max(delta, 0) / n;
      loss += Math.max(-delta, 0) / n;
    } else {
      gain = (gain * (n - 1) + Math.max(delta, 0)) / n;
      loss = (loss * (n - 1) + Math.max(-delta, 0)) / n;
    }
    return i < n
      ? []
      : [
          {
            time: d.time,
            value:
              loss === 0
                ? gain === 0
                  ? 50
                  : 100
                : 100 - 100 / (1 + gain / loss),
          },
        ];
  });
}
export function bands(data, n = 20) {
  return sma(data, n).map((d, i) => {
    const std = Math.sqrt(
      data.slice(i, i + n).reduce((s, x) => s + (x.close - d.value) ** 2, 0) /
        n,
    );
    return { ...d, upper: d.value + 2 * std, lower: d.value - 2 * std };
  });
}
