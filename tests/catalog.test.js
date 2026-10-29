import { test } from "node:test";
import assert from "node:assert/strict";
import {
  computeStudy,
  indicatorCatalog,
  heikinAshi,
} from "../src/indicators.js";
import { drawingMarkup, drawingGroups, fibGroups } from "../src/drawing.js";
import { demo } from "../src/data.js";
test("all built-in studies return finite ordered points", () => {
  const ds = demo(86400);
  for (const [name] of indicatorCatalog) {
    const result = computeStudy(name, ds, 86400);
    assert.ok(result.length > 0, name);
    for (const values of result) {
      assert.ok(values.length > 0, name);
      assert.ok(
        values.every(
          (d, i) =>
            Number.isFinite(d.value) && (!i || d.time > values[i - 1].time),
        ),
        name,
      );
    }
  }
});
test("MACD equals zero on a constant series, stochastic handles a flat range", () => {
  const ds = Array.from({ length: 100 }, (_, time) => ({
    time,
    open: 100,
    high: 100,
    low: 100,
    close: 100,
    volume: 10,
  }));
  assert.ok(
    computeStudy("MACD", ds)
      .flat()
      .every((d) => Math.abs(d.value) < 1e-8),
  );
  assert.ok(computeStudy("Stochastic", ds)[0].every((d) => d.value === 50));
  assert.ok(
    computeStudy("Average true range", ds)[0].every((d) => d.value === 0),
  );
});
test("Heikin Ashi uses the previous synthetic candle", () => {
  const ds = [
    { time: 1, open: 10, high: 18, low: 8, close: 16 },
    { time: 2, open: 16, high: 20, low: 14, close: 18 },
  ];
  const ha = heikinAshi(ds);
  assert.equal(ha[0].close, 13);
  assert.equal(ha[1].open, (ha[0].open + ha[0].close) / 2);
  assert.equal(ha[1].close, 17);
});
test("all menu drawing geometries render finite SVG", () => {
  const convert = (p) => ({ x: p.time * 10, y: 1000 - p.price * 10 });
  for (const groups of [drawingGroups, fibGroups])
    for (const [, tools] of groups)
      for (const [type] of tools) {
        const svg = drawingMarkup(
          {
            type,
            a: { time: 5, price: 70 },
            b: { time: 15, price: 80 },
            c: { time: 20, price: 65 },
          },
          convert,
          1000,
          900,
          demo(),
        );
        assert.ok(svg.includes("<"), type);
        assert.ok(!/NaN|undefined|Infinity/.test(svg), type);
      }
});
test("annotations escape markup and ray extends beyond endpoint", () => {
  const convert = (p) => ({ x: p.time, y: p.price });
  assert.ok(
    !drawingMarkup(
      { type: "text", a: { time: 1, price: 1 }, text: "<script>" },
      convert,
      800,
      600,
    ).includes("<script>"),
  );
  const ray = drawingMarkup(
    { type: "ray", a: { time: 100, price: 100 }, b: { time: 200, price: 150 } },
    convert,
    800,
    600,
  );
  assert.match(ray, /x2="800"/);
  assert.match(ray, /y2="450"/);
});
