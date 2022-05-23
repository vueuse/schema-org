import {RouteLocationNormalizedLoaded} from "vue-router";
import {createSchemaOrg} from "../schema-org/createSchemaOrg/index";
import { reactive } from 'vue'

export const scriptTagAsJson = (script: HTMLScriptElement|null) => script ? JSON.parse(script?.textContent || '') : null
export const ldJsonScriptTags = () => document.querySelectorAll('script[type="application/ld+json"]')
export const firstLdJsonScriptAsJson = () => scriptTagAsJson(document.head.querySelector('script[type="application/ld+json"]'))

export const mockedUseRoute = () => {
  return reactive({
    path: '/',
    matched: '/',
    fullPath: '/',
    query: '',
  }) as unknown as RouteLocationNormalizedLoaded
}
export const createMockClient = () => createSchemaOrg({
  canonicalHost: 'example.com',
  provider: {
    setupDOM() {},
    useRoute: mockedUseRoute,
  }
})
