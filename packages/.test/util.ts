import {RouteLocationNormalizedLoaded} from "vue-router";
import {createSchemaOrg} from "../schema-org/createSchemaOrg/index";

export const scriptTagAsJson = (script: HTMLScriptElement|null) => script ? JSON.parse(script?.textContent || '') : null

export const ldJsonScriptTags = () => document.head.querySelectorAll('script[type="application/ld+json"]')
export const firstLdJson = () => document.head.querySelector('script[type="application/ld+json"]')?.textContent
export const firstLdJsonScriptAsJson = () => scriptTagAsJson(document.head.querySelector('script[type="application/ld+json"]'))

export const mockHead = (data: Record<string, any>) => {}
export const mockRoute = () => {
  return {
    path: '/',
    matched: '/',
    fullPath: '/',
    query: '',
  } as unknown as RouteLocationNormalizedLoaded
}
export const createMockClient = () => createSchemaOrg({
  canonicalHost: 'example.com',
  useHead: mockHead,
  useRoute: mockRoute,
})
