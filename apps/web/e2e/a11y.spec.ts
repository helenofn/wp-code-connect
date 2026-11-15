import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { WCAG_AA_TAGS } from '../src/test/wcag.ts'

const routes = [
  { name: 'Login', path: '/login' },
  { name: 'Cadastro', path: '/cadastro' },
]

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

async function open(page: Page, path: string) {
  await page.goto(path)
  await page.waitForLoadState('networkidle')
  await expect(page.locator('main')).toBeVisible()
}

for (const route of routes) {
  test.describe(`${route.name} (${route.path})`, () => {
    test('has no axe violations for WCAG 2.2 A/AA', async ({ page }) => {
      await open(page, route.path)
      const results = await new AxeBuilder({ page }).withTags(WCAG_AA_TAGS).analyze()

      const report = results.violations
        .map(
          (v) =>
            `[${v.impact}] ${v.id}: ${v.help}\n  ${v.helpUrl}\n` +
            v.nodes.map((n) => `    - ${n.target.join(' ')}\n      ${n.failureSummary}`).join('\n'),
        )
        .join('\n\n')

      // Itens que o axe não conseguiu decidir sozinho: exigem revisão manual.
      for (const item of results.incomplete) {
        test.info().annotations.push({
          type: 'a11y: revisão manual',
          description: `${item.id} (${item.help}): ${item.nodes.map((n) => n.target.join(' ')).join(', ')}`,
        })
      }
      expect(results.violations, report).toEqual([])
    })

    // 2.4.2 Page Titled: cada tela precisa de um título que a identifique.
    test('has a page title that identifies the screen (2.4.2)', async ({ page }) => {
      await open(page, route.path)
      await expect(page).toHaveTitle(new RegExp(route.name, 'i'))
    })

    // 1.4.10 Reflow: conteúdo usável em 320 CSS px sem rolagem horizontal.
    test('reflows at 320px width without horizontal scrolling (1.4.10)', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 256 })
      await open(page, route.path)
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }))
      expect(scrollWidth, 'página rola na horizontal a 320px').toBeLessThanOrEqual(clientWidth)
    })

    // 1.4.12 Text Spacing: nada some ou é cortado com o espaçamento ampliado.
    test('keeps content visible with increased text spacing (1.4.12)', async ({ page }) => {
      await open(page, route.path)
      await page.addStyleTag({
        content: `* { line-height: 1.5 !important; letter-spacing: 0.12em !important;
          word-spacing: 0.16em !important; } p { margin-bottom: 2em !important; }`,
      })
      const clipped = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>('body *')]
          .filter((el) => {
            const style = getComputedStyle(el)
            const hidesOverflow = [style.overflow, style.overflowX, style.overflowY].some((o) =>
              ['hidden', 'clip'].includes(o),
            )
            const hasText = [...el.childNodes].some(
              (n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim(),
            )
            return (
              hidesOverflow &&
              hasText &&
              (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1)
            )
          })
          .map((el) => el.outerHTML.slice(0, 120)),
      )
      expect(clipped, 'elementos com texto cortado').toEqual([])
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }))
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth)
    })

    // 2.1.1 Keyboard + 2.4.3 Focus Order: todo controle visível é alcançável
    // com Tab, na ordem do DOM, sem armadilha de foco (2.1.2).
    test('reaches every interactive element with Tab in DOM order (2.1.1, 2.1.2, 2.4.3)', async ({
      page,
      browserName,
    }) => {
      test.skip(browserName !== 'chromium', 'ordem de Tab varia por navegador')
      await open(page, route.path)
      const expected = await page.locator(FOCUSABLE).evaluateAll((els) =>
        els
          .filter((el) => (el as HTMLElement).offsetParent !== null || el.getClientRects().length)
          .map((el, i) => {
            el.setAttribute('data-a11y-idx', String(i))
            return i
          }),
      )

      const visited: number[] = []
      for (let i = 0; i < expected.length + 2; i++) {
        await page.keyboard.press('Tab')
        const idx = await page.evaluate(() =>
          Number(document.activeElement?.getAttribute('data-a11y-idx') ?? -1),
        )
        if (idx === -1 || visited.includes(idx)) break
        visited.push(idx)
      }
      expect(visited, 'sequência de foco por Tab').toEqual(expected)
    })

    // 2.4.7 Focus Visible: o foco por teclado produz uma mudança visível.
    test('shows a visible focus indicator on every interactive element (2.4.7)', async ({
      page,
    }) => {
      await open(page, route.path)
      const count = await page.locator(FOCUSABLE).count()
      const withoutIndicator: string[] = []

      for (let i = 0; i < count; i++) {
        const el = page.locator(FOCUSABLE).nth(i)
        if (!(await el.isVisible())) continue
        // O recorte da captura é relativo à viewport: traz o elemento para a tela.
        await el.scrollIntoViewIfNeeded()
        const box = await el.boundingBox()
        if (!box) continue
        const pad = 6
        const clip = {
          x: Math.max(box.x - pad, 0),
          y: Math.max(box.y - pad, 0),
          width: box.width + pad * 2,
          height: box.height + pad * 2,
        }

        await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur())
        const before = await page.screenshot({ clip, caret: 'hide', animations: 'disabled' })
        // Foco via teclado para ativar :focus-visible.
        await el.evaluate((node) => (node as HTMLElement).focus({ focusVisible: true } as FocusOptions))
        await page.keyboard.press('Shift')
        const after = await page.screenshot({ clip, caret: 'hide', animations: 'disabled' })

        if (before.equals(after)) {
          withoutIndicator.push(await el.evaluate((n) => n.outerHTML.slice(0, 120)))
        }
      }
      expect(withoutIndicator, 'elementos sem indicador de foco visível').toEqual([])
    })
  })
}

// 2.4.2: telas diferentes não podem compartilhar o mesmo título.
test('each screen has a distinct page title (2.4.2)', async ({ page }) => {
  const titles = new Set<string>()
  for (const route of routes) {
    await open(page, route.path)
    titles.add(await page.title())
  }
  expect(titles.size).toBe(routes.length)
})
