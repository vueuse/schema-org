import {RouteLocationNormalizedLoaded} from "vue-router";
import {createSchemaOrg} from "../schema-org/createSchemaOrg/index";

export const scriptTagAsJson = (script: HTMLScriptElement|null) => script ? JSON.parse(script?.textContent || '') : null

export const ldJsonScriptTags = () => document.querySelectorAll('script[type="application/ld+json"]')
export const firstLdJson = () => document.querySelector('script[type="application/ld+json"]')?.textContent
export const firstLdJsonScriptAsJson = () => scriptTagAsJson(document.head.querySelector('script[type="application/ld+json"]'))

export const mockedUseHead = (data: Record<string, any>) => {}
export const mockedUseRoute = () => {
  return {
    path: '/',
    matched: '/',
    fullPath: '/',
    query: '',
  } as unknown as RouteLocationNormalizedLoaded
}
export const createMockClient = () => createSchemaOrg({
  canonicalHost: 'example.com',
  useHead: mockedUseHead,
  useRoute: mockedUseRoute,
})
