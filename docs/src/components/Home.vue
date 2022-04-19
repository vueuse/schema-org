<script setup>
const scanFeatures = [
  {
    icon: '⚡',
    title: 'Fast',
    content: '<p>Take advantage of your CPU with threaded workers and use opportunistic throttling and categories for lightning quick scans.</p>',
  },
  {
    icon: '🐞',
    title: 'Automated URL Discovery',
    content: '<p>Fast, configurable URL discovery using sitemap.xml parsing, internal link crawling and project file scanning.</p>',
  },
  {
    icon: '🍣',
    title: 'Dynamic Route Sampling',
    content: '<p>Fewer URLs to scan with automatic sampling of dynamic routes. Hook up your local project files to make it even smarter.</p>',
  },
]
const clientFeatures = [
  {
    icon: '🌈',
    title: 'Modern UI',
    content: '<p>View your sites\' health as a whole with the Unlighthouse client built with Vite. Easily see, search and sort your pages, re-scan individual pages and more.</p>',
  },
  {
    icon: '🍬️',
    title: 'SEO Goodies',
    content: '<p>View all of your pages titles, share images, meta descriptions, see how many internal and external links you have.</p>',
  },
  {
    icon: '✅️',
    title: 'Accessibility Summary',
    content: '<p>See how your sites accessibility stacks up, find high-leverage issues to fix easily and visually see colour contrast issues.</p>',
  },
]

const devFeatures = [
  {
    icon: '🤖',
    title: 'CI Budget Testing',
    content: ' <p>Set a budget for all each category, scan all pages, know if any of the pages breaks the budget. Easy.</p>',
  },
  {
    icon: '🛠',
    title: 'Hackable',
    content: '<p>Unlighthouse was built to modify, with isolated packages, robust API and a generous hook system. You can even modify the columns in the client!</p>',
  },
  {
    icon: '🏠',
    title: 'Static Client Builds',
    content: '<p>Use the CI to upload your sites reports and access them all at any time.</p>',
  },
]
</script>
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

  <div class="bg-gradient-to-r from-blue-100/10 to-emerald-100/10 md:py-15 py-10 w-full">
    <div class="container px-7 md:px-15 mx-auto flex flex-col items-start">
      <h2 id="scanFeatures" class="md:text-4xl text-3xl mb-10 text-center ">
        Scan your site quickly.
      </h2>
      <FeaturesList class="mb-10" :features="scanFeatures" />
    </div>
  </div>

  <div class="bg-gradient-to-r from-yellow-100 to-emerald-100 md:py-15 py-10 w-full">
    <div class="container px-7 md:px-15 mx-auto flex flex-col items-start">
      <h2 id="client" class="md:text-4xl text-3xl mb-10 ">
        Visualise your sites health
      </h2>
      <FeaturesList class="mb-10" :features="clientFeatures" />
    </div>
  </div>

  <div class="md:py-15 py-10 w-full">
    <div class="container px-7 md:px-15  mx-auto flex flex-col items-start">
      <h2 id="features" class="md:text-4xl mt-0 text-3xl mb-10 text-center ">
        Built for Developers
      </h2>
      <FeaturesList class="mb-10" :features="devFeatures" />
    </div>
  </div>

  <div class="bg-gradient-to-r from-orange-500/20 to-teal-100 md:py-15 py-10 w-full">
    <div class="md:mb-15 container px-7 md:px-15 mb-10 md:w-1000px mx-auto">
      <h2 id="integrations" class="md:text-4xl mt-0 text-3xl mb-10">
        Close the feedback loop with integrations
      </h2>
      <p class="md:text-xl mb-5 mt-0">
        Finding issues with your site is one thing, fixing them is another. Unlighthouse comes packed with local development plugins for most popular frameworks.
      </p>
      <p class="md:text-xl">
        See which file belongs to a URL, fix your issue, Unlighthouse will automatically re-audit the page!
      </p>
    </div>
    <div class="flex flex-col md:flex-row md:w-700px text-2xl font-bold mx-auto items-center justify-between">
      <a href="/integrations/vite" class="flex justify-center items-center md:flex-col mb-5">
        <i-logos-vitejs class="md:(mb-4 text-8xl mr-0) mr-2" /><span>Vite</span>
      </a>
      <a href="/integrations/nuxt" class="flex justify-center items-center md:flex-col mb-5">
        <i-logos-nuxt-icon class="md:(mb-4 text-8xl mr-0) mr-2" /><span>Nuxt</span>
      </a>
      <a href="/integrations/webpack" class="flex justify-center items-center md:flex-col mb-5">
        <i-logos-webpack class="md:(mb-4 text-8xl mr-0) mr-2" /><span>webpack</span>
      </a>
    </div>
  </div>

  <div class="md:py-15 py-10 w-full">
    <div class="container px-7 md:px-15  mx-auto flex flex-col  items-center">
      <h2 id="meet-the-team" class="md:text-4xl mt-0 text-3xl mb-10 text-center ">
        Meet the Team
      </h2>
      <div class="p-10 sm:grid gap-10 grid-cols-2">
        <Avatar
          name="Harlan Wilton"
          avatar="https://avatars.githubusercontent.com/u/5326365?v=4"
          github="harlan-zw"
          twitter="harlan_zw"
          :sponsors="true"
        >
          Self-employed Dev<br>Actively contributing to Open Source
        </Avatar>
        <div class="text-center">
          <h3>Want to appear here?</h3>
          <p>I'm looking for developers to join the team.<br> Get in touch with <a href="https://twitter.com/harlan_zw" target="_blank">me</a> :)</p>
        </div>
      </div>
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
