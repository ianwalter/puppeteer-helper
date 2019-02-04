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

```js
import test from 'ava'
import puppeteerHelper from '@ianwalter/puppeteer-helper'

const withPage = puppeteerHelper(['./dist/my-library.iife.js'])

test('my library works in a real browser', withPage, async (t, page) => {
  const result = await page.evaluate(() => {
    return myLibrary.helloWorld()
  })
  t.is(result, 'Hello World!')
})
```

## API

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
