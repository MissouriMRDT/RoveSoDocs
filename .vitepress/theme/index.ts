import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { inBrowser, withBase } from 'vitepress'

// Put the roots of your non-vitepress static sites here:
const BYPASS_PREFIXES = [
  withBase('/autonomy/'),
  withBase('/RoveSoSimulator/_d/'),
  withBase('/RoveSoSimulator/_j/'),
  withBase('/embedded/'),
  withBase('/rovecomm/_cpp/'),
]

function shouldBypass(a: HTMLAnchorElement) {
  // ignore new-tab, downloads, modified clicks, etc.
  if (!a.href) return false
  if (a.target && a.target !== '_self') return false
  if (a.hasAttribute('download')) return false

  const url = new URL(a.href, window.location.href)
  if (url.origin !== window.location.origin) return false

  return BYPASS_PREFIXES.some((p) => url.pathname.startsWith(p))
}

export default {
  extends: DefaultTheme,

  enhanceApp() {
    if (!inBrowser) return

    document.addEventListener(
      'click',
      (e) => {
        const ev = e as MouseEvent
        if (
          ev.defaultPrevented ||
          ev.button !== 0 ||
          ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey
        ) return

        const a = (ev.target as HTMLElement | null)?.closest?.('a') as HTMLAnchorElement | null
        if (!a) return

        if (shouldBypass(a)) {
          ev.preventDefault()
          ev.stopPropagation()
          // hard navigation so the browser loads /autonomy/index.html, etc.
          window.location.assign(a.href)
        }
      },
      { capture: true } // capture so we beat VitePress' router interception
    )
  }
} satisfies Theme
