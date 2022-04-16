import { createSchemaOrg } from 'vueuse-schema-org'
import { defineNuxtPlugin } from '#app'
import { useHead, useRoute, watchEffect } from '#imports'
import meta from '#build/schemaOrg.config.mjs'

export default defineNuxtPlugin((nuxtApp) => {
  const schemaOrg = createSchemaOrg({
    useHead,
    useRoute,
    ...meta.config,
  })

  nuxtApp.vueApp.use(schemaOrg)

  let headReady = false
  nuxtApp.hooks.hookOnce('app:mounted', () => {
    watchEffect(() => { schemaOrg.update() })
    headReady = true
  })

  if (process.server)
    return

  if (headReady)
    watchEffect(() => { schemaOrg.update() })

  // const vm = getCurrentInstance()
  // if (!vm)
  //   return

  // onBeforeUnmount(() => {
  //   schemaOrg.removeHeadObjs(headObj)
  //   schemaOrg.updateDOM()
  // })

  // nuxtApp._useHead = (_meta: MetaObject | ComputedGetter<MetaObject>) => {
  //   const meta = ref<MetaObject>(_meta)
  //   if ('titleTemplate' in meta.value)
  //     titleTemplate.value = meta.value.titleTemplate
  //
  //   const headObj = computed(() => {
  //     const overrides: MetaObject = { meta: [] }
  //     if (titleTemplate.value && 'title' in meta.value)
  //       overrides.title = typeof titleTemplate.value === 'function' ? titleTemplate.value(meta.value.title) : titleTemplate.value.replace(/%s/g, meta.value.title)
  //
  //     if (meta.value.charset)
  //       overrides.meta!.push({ key: 'charset', charset: meta.value.charset })
  //
  //     if (meta.value.viewport)
  //       overrides.meta!.push({ name: 'viewport', content: meta.value.viewport })
  //
  //     return defu(overrides, meta.value)
  //   })
  //   schemaOrg.addHeadObjs(headObj as any)
  //

  // }
  //
  // if (process.server)
  //   nuxtApp.ssrContext.renderMeta = () => renderHeadToString(schemaOrg)
})
