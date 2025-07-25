import { describe, expect, test } from 'vitest'
import cheerio from 'cheerio'

import { get, getDOM } from '@/tests/helpers/e2etest'

describe('home page', () => {
  test('landing area', async () => {
    const $: cheerio.Root = await getDOM('/')
    const container = $('#landing')
    expect(container.length).toBe(1)
    expect(container.find('h1').text()).toBe('GitHub Docs')
    expect(container.find('p').text()).toMatch('Help for wherever you are on your GitHub journey')
  })

  test('product groups can use Liquid', async () => {
    const $: cheerio.Root = await getDOM('/')
    const main = $('[data-testid="product"]')
    const links = main.find('a[href*="/"]')
    const hrefs = links.map((i: number, link: any) => $(link)).get()
    let externalLinks = 0
    for (const href of hrefs) {
      if (!href.attr('href')?.startsWith('https://')) {
        const res = await get(href.attr('href')!)
        expect(res.statusCode).toBe(200) // Not needing to redirect
        expect(href.text().includes('{%')).toBe(false)
      } else {
        externalLinks++
      }
    }
    expect.assertions((hrefs.length - externalLinks) * 2)
  })
})
