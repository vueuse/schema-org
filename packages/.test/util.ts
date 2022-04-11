export const tags = () => document.head.querySelectorAll('script[type="application/ld+json"]')
export const firstLdJson = () => document.head.querySelector('script[type="application/ld+json"]').textContent
export const firstLdJsonScriptAsJson = () => JSON.parse(document.head.querySelector('script[type="application/ld+json"]').textContent)
