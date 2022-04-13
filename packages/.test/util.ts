export const scriptTagAsJson = (script: HTMLScriptElement|null) => script ? JSON.parse(script?.textContent || '') : null

export const ldJsonScriptTags = () => document.head.querySelectorAll('script[type="application/ld+json"]')
export const firstLdJson = () => document.head.querySelector('script[type="application/ld+json"]')?.textContent
export const firstLdJsonScriptAsJson = () => scriptTagAsJson(document.head.querySelector('script[type="application/ld+json"]'))

