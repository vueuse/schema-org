import 'windi.css'
import DefaultTheme from 'vitepress/theme'
import '../../main.css'
import * as Panelbear from '@panelbear/panelbear-js'
import { createSchemaOrg } from 'vueuse-schema-org'
import { createHead, useHead } from '@vueuse/head'
import { useRoute } from 'vitepress'
import MyLayout from './MyLayout.vue'

export default {
  ...DefaultTheme,
  Layout: MyLayout,
  enhanceApp({ app }) {
    const head = createHead()

    const schemaOrg = createSchemaOrg({
      // providing a host is required for SSR
      canonicalHost: 'https://schema-org.vueuse.com',
      useHead,
      useRoute,
    })

    app.use(head)
    app.use(schemaOrg)

    // if we're in a server context then we exit out here
    if (typeof document === 'undefined' || typeof window === 'undefined')
      return

    app.provide('analytics', Panelbear)
    Panelbear.load('GY6EHqREHHK', {
      spaMode: 'history',
      autoTrack: true,
      debug: import.meta.env.DEV,
    })
  },
}
