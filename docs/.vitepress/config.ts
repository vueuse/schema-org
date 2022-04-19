import { defineConfig } from 'vitepress'
import type MarkdownIt from 'markdown-it'

export default defineConfig({
  title: 'vueuse-schema-org',
  description: 'Simple and automated Schema.org for Google Rich Results with Vue.',
  head: [
    ['meta', { property: 'og:title', content: 'vueuse-schema-org' }],
    ['meta', { property: 'og:description', content: 'Simple and automated Schema.org for Google Rich Results with Vue.' }],
    ['meta', { property: 'og:url', content: 'https://schema-org.vueuse.org/' }],
    ['meta', { property: 'og:image', content: 'https://schema-org.vueuse.org/og.png' }],
    ['meta', { name: 'twitter:title', content: 'vueuse-schema-org' }],
    ['meta', { name: 'twitter:description', content: 'Simple and automated Schema.org for Google Rich Results with Vue.' }],
    ['meta', { name: 'twitter:image', content: 'https://schema-org.vueuse.org/og.png' }],
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
    repo: 'harlan-zw/vueuse-schema-org',
    docsDir: 'docs',
    docsBranch: 'main',
    logo: '/logo-dark.svg',
    editLinks: true,
    editLinkText: 'Suggest changes to this page',

    nav: [
      { text: 'Guide', link: '/guide/' },
      {
        text: 'Schema.org',
        link: '/schema/',
      },
      {
        text: 'Twitter',
        link: 'https://twitter.com/harlan_zw',
      },
      {
        text: 'Demo',
        link: 'https://inspect.unlighthouse.dev/',
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
          children: [
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
              text: 'Other Framework Setup',
              link: '/guide/setup/other-frameworks',
            },
            {
              text: 'Testing Schema.org',
              link: '/guide/testing',
            },
          ],
        },
        {
          text: 'Recipes',
          children: [
            {
              text: 'General Recommendations',
              link: '/recipes/general-recommendations',
            },
            {
              text: 'Personal Website',
              link: '/recipes/personal-website',
            },
            {
              text: 'Blog',
              link: '/recipes/blog',
            },
            {
              text: 'Local Business',
              link: '/recipes/local-business',
            },
            {
              text: 'eCommerce',
              link: '/recipes/ecommerce',
            },
          ],
        },
      ],
      '/schema/': [
        {
          text: 'Schema.org',
          children: [
            {
              text: 'AggregateOffer',
              link: '/schema/',
            },
            {
              text: 'AggregateRating',
              link: '/schema/',
            },
            {
              text: 'Article',
              link: '/schema/article',
            },
            {
              text: 'Breadcrumb',
              link: '/schema/breadcrumb',
            },
            {
              text: 'Comment',
              link: '/schema/',
            },
            {
              text: 'HowTo',
              link: '/schema/',
            },
            {
              text: 'Image',
              link: '/schema/',
            },
            {
              text: 'LocalBusiness',
              link: '/schema/',
            },
            {
              text: 'Offer',
              link: '/schema/',
            },
            {
              text: 'Organization',
              link: '/schema/',
            },
            {
              text: 'Person',
              link: '/schema/',
            },
            {
              text: 'PostalAddress',
              link: '/schema/',
            },
            {
              text: 'Product',
              link: '/schema/',
            },
            {
              text: 'Question',
              link: '/schema/',
            },
            {
              text: 'Recipe',
              link: '/schema/',
            },
            {
              text: 'Review',
              link: '/schema/',
            },
            {
              text: 'SearchAction',
              link: '/schema/',
            },
            {
              text: 'Video',
              link: '/schema/',
            },
            {
              text: 'WebPage',
              link: '/schema/',
            },
            {
              text: 'WebSite',
              link: '/schema/',
            },
          ],
        },
      ]
    },
  },
})
