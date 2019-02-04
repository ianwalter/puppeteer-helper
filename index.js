import puppeteer from 'puppeteer'

const skipDownload = process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD === 'true'
const defaultConfig = {
  ...(skipDownload ? { executablePath: 'google-chrome-unstable' } : {}),
  args: ['--no-sandbox', '--disable-setuid-sandbox']
}

export default function puppeteerHelper (scripts = [], config = {}) {
  return async function withPage (t, run) {
    // Create the browser and page.
    const browser = await puppeteer.launch(Object.assign(defaultConfig, config))
    const page = await browser.newPage()

    // Add given scripts to the page.
    for (let script of scripts) {
      script = typeof script === 'object' ? script : { path: script }
      await page.addScriptTag(script)
    }

    try {
      await run(t, page)
    } finally {
      await page.close()
      await browser.close()
    }
  }
}
