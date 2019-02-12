import test from 'ava'
import puppeteerHelper from '.'

const withPage = puppeteerHelper()

test('sets up a page with clone added to it', withPage, async t => {
  t.is(await t.evaluate('./evals/clone.js'), 'function')
})
