<template>
  <WelcomeItem>
    <template #icon><DocumentationIcon /></template>
    <template #heading>Documentation</template>

    îles’s
    <a target="_blank" href="https://iles-docs.netlify.app/">documentation</a>
    is in progress, but it should provide enough info to get started.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon><ToolingIcon /></template>
    <template #heading>Tooling</template>

    This project is served and bundled with
    <a href="https://vitejs.dev/guide/features.html" target="_blank">Vite</a>. The recommended IDE
    setup is <a href="https://code.visualstudio.com/" target="_blank">VSCode</a> +
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon><CommunityIcon /></template>
    <template #heading>Community</template>

    Got stuck? Ask your question on the
    <a target="_blank" href="https://discord.gg/xhheEDwUMX">#iles channel</a> of the Vite.js Discord
    server. Follow the
    <a target="_blank" href="https://twitter.com/ilesjs">@ilesjs</a>
    twitter account for latest news.
  </WelcomeItem>
</template>
