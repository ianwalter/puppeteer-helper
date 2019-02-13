import test from 'ava'
import puppeteerHelper from '.'

const withPage = puppeteerHelper()

test('evaluate', withPage, async t => {
  t.is(await t.evaluate('./evals/http.js'), 'function')
})

test('evaluate with arg', withPage, async t => {
  t.is(await t.evaluate('./evals/arg.js', { name: 'So Tied Up' }), 'So Tied Up')
})
