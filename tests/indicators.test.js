import {test} from 'node:test';import assert from 'node:assert/strict';import {sma,ema,rsi,bands,demo} from '../src/data.js';
const flat=Array.from({length:40},(_,time)=>({time,close:100}));
test('SMA and EMA preserve constant prices',()=>{assert.equal(sma(flat).length,21);assert.ok(sma(flat).every(d=>d.value===100));assert.ok(ema(flat).every(d=>Math.abs(d.value-100)<1e-9))});
test('Bollinger bands have no width at zero volatility',()=>assert.ok(bands(flat).every(d=>d.upper===100&&d.lower===100)));
test('RSI handles flat, rising and falling prices',()=>{assert.equal(rsi(flat).at(-1).value,50);assert.equal(rsi(flat.map((d,i)=>({...d,close:i}))).at(-1).value,100);assert.equal(rsi(flat.map((d,i)=>({...d,close:100-i}))).at(-1).value,0)});
test('Demo candles maintain OHLC constraints and ordered timestamps',()=>{const ds=demo();assert.equal(ds.length,400);assert.ok(ds.every((d,i)=>d.high>=Math.max(d.open,d.close)&&d.low<=Math.min(d.open,d.close)&&(!i||d.time>ds[i-1].time))) });
