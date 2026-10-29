import {defineConfig} from 'vite';
import {HttpsProxyAgent} from 'https-proxy-agent';
const proxy={'/api/ohlc':{target:'https://www.bitstamp.net',changeOrigin:true,...(process.env.HTTPS_PROXY?{agent:new HttpsProxyAgent(process.env.HTTPS_PROXY)}:{}),rewrite:p=>p.replace(/^\/api\/ohlc\/([^?]+)/,'/api/v2/ohlc/$1/')}};
export default defineConfig({server:{proxy},preview:{proxy}});
