<template>
<div class="flex flex-col items-center">
  <div class="w-full px-7 md:px-15 xl:flex items-center justify-between md:(my-10 pb-20) my-7 pb-10">
    <div class="flex flex-col items-left xl:pr-20">
      <h1 class="md:(leading-22 text-6xl w-750px text-left) leading-14 font-bold text-3xl font-500 mt-0 mb-5">
        Simple and <span class="border-b-5 border-blue-400">automated</span>
        <span class="whitespace-nowrap"><img src="/google-logo.svg" height="55" class="md:h-60px h-40px inline mr-4 mb-1 md:mb-2"><a href="https://github.com/GoogleChrome/lighthouse" target="_blank" class="text-inherit">Rich Results</a></span>
        - powered by Vue.js composition.
      </h1>
      <div class="mb-5">
        <div v-for="(f, i) in ['Follows Best Practices', 'Heaps of definitions', 'Minimal Setup']" :key="i" class="md:(mr-5 pl-3 pr-4 p-1 text-lg mb-10) opacity-90 mb-5 text-sm rounded-xl mr-2 inline-flex items-center border-1 border-green-500  bg-green-50 pl-2 pr-3 py-1">
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
          :class="'md:(px-7 py-3 text-2xl) px-4 py-2 text-xl font-bold hover:no-underline font-medium rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'"
          class="flex items-center p-10 bg-gradient-to-t from-sky-500 to-blue-500 text-white  hover:(bg-green-700 scale-105) transform transition children:hover:text-white"
        >
          <p class="break-none m-0 ">
            Get Started
          </p>
        </a>
      </div>
    </div>
    <div class="w-960px mx-auto relative w-full group max-w-full h-auto xl:mt-0 mt-10">
      <code class="lang-js">
          <pre>
          useSchemaOrg([
            defineOrganization({
              name: 'Google',
            }),
            defineWebSite(),
          ])
          </pre>
      </code>
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
