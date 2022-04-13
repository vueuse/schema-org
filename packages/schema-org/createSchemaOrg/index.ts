import type { Ref } from 'vue-demi'
import type { App } from 'vue'
import { computed, unref } from 'vue-demi'
import { joinURL } from 'ufo'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import type { SchemaOrgNode } from '../types'

export const PROVIDE_KEY = 'useschemaorg'

type UseHead = (data: Record<string, any>) => void
type UseRoute = () => RouteLocationNormalizedLoaded

export interface SchemaOrgClient {
  install: (app: App) => void
  nodes: SchemaOrgNode[]
  addNode: (objs: Ref<SchemaOrgNode>) => void
  removeNode: (objs: Ref<SchemaOrgNode>) => void
  update: (document?: Document) => void
  canonicalHost: string
  resolvePathId: (id: string, path?: string) => string
  resolveHostId: (id: string) => string
  routeCanonicalUrl: (path?: string) => string
  useHead: UseHead
  useRoute: UseRoute
}

export interface SchemaOrgOptions {
  useHead: UseHead
  useRoute: () => RouteLocationNormalizedLoaded
  canonicalHost: string
}

export const createSchemaOrg = ({ useHead, canonicalHost, useRoute }: SchemaOrgOptions) => {
  let allNodes: Ref<SchemaOrgNode>[] = []

  const client: SchemaOrgClient = {
    install(app) {
      app.config.globalProperties.$schemaOrg = client
      app.provide(PROVIDE_KEY, client)
    },

    useHead,
    useRoute,

    /**
     * Get deduped tags
     */
    get nodes() {
      return allNodes
    },

    get canonicalHost() {
      // use window if the host has not been provided
      if (!canonicalHost && typeof window !== 'undefined')
        return window.location.host
      return canonicalHost || ''
    },

    routeCanonicalUrl(path?: string) {
      // @todo check document meta for canonical url specification
      const route = useRoute()
      return joinURL(client.canonicalHost, route.path, path || '')
    },

    resolveHostId(id: string, path?: string) {
      if (path)
        return `${path}#${id}`
      return `${client.canonicalHost}#${id}`
    },

    resolvePathId(id: string, path?: string) {
      if (path)
        return `${path}#${id}`
      return `${client.routeCanonicalUrl()}#${id}`
    },

    addNode(objs) {
      allNodes.push(objs)
    },

    removeNode(objs) {
      allNodes = allNodes.filter(_objs => _objs !== objs)
    },

    update() {
      const unreffed = allNodes.map(n => unref(n))
      return useHead({
        // Can be static or computed
        script: [
          {
            type: 'application/ld+json',
            key: 'root-schema-org-graph',
            children: computed(() => JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': unreffed,
            }, undefined, 2)),
          },
        ],
      })
    },
  }
  return client
}
