<script lang="ts" setup>
const route = useRoute()

const breadcrumbItems = computed(() => {
  const nav: any[] = [{ name: 'Home', item: '/' }, { name: 'Articles', item: '/blog' }]
  if (route.path.startsWith('/blog/') && route.meta.title)
    nav.push({ name: route.meta.title })
  return nav
})

const name = ref('Harlan\'s Hamburgers')

useSchemaOrg([
  defineLocalBusiness({
    name,
    logo: 'https://emojiguide.org/images/emoji/n/3ep4zx1jztp0n.png',
    address: {
      streetAddress: '123 Main St',
      addressLocality: 'Harlan',
      addressRegion: 'MA',
      postalCode: '01234',
      addressCountry: 'US',
    },
    image: 'https://emojiguide.org/images/emoji/n/3ep4zx1jztp0n.png',
    telephone: '+1-781-555-1212',
    priceRange: '$',
  }),
  // defineWebSite({
  //   name: 'Harlan\'s Hamburgers',
  //   potentialAction: [
  //     asSearchAction({
  //       target: '/search?q={search_term_string}',
  //     }),
  //   ],
  // }),
])

name.value = 'Harlan\'s Hamburgers - Updated'

useHead({
  title: 'Harlan\'s Hamburgers',
  link: [
    { rel: 'icon', type: 'image/png', href: 'https://emojiguide.org/images/emoji/n/3ep4zx1jztp0n.png' }
  ],
})
const nav = [
  { name: 'Home', item: '/' },
  { name: 'About', item: '/about' },
  { name: 'Articles', item: '/blog' },
  { name: 'Shop', item: '/shop' },
  { name: 'FAQ', item: '/faq' },
]
</script>
<template>
<Html>
<Head>
  <SchemaOrgWebSite name="Harlan Wilton" />
  <SchemaOrgWebPage />
</Head>
<Body>
<div class="bg-blue-50 flex pb-20 flex-col items-center justify-center">
  <div class="mb-20 mt-5 gap-5 container mx-auto">
    <h1 class="mb-3 text-xl">Harlan's Hamburgers 🍔</h1>
    <div class="flex items-center justify-between">
      <div>
        <template v-for="(link, key) in nav" :key="key">
        <NuxtLink :to="link.item" class="underline mr-5">
          {{ link.name }}
        </NuxtLink>
        </template>
        <input type="search" class="px-3 py-1 ml-full text-lg shadow border-2 border-grey-300 rounded-lg">
      </div>
      <a href="https://github.com/vueuse/schema-org/tree/main/playgrounds/nuxt3" class="ml-5 underline" target="_blank">GitHub Source</a>
    </div>
  </div>
  <div class="container mx-auto flex items-center gap-20">
    <div>
    </div>
    <div class="w-full max-h-900px overflow-y-auto ">
      <div>
        <div>
          <SchemaOrgBreadcrumb
            as="ul"
            class="flex space-x-4 text-sm opacity-50 list-none"
            :item-list-element="breadcrumbItems"
          >
            <template v-for="(item, key) in breadcrumbItems" :key="key">
            <li v-if="item.item">
              <NuxtLink :to="item.item" class="inline">
                {{ item.name }}
              </NuxtLink>
            </li>
            </template>
          </SchemaOrgBreadcrumb>
        </div>
        <NuxtPage />
      </div>
    </div>
  </div>
</div>
</Body>
</Html>
</template>
