import test from 'ava'
import puppeteerHelper from '.'

const withPage = puppeteerHelper([
  './node_modules/@ianwalter/clone/dist/clone.iife.js'
])

test('sets up a page with clone added to it', withPage, async (t, page) => {
  t.is(await page.evaluate(() => typeof clone), 'function')
})
