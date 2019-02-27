import test from 'ava'
import puppeteerHelper from '..'

const withPage = puppeteerHelper()

test('evaluate', withPage, async t => {
  t.is(await t.evaluate('./test/helpers/http.js'), 'function')
})

test('evaluate with arg', withPage, async t => {
  t.is(
    await t.evaluate('./test/helpers/arg.js', { name: 'So Tied Up' }),
    'So Tied Up'
  )
})

test('element serialization', withPage, async t => {
  t.snapshot(await t.evaluate('./test/helpers/serialization.js'))
})
