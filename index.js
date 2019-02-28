import path from 'path'
import puppeteer from 'puppeteer'
import webpack from 'webpack'
import MemoryFileSystem from 'memory-fs'
import prettydiff from 'prettydiff'
import merge from '@ianwalter/merge'

const skipDownload = process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD === 'true'
const defaultConfig = {
  ...(skipDownload ? { executablePath: 'google-chrome-unstable' } : {}),
  args: ['--no-sandbox', '--disable-setuid-sandbox']
}

function build (entry, customConfig = {}) {
  // Create the Webpack compiler.
  const compiler = webpack(merge(
    {
      mode: 'development',
      target: 'web',
      entry,
      output: { filename: 'main.js' }
    },
    customConfig
  ))

  // Create an in-memory filesystem to store Webpack output.
  const mfs = new MemoryFileSystem()
  compiler.outputFileSystem = mfs

  return new Promise((resolve, reject) => {
    // Create the bundle.
    compiler.run(err => {
      if (err) {
        reject(err)
      }

      // Read the output from the in-memory filesystem and return it.
      resolve(mfs.readFileSync(path.resolve('dist/main.js'), 'utf8'))
    })
  })
}

export default function puppeteerHelper (config = {}) {
  return async function withPage (t, run) {
    // Create the browser and page.
    const browser = await puppeteer.launch(Object.assign(defaultConfig, config))
    const page = await browser.newPage()

    t.evaluate = async (file, frame = page) => {
      const evalString = `
        new Promise((resolve, reject) => {
          const customResolve = payload => {
            if (
              payload instanceof HTMLElement || payload instanceof SVGElement
            ) {
              resolve({ $html: payload.outerHTML })
            } else {
              resolve(payload)
            }
          }

          window.run = cb => cb(
            customResolve,
            reject,
            ${JSON.stringify(t.context.args)}
          )

          try {
            ${await build(file, t.context.webpack)}
          } catch (err) {
            reject(err)
          }
        })
      `
      const result = await frame.evaluate(evalString)

      if (result && result.$html) {
        return prettydiff.mode({
          ...prettydiff.defaults,
          mode: 'beautify',
          source: result.$html,
          indent_size: 2,
          space_close: true
        })
      } else {
        return result
      }
    }

    try {
      await run(t, page)
    } finally {
      await page.close()
      await browser.close()
    }
  }
}
