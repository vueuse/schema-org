import 'windi.css'
import DefaultTheme from 'vitepress/theme'
import '../../main.css'
import * as Panelbear from '@panelbear/panelbear-js'
import { installSchemaOrg } from '@vueuse/schema-org-vite/vitepress'
import type { Theme } from 'vitepress/dist/client'
import MyLayout from './MyLayout.vue'

const theme: Theme = {
  ...DefaultTheme,
  Layout: MyLayout,
  enhanceApp(ctx) {
    const { app } = ctx

    installSchemaOrg(ctx, {
      canonicalHost: 'https://vue-schema-org.netlify.app/',
    })

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

export default theme
