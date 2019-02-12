import path from 'path'
import puppeteer from 'puppeteer'
import webpack from 'webpack'
import MemoryFileSystem from 'memory-fs'

const skipDownload = process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD === 'true'
const defaultConfig = {
  ...(skipDownload ? { executablePath: 'google-chrome-unstable' } : {}),
  args: ['--no-sandbox', '--disable-setuid-sandbox']
}

function build (entry) {
  const compiler = webpack({ mode: 'development', target: 'web', entry, output: { filename: 'main.js' } })
  const mfs = new MemoryFileSystem()
  compiler.outputFileSystem = mfs
  return new Promise((resolve, reject) => {
    compiler.run(err => {
      if (err) {
        reject(err)
      }
      resolve(mfs.readFileSync(path.resolve('dist/main.js'), 'utf8'))
    })
  })
}

export default function puppeteerHelper (config = {}) {
  return async function withPage (t, run) {
    // Create the browser and page.
    const browser = await puppeteer.launch(Object.assign(defaultConfig, config))
    const page = await browser.newPage()

    t.evaluate = async (file, arg) => page.evaluate(
      `
        new Promise((resolve, reject) => {
          window.run = cb => cb(resolve, reject, ${arg})
          try {
            ${await build(file)}
          } catch (err) {
            reject(err)
          }
        })
      `,
      arg
    )

    try {
      await run(t, page)
    } finally {
      await page.close()
      await browser.close()
    }
  }
}
