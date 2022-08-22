import { defineTheme } from '@nuxt-themes/kit'

//
// title: '@vueuse/schema-org',
//   description: '',
//   head: [
//   ['meta', { property: 'og:title', content: '@vueuse/schema-org' }],
//   ['meta', { property: 'og:description', content: 'Simple and automated Schema.org for Google Rich Results with Vue.' }],
//   ['meta', { property: 'og:url', content: 'https://vue-schema-org.netlify.app/' }],
//   ['meta', { property: 'og:image', content: 'https://vue-schema-org.netlify.app/og.png' }],
//   ['meta', { name: 'twitter:title', content: '@vueuse/schema-org' }],
//   ['meta', { name: 'twitter:description', content: 'Simple and automated Schema.org for Google Rich Results with Vue.' }],
//   ['meta', { name: 'twitter:image', content: 'https://vue-schema-org.netlify.app/og.png' }],
//   ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
//   ['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml', media: '(prefers-color-scheme:no-preference)' }],
//   ['link', { rel: 'icon', href: '/logo-dark.svg', type: 'image/svg+xml', media: '(prefers-color-scheme:dark)' }],
//   ['link', { rel: 'icon', href: '/logo-light.svg', type: 'image/svg+xml', media: '(prefers-color-scheme:light)' }],
//   ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&family=DM+Serif+Display:ital@0;1&display=swap' }],
// ],

export default defineTheme({
  name: '@vueuse/schema-org',
  description: 'Simple and automated Schema.org for Google Rich Results with Vue.',
  url: 'https://vue-schema-org.netlify.app/',
  layout: 'default',
  socials: {
    twitter: '@harlan-zw',
    github: 'vueuse/schema-org',
  },
  github: {
    root: 'content',
    edit: true,
  },
  aside: {
    level: 1,
    filter: [],
  },
  header: {
    title: false,
    logo: true,
  },
  cover: {
    src: 'https://user-images.githubusercontent.com/904724/105075054-872fac80-5a89-11eb-8aab-46dd254ad986.png',
    alt: 'A screenshot of a website built with Docus with the Docus logo on top of it.',
  },
  footer: {
    credits: {
      icon: 'IconDocus',
      text: 'Powered by Docus',
      href: 'https://docus.com',
    },
  },
})
