import axe, { type Result } from 'axe-core'
import { expect } from 'vitest'
import { WCAG_AA_TAGS } from './wcag'

function formatViolations(violations: Result[]): string {
  return violations
    .map((v) => {
      const nodes = v.nodes
        .map((n) => `    - ${n.target.join(' ')}\n      ${n.failureSummary?.replace(/\n/g, '\n      ')}`)
        .join('\n')
      return `[${v.impact}] ${v.id}: ${v.help}\n  ${v.helpUrl}\n${nodes}`
    })
    .join('\n\n')
}

/**
 * Roda o axe-core (regras WCAG 2.2 A/AA) sobre um nó renderizado no jsdom.
 *
 * Limitação: o jsdom não calcula layout nem cores reais, então contraste,
 * reflow, tamanho de alvo e foco visível são verificados nos testes de
 * navegador em `e2e/a11y.spec.ts`.
 */
export async function expectNoA11yViolations(container: Element) {
  const results = await axe.run(container, {
    runOnly: { type: 'tag', values: WCAG_AA_TAGS },
    // Regras que dependem de renderização real; ficam a cargo do Playwright.
    rules: { 'color-contrast': { enabled: false } },
  })
  expect(results.violations, formatViolations(results.violations)).toEqual([])
}
