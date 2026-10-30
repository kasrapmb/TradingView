# Research and evidence boundary

The user supplied a screenshot of a BTCUSD 15-minute Bitstamp TradingView workspace. Visible observations: dark candlesticks, red/green volume, two blue histogram panes, horizontal blue drawings, price/time axes, top command bar, left drawing toolbar, watchlist and bottom range controls. The exact lower-pane formulas are unknown.

The uploaded REA skill was read. `npx -y rea-agents@6.8.0 doctor --client codex --json` ran and reported Node 24.19.0 below its supported patch version and missing Codex MCP registration. This is diagnostic output, not analysis of TradingView. No REA browser capture, decompilation or evidence IDs were produced. No client registration or engine installation was performed.

An HTTP request to the public TradingView chart URL returned CONNECT 403 from the managed network policy. A public Bitstamp OHLC request was also policy-blocked. Network additions for www.tradingview.com and www.bitstamp.net were saved to the environment draft; saving does not apply or publish them. Live-site internals and actual live data delivery remain unverified.

## How this implementation brings BTC to the chart

The browser requests `/api/ohlc/btcusd?step=900&limit=400`. Vite's server proxies this to the public Bitstamp HTTPS OHLC endpoint without requiring an API key. String timestamps/prices/volume are parsed as numbers and candles are sorted. Lightweight Charts receives OHLC candles and a histogram receives volume. The browser polls every 30 seconds; failure uses a visible demo/last-data label. This is our architecture, not a claim about TradingView's private data pipeline.

Toolbar actions add series computed from candles or SVG overlays positioned through chart coordinate transforms. The open-source Lightweight Charts package renders price/time scales, crosshair, candles and zoom/pan. Its library does not supply TradingView's full drawing toolbar, Pine interpreter, proprietary indicators or brokerage services; these require separate implementations.

## Further work

After allowed destinations are applied, validate actual Bitstamp OHLC delivery. Full parity would require a much larger, explicitly specified feature catalog, drawing editing/state architecture, indicator execution language, authenticated persistence, reliable stream/history infrastructure and market/exchange licensing. Do not infer parity from visual similarity.

## Screenshot-driven update

A later set of five screenshots supplied the clean chart, Lines/Channels/Pitchfork menu, indicator catalog, chart-type picker, and Fibonacci/Gann menu. These images were the source for the new UI. No new claim about access to TradingView internals or REA evidence is made. The default blue histogram panes were removed; Volume and OBV remain optional studies. New formulas are independent standard technical calculations. Auto tools and market-breadth indicators are explicitly unavailable. Price labels and buy/sell quotes now stay on the latest candle when hovering historical candles; only the OHLC heading follows the cursor.

## Uploaded video observations

The 72.73-second, 904×480 recording was inspected through extracted frames sampled across the entire video, with larger frames for drawing, indicator and menu details. The recording itself is not included in the repository.

- Opening portion: selected blue trendline and edit toolbar; later a downward line and bounded multicolor Fibonacci retracement with ratios and prices.
- Approximately 20–28 seconds: Text/Notes and projection/measurement menus.
- Approximately 28–48 seconds: 24-hour volume added as a blue lower histogram; indicator dialog remains open after addition; a second line-study pane appears; panel heights change.
- Approximately 52–60 seconds: lower panes are removed, returning to the full candle chart; interval menu is opened.
- Closing portion: Technicals list scrolls through CMO/Choppiness/DEMA and the Fundamentals category displays its tabs.

These are visible interaction observations from the user's recording, not live-site inspection or REA evidence. The recording includes an advance/decline selection, but reproducing a market-breadth series requires constituent advance/decline data that this single-symbol OHLC feed does not provide. That feature remains explicitly unavailable. Fundamental feeds and community scripts are also unconnected. Independent geometry and OHLC-derived calculations approximate the recorded behavior; exact TradingView parity is not claimed.
