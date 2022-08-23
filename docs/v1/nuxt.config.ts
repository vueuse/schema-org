import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  extends: ['@nuxt-themes/docus'],

  // github: {
  //   owner: 'vueuse',
  //   repo: 'schema-org',
  //   branch: 'main',
  //   token: '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',
  // },
  //
  // modules: ['@nuxtlabs/github-module'],

  app: {
    head: {
      meta: [
        { property: 'og:title', content: '@vueuse/schema-org' },
        { property: 'og:description', content: 'Simple and automated Schema.org for Google Rich Results with Vue.' },
        { property: 'og:url', content: 'https://vue-schema-org.netlify.app/' },
        { property: 'og:image', content: 'https://vue-schema-org.netlify.app/og.png' },
        { name: 'twitter:title', content: '@vueuse/schema-org' },
        { name: 'twitter:description', content: 'Simple and automated Schema.org for Google Rich Results with Vue.' },
        { name: 'twitter:image', content: 'https://vue-schema-org.netlify.app/og.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml', media: '(prefers-color-scheme:no-preference)' },
        { rel: 'icon', href: '/logo-dark.svg', type: 'image/svg+xml', media: '(prefers-color-scheme:dark)' },
        { rel: 'icon', href: '/logo-light.svg', type: 'image/svg+xml', media: '(prefers-color-scheme:light)' },
      ],
    },
  },

  hooks: {
    'app:templates': function (app) {
      app.templates = app.templates.map((t) => {
        if (t.filename !== 'views/document.template.mjs')
          return t

        const analyticsScript = '<script src="https://cdn.usefathom.com/script.js" data-spa="auto" data-site="UQADBWCI" defer></script>'

        t.getContents = () => {
          return `export default (params) => \`
<!DOCTYPE html>
<!--
  Hey :) Thanks for inspecting my site.
  Are you interested in the source code? You can find it here: https://github.com/vueuse/schema-org/tree/main/docs/v1
-->
<html \${params.HTML_ATTRS}>

<head \${params.HEAD_ATTRS}>
  \${params.HEAD}
</head>

<body \${params.BODY_ATTRS}>\${params.BODY_PREPEND}
  \${params.APP}
</body>
<!-- Start Analytics -->
${process.env.NODE_ENV === 'production' ? analyticsScript : '<!-- Ommited -->'}
<!-- End Analytics -->
</html>\`
`
        }
        return t
      })
    },
  },

  components: [
    {
      path: './node_modules/@nuxt-themes/docus/components/app',
      global: true,
      prefix: '',
    },
    {
      path: './node_modules/@nuxt-themes/docus/components/content',
      global: true,
      prefix: '',
    },
    {
      path: './node_modules/@nuxt-themes/docus/components/docs',
      global: true,
      prefix: '',
    },
    {
      path: './node_modules/@nuxt-themes/docus/components/github',
      global: true,
      prefix: '',
    },
    {
      path: './node_modules/@nuxt-themes/docus/components/icons',
      global: true,
      prefix: '',
    },
    {
      path: './node_modules/@nuxt-themes/docus/components/prose',
      global: true,
      prefix: '',
    },
    {
      path: './components',
      prefix: '',
    },
  ],
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
      ],
    },
  },
})
