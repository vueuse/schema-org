import { defineNuxtConfig } from 'nuxt3'
import MyModule from '..'

export default defineNuxtConfig({
  modules: [
    MyModule,
  ],
  meta: {
    title: 'test',
    meta: [
      {
        name: 'image',
        content: 'https://images.unsplash.com/photo-1604689910903-68729001a0d4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
      }
    ]
  }
})
