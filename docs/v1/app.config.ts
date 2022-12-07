export default defineAppConfig({
  docus: {
    title: '@vueuse/schema-org',
    name: '@vueuse/schema-org',
    description: 'Simple and automated Schema.org for Google Rich Results with Vue.',
    url: 'https://vue-schema-org.netlify.app/',
    layout: 'default',
    socials: {
      twitter: '@harlan_zw',
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
      src: 'https://vue-schema-org.netlify.app/og.png',
    },
    footer: {
      credits: {
        icon: 'IconDocus',
        text: 'Powered by Docus',
        href: 'https://docus.com',
      },
    },
  },
})
