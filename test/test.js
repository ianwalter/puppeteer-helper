import test from 'ava'
import puppeteerHelper from '..'

const withPage = puppeteerHelper()

test('evaluate', withPage, async t => {
  t.is(await t.evaluate('./test/helpers/http.js'), 'function')
})

test('evaluate with context', withPage, async t => {
  t.context.args = { name: 'So Tied Up' }
  t.is(await t.evaluate('./test/helpers/arg.js'), 'So Tied Up')
})

test('element serialization', withPage, async t => {
  t.snapshot(await t.evaluate('./test/helpers/serialization.js'))
})

test('evaluate on iframe', withPage, async (t, page) => {
  // Create an iframe.
  await page.evaluate(() => {
    const iframe = document.createElement('iframe')
    iframe.setAttribute('name', 'test')
    document.body.appendChild(iframe)
  })

  // Extract the iframe from all page frames.
  const iframe = page.frames().find(frame => frame.name() === 'test')

  // Evaluate the test script in the iframe to assert it is being run in the
  // iframe.
  t.is(await t.evaluate('./test/helpers/iframe.js', iframe), 'test')
})
