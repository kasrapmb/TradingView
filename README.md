# Chart Workspace

An independent TradingView-inspired web chart workspace built from the supplied screenshot. Not affiliated with TradingView. This is a working subset, **not a full TradingView clone**.

## Run

Node.js 22+ and npm are required.

```sh
npm ci
npm run dev -- --port 5173
```

Production build: `npm run build`. Serve and validate it with `npm run preview`. Deploy behind a server that proxies `/api/ohlc/:symbol` to Bitstamp's `/api/v2/ohlc/:symbol/`; a static-only host needs that route separately. Vite development and preview already provide the route and respect `HTTPS_PROXY`.

## Implemented

- Candles, OHLC bars, line and area charts, volume overlay, pan/zoom, crosshair, log scale, fit and screenshot export.
- BTC, ETH, SOL, XRP and LTC USD markets; 1m through 1W timeframes. Public Bitstamp OHLC refreshes every 30 seconds. Feed failure is visibly labeled; deterministic synthetic candles support offline development. No simulated values are labeled live.
- SMA 20, EMA 20, Bollinger Bands (20, 2), RSI 14, VWAP (cumulative over the loaded window), Volume and OBV. Two blue histogram panes approximate the screenshot's layout; the screenshot does not identify its indicators, so these are chosen implementations, not recovered originals.
- Trend line, horizontal price line, Fibonacci retracement, rectangle, text, marker and measurement. One/two-click placement, undo/redo, candle snapping, hide, lock, object tree and delete. Drawings are stored in logical candle coordinates, so changing intervals/markets resets them.
- Local layout save, notes, price-above alerts while page is open, historical candle replay, local paper orders. No money or real exchange orders involved.
- Dark top/left/right/bottom toolbars and watchlist; narrower-screen layout.

## Limits

This does not include the entire TradingView tool/indicator catalog, Pine Script, brokerage integration, tick streaming, a backtesting engine, fundamental/economic feeds, editing existing drawing handles, or multi-symbol comparison. Those controls explain their limitations rather than pretending to perform unavailable operations. Alerts are polling-based, not a background service. Screenshots export the chart canvas, excluding SVG drawings. Only the selected market has a quote in the watchlist. Historical ranges are bounded to the loaded 400 candles. Local storage is browser-specific; no account or backend persistence exists.

The proprietary TradingView charting implementation has not been extracted. Lightweight Charts is the Apache-2.0 open-source rendering engine; its required attribution link remains visible. Icons use Lucide (ISC).

## Validation

```sh
npm test
npm run build
# Uses installed Chromium by default; override CHROMIUM_PATH when needed.
npx playwright test
```

Tests cover indicator invariants, OHLC integrity, chart rendering, indicators, drawing placement, chart type, timeframe, paper ordering and responsive layout. Browser tests mock unavailable live data; they do not prove connectivity to Bitstamp.

See `RESEARCH.md` for observed research boundaries and architecture.
