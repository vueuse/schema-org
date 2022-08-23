<script lang="ts" setup>
onMounted(() => {
  Promise.all([
    import('typewriter-effect/dist/core'),
    import('prismjs'),
  ]).then(([{ default: Typewriter }, Prism]) => {
    setTimeout(() => {
      const element = document.getElementById('code')
      const stringSplitter = (string: string) => {
        const splitter = string
          .replace('&lt;', '<')
          .replace('&gt;', '>')
        return splitter.split('')
      }
      const typewriter = new Typewriter(element, {
        delay: 15,
        skipAddStyles: true,
        loop: true,
        stringSplitter,
      })
      const compositionText = Prism.highlight(
`// Composition API
useSchemaOrg([
  definePerson({
    name: 'Harlan Wilton',
    image: '/me.png',
    sameAs: [
      'https://harlanzw.com',
      'https://github.com/harlan-zw',
      'https://twitter.com/harlan_zw'
    ]
  }),
  defineWebSite({ name: 'My Blog' }),
  defineWebPagePartial(),
])
// Global Schema.org ✅`, Prism.languages.javascript, 'javascript')

      const templateText = Prism.highlight(
`<!-- Component API -->
<template>
  <SchemaOrgPerson
    name="Harlan Wilton"
    image="/me.png"
    :same-as="[
        'https://github.com/harlan-zw',
        'https://twitter.com/harlan_zw',
        'https://harlanzw.com'
    ]"
    />
  <SchemaOrgWebSite name="My Blog" />
  <SchemaOrgWebPage />
</template>
// Global Schema.org ✅`, Prism.languages.html, 'html')

      typewriter
        .typeString(templateText)
        .pauseFor(3500)
        .deleteAll(1)
        .typeString(compositionText)
        .pauseFor(3500)
        .start()
    }, 500)
  })
})
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="xl:w-1280px px-7 md:px-5 xl:flex items-center justify-between md:(my-10 pb-20) my-7 pb-10">
      <div class="flex flex-col items-left">
        <div>
          <span class="info badge inline-flex items-center rounded-full px-3 py-1 text-base leading-5 tracking-tight">v1 Released 🎉 <a href="/posts/v1-release" class="ml-1">Switch to new docs</a></span>
        </div>
        <h1 class="!md:(leading-22 text-6xl text-left) leading-14 font-bold text-3xl font-500 mt-0 mb-7">
          <span class="border-b-5 border-green-400">Schema.org</span> <span class="border-b-5 border-transparent">for</span> <span class="border-b-5 border-green-400 mr-3">Vue</span>
        </h1>
        <div class="md:(leading-20 text-5xl text-left) mb-10 opacity-90">
          Improve your sites SEO with quick and easy <span class="whitespace-nowrap"><a href="https://developers.google.com/search/docs/advanced/structured-data/search-gallery" target="_blank" class="!text-inherit"><img src="/google-logo.svg" height="55" class="md:h-50px h-40px inline mx-3 mb-1 md:mb-2">Rich Results</a></span>.
        </div>
        <div class="mb-5">
          <div v-for="(f, i) in ['Minimal Config', '20+ definitions', 'Three APIs']" :key="i" class="md:(mr-5 pl-3 pr-4 p-1 text-lg mb-10) opacity-90 mb-5 text-sm rounded-xl mr-2 inline-flex items-center border-1 border-green-500  bg-green-50 pl-2 pr-3 py-1 dark:bg-green-700 dark:text-green-200">
            <i-carbon-checkmark-outline class="mr-2 text-green-500" />
            {{ f }}
          </div>
        </div>
        <div
          class="
          text-center
          flex
          flex-col
          sm:flex-row
          flex-wrap
          items-center
          gap-6
          children:my0"
        >
          <a
            href="/guide/"
            class="md:(px-7 py-2 text-2xl) shadow-lg px-4 py-2 text-xl font-bold hover:no-underline font-medium rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 flex items-center p-5 dark:(from-emerald-800 to-green-700) bg-gradient-to-t from-emerald-600 to-green-500 !text-white  hover:(bg-green-700 scale-105) transform transition children:hover:text-white"
          >
            <p class="break-none m-0 ">
              Get Started
            </p>
          </a>
        </div>
      </div>
      <div class="xl:w-410px w-full xl:mt-0 mt-10">
        <div class="xl:w-410px shadow-xl mx-auto ">
          <div class="language-js h-450px">
            <pre class="!p-7"><code id="code" ref="code" /></pre>
          </div>
        </div>
      </div>
    </div>

    <div class="md:py-15 py-10 w-full">
      <div class="container px-7 md:px-15  mx-auto flex flex-col  items-center">
        <h2 id="meet-the-team" class="md:text-4xl !mt-0 text-3xl mb-10 text-center ">
          Made with <span class="text-green-500">❤</span>
        </h2>
        <Avatar
          name="Harlan Wilton"
          avatar="https://avatars.githubusercontent.com/u/5326365?v=4"
          github="harlan-zw"
          twitter="harlan_zw"
          sponsors
        >
          Building delightful open source
          <br>Nuxt freelance developer
        </Avatar>
      </div>
    </div>
    <div class="md:py-15 py-10 w-full">
      <div class="container px-7 md:px-15  mx-auto flex flex-col items-center">
        <h2 id="contributors" class="md:text-4xl mt-0 text-3xl mb-10 text-center ">
          Contributors
        </h2>
        <p class="text-center opacity-90">
          These people have financially supported the development of this package. Thanks!
        </p>
        <div class="px-7 md:px-15">
          <a href="https://raw.githubusercontent.com/harlan-zw/static/main/sponsors.svg">
            <img src="https://raw.githubusercontent.com/harlan-zw/static/main/sponsors.svg">
          </a>
        </div>
      </div>
      <p class="text-center">
        <a href="https://unlighthouse.dev/chat">Join the community</a> and get involved!
      </p>
    </div>

    <p class="text-center opacity-75">
      <a href="https://www.netlify.com">
        <img src="/netlify.svg" alt="Deploys by Netlify">
      </a>
    </p>
    <div class="mb-30" />
  </div>
</template>
<style>
.badge.info {
  border-width: 1px;
  --tw-border-opacity: 1;
  border-color: rgb(179 228 255 / var(--tw-border-opacity));
  --tw-bg-opacity: 1;
  background-color: rgb(217 241 255 / var(--tw-bg-opacity));
  --tw-text-opacity: 1;
  color: rgb(0 144 225 / var(--tw-text-opacity));
}
</style>
