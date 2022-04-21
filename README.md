## Polyfill Node.js with Vite (fix @starcoin/starcoin buffer)

Use

- NodeGlobalsPolyfillPlugin
- NodeModulesPolyfillPlugin
- rollupNodePolyFill

Read `vite.config.ts` and [node-modules-polyfill Config](https://github.com/remorses/esbuild-plugins/blob/master/node-modules-polyfill/src/polyfills.ts)

## fix @starcoin/starmask-onboarding bowser

Go to `node_modules\@starcoin\starmask-onboarding\dist` and open `starmask-onboarding.es.js`

```javascript
- import { parse } from 'bowser';

// fix
+ import * as Bowser from 'bowser';
+ const parse = Bowser.parse;
```

## How to run

1. `npm install`
2. `fix @starcoin/starmask-onboarding bowser`
3. `npm run dev`
4. open `localhost:3000`
