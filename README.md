# @ianwalter/puppeteer-helper
> An [AVA][avaUrl] helper that makes a [Puppeteer][puppeteerUrl] page available
> to a test

[![npm page][npmImage]][npmUrl]

## About

This helper is based on a [recipe][recipeUrl] that can be found in AVA's docs.

## Installation

```console
yarn add @ianwalter/puppeteer-helper --dev
```

## Warning

This is meant for testing. You wouldn't want to run untrusted code as root with
this since sandboxing is disabled.

## Usage

JavaScript to evaluate in the browser (`something.js`):

```js
import subpub from '@ianwalter/subpub'

// Run your evaluation inside of `window.run` which passes the resolve/reject
// functions from the returned promise and an arg if a second argument is passed
// to `t.evaluate`.
window.run((resolve, reject, args) => {
  // Subscribe to the 'alerts' topic and resolve the evaluation when a message
  // is received.
  subpub.sub('alerts', data => resolve(data.msg))

  // Send a test message to the 'alerts' topic.
  subpub.pub('alerts', { msg: 'Winter Snow Advisory!' })
})
```

Using the evaluation script in an AVA test:

```js
import test from 'ava'
import puppeteerHelper from '@ianwalter/puppeteer-helper'

const withPage = puppeteerHelper() // You can pass Puppeteer options here.

test('message received', withPage, async (t, page) => {
  t.is(await t.evaluate('./something.js'), 'Winter Snow Advisory!')
})
```

## API

`t.evaluate(evaluationScriptPath, [frame])` - Runs the evaluation script (path
is relative to process.cwd()) on the given frame (defaults to page). Arguments
to the evaluate call can be supplied by adding them to `t.context.args`. A
custom Webpack config can also be added to `t.context.webpack`.

## Debugging

To aid in debugging tests, pass `{ devtools: true }` to the `puppeteerHelper`
call and then add `debugger` to the problem area in your evaluation script. This
will stop the browser from automatically running in `headless` mode and pause
execution where `debugger` is placed. This is helpful if you, for example, want
to see/modify a snapshot of variables in the execution context within Chrome
DevTools.

## Related

* [`ianwalter/puppeteer`][iwPuppeteerUrl] - A GitHub Action / Docker image for
  Puppeteer, the Headless Chrome Node API

## License

Apache 2.0 with Commons Clause - See [LICENSE][licenseUrl]

&nbsp;

Created by [Ian Walter](https://iankwalter.com)

[avaUrl]: https://github.com/avajs/ava
[puppeteerUrl]: https://pptr.dev/
[npmImage]: https://img.shields.io/npm/v/@ianwalter/puppeteer-helper.svg
[npmUrl]: https://www.npmjs.com/package/@ianwalter/puppeteer-helper
[recipeUrl]: https://github.com/avajs/ava/blob/master/docs/recipes/puppeteer.md
[iwPuppeteerUrl]: https://github.com/ianwalter/puppeteer
[licenseUrl]: https://github.com/ianwalter/puppeteer-helper/blob/master/LICENSE
