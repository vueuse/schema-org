import { defineConfig } from 'vitepress'
import type MarkdownIt from 'markdown-it'
import { RootSchemas } from '@vueuse/schema-org'
import { paramCase } from 'change-case'

export default defineConfig({
  title: '@vueuse/schema-org',
  description: 'Simple and automated Schema.org for Google Rich Results with Vue.',
  head: [
    ['meta', { property: 'og:title', content: '@vueuse/schema-org' }],
    ['meta', { property: 'og:description', content: 'Simple and automated Schema.org for Google Rich Results with Vue.' }],
    ['meta', { property: 'og:url', content: 'https://vue-schema-org.netlify.app/' }],
    ['meta', { property: 'og:image', content: 'https://vue-schema-org.netlify.app/og.png' }],
    ['meta', { name: 'twitter:title', content: '@vueuse/schema-org' }],
    ['meta', { name: 'twitter:description', content: 'Simple and automated Schema.org for Google Rich Results with Vue.' }],
    ['meta', { name: 'twitter:image', content: 'https://vue-schema-org.netlify.app/og.png' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml', media: '(prefers-color-scheme:no-preference)' }],
    ['link', { rel: 'icon', href: '/logo-dark.svg', type: 'image/svg+xml', media: '(prefers-color-scheme:dark)' }],
    ['link', { rel: 'icon', href: '/logo-light.svg', type: 'image/svg+xml', media: '(prefers-color-scheme:light)' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&family=DM+Serif+Display:ital@0;1&display=swap' }],
  ],
  markdown: {
    config(md) {
      md.use((md: MarkdownIt) => {
        const fence = md.renderer.rules.fence!
        // @ts-expect-error misc args
        md.renderer.rules.fence = (...args) => {
          const [tokens, idx] = args
          const token = tokens[idx]
          const langInfo = token.info.split(' ')
          const langName = langInfo?.length ? langInfo[0] : ''
          const filename = langName.length && langInfo[1] ? langInfo[1] : null

          // remove filename
          token.info = langName

          const rawCode = fence(...args)

          return filename
            ? rawCode.replace(/<div class="language-(\w+)">/, `<div class="language-$1 with-filename"><div class="code-block-filename">${filename}</div>`)
            : rawCode
        }
      })
    },
  },
  themeConfig: {
    repo: 'vueuse/schema-org',
    docsDir: 'docs',
    docsBranch: 'main',
    logo: '/logo-dark.svg',
    editLinks: true,
    editLinkText: 'Suggest changes to this page',

    nav: [
      { text: 'Guide', link: '/guide/' },
      {
        text: 'API',
        link: '/api/',
      },
      {
        text: 'Components',
        link: '/components/',
      },
      {
        text: 'Validator',
        link: 'https://search.google.com/test/rich-results',
      },
      {
        text: 'Twitter',
        link: 'https://twitter.com/harlan_zw',
      },
      {
        text: 'Discord',
        link: 'https://unlighthouse.dev/chat',
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            {
              text: 'Introduction',
              link: '/guide/',
            },
            {
              text: 'How it works',
              link: '/guide/how-it-works',
            },
            {
              text: 'Nuxt Setup',
              link: '/guide/setup/nuxt',
            },
            {
              text: 'Vitesse Setup',
              link: '/guide/setup/vitesse',
            },
            {
              text: 'VitePress Setup',
              link: '/guide/setup/vitepress',
            },
            {
              text: 'Vite Setup',
              link: '/guide/setup/vite',
            },
            {
              text: 'Global Config',
              link: '/guide/global-config',
            },
            {
              text: 'Debugging Schema.org',
              link: '/guide/debugging',
            },
          ],
        },
        {
          text: 'Guides',
          items: [
            {
              text: 'Choose an Identity',
              link: '/guide/guides/identity',
            },
            {
              text: 'Set Page Type',
              link: '/guide/guides/page-type',
            },
            {
              text: 'Custom Schema',
              link: '/guide/guides/custom-schema',
            },
          ],
        },
        {
          text: 'Featured Recipes',
          items: [
            {
              text: 'Blog',
              link: '/guide/recipes/blog',
            },
            {
              text: 'Breadcrumbs',
              link: '/guide/recipes/breadcrumbs',
            },
            {
              text: 'FAQ',
              link: '/guide/recipes/faq',
            },
            {
              text: 'Site Search',
              link: '/guide/recipes/site-search',
            },
            {
              text: 'eCommerce 🔨',
              link: '/guide/recipes/e-commerce',
            },
            {
              text: 'How To 🔨',
              link: '/guide/recipes/how-to',
            },
          ],
        },
      ],
      '/components/': [
        {
          text: 'Guides',
          items: [
            // to build
            { text: 'How Schema Components Work', link: '/components/' },
            { text: 'Schema Components', link: '/components/list' },
          ],
        },
        {
          text: 'Utility Components',
          items: [
            // to build
            { text: 'SchemaOrgDebug 🔨', link: '/components/inspector' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'Core',
          items: [
            { text: 'useSchemaOrg', link: '/api/core/use-schema-org' },
            { text: 'createSchemaOrg', link: '/api/core/create-schema-org' },
          ],
        },
        {
          text: 'Schema',
          items: [
            ...RootSchemas.map(s => ({ text: s, link: `/api/schema/${paramCase(s.replace('WebPage', 'Webpage').replace('WebSite', 'Website'))}` })),
            // to build
            { text: 'Event 🔨', link: '/api/schema/event' },
            { text: 'Book 🔨', link: '/api/schema/book' },
            { text: 'Course 🔨', link: '/api/schema/course' },
            { text: 'SoftwareApp 🔨', link: '/api/schema/software-app' },
          ],
        },
      ],
    },
  },
})
