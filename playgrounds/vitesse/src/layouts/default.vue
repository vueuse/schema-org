<template>
  <main class="px-4 py-10 text-center text-gray-700 dark:text-gray-200">
    <div class="flex mb-10">
      <router-link to="/" replace class="mr-4">
        Home
      </router-link>
      <router-link to="/faq" replace class="mr-4">
        FAQ
      </router-link>
      <router-link to="/about" replace>
        About
      </router-link>
    </div>
    <RouterView />
    <Footer />
    <div class="mt-5 mx-auto text-center opacity-25 text-sm">
      [Default Layout]
    </div>
  </main>
</template>
