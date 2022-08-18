import type { InjectionKey, Ref } from 'vue'
import { createApp, defineComponent, h, provide, ref, reactive } from 'vue'
import {createRouter, createWebHashHistory, RouteLocationNormalizedLoaded, useRoute} from 'vue-router'
import {createSchemaOrg} from "../schema-org/createSchemaOrg";
import { createHead } from '@vueuse/head'
import {CreateSchemaOrgInput, ProviderOptions, useVueUseHead} from "@vueuse/schema-org";
import {DeepPartial} from "utility-types";

type InstanceType<V> = V extends { new (...arg: any[]): infer X } ? X : never
type VM<V> = InstanceType<V> & { unmount(): void }

let useRouteFacade = () => {
  return <RouteLocationNormalizedLoaded> {
    path: '/'
  }
}
let inputArgs: DeepPartial<CreateSchemaOrgInput> = {
  canonicalHost: 'https://example.com/',
  defaultLanguage: 'en-AU',
  provider: {
    useRoute: useRouteFacade,
  }
}

export function mount<V>(Comp: V) {
  const component = defineComponent({
    render() {
      return h('div', [])
    },
  })

  const el = document.createElement('div')
  const app = createApp(Comp)

  const router = createRouter({
    history: createWebHashHistory(),
    routes: [{ path: '/', component }]
  })

  app.use(router)

  const head = createHead()
  app.use(head)

  if (!inputArgs.provider) {
    inputArgs.provider = {}
  }
  if (!inputArgs.provider.setupDOM) {
    inputArgs.provider.setupDOM = useVueUseHead(head)
  }
  const schemaOrg = createSchemaOrg(inputArgs as CreateSchemaOrgInput)

  app.use(schemaOrg)

  schemaOrg.setupDOM()
  // watchEffect(() => { schemaOrg.generateSchema() })

  const unmount = () => app.unmount()
  const comp = app.mount(el) as any as VM<V>
  comp.unmount = unmount
  return comp
}

export const mockRoute = (route: Partial<RouteLocationNormalizedLoaded>, fn: () => void) => {
  if (!inputArgs) {
    return
  }
  const currentRoute = inputArgs.provider?.useRoute
  useRouteFacade = () => reactive(route) as RouteLocationNormalizedLoaded
  inputArgs.provider.useRoute = useRouteFacade
  fn()
  inputArgs.provider.useRoute = currentRoute
}

export const mockCreateSchemaOptions = (options: Partial<ProviderOptions>) => {
  inputArgs = {
    ...inputArgs,
    ...options
  }
}

export function component<V>(setup: () => V, children: any[] = []) {
  return defineComponent({
    setup,
    render() {
      return h('div', children)
    },
  })
}

export function useSetup<V>(setup: () => V, children: any[] = []) {
  const Comp = defineComponent({
    setup,
    render() {
      return h('div', children)
    },
  })

  return mount(Comp)
}

export const Key: InjectionKey<Ref<number>> = Symbol('num')

export function useInjectedSetup<V>(setup: () => V) {
  const Comp = defineComponent({
    setup,
    render() {
      return h('div', [])
    },
  })

  const Provider = defineComponent({
    components: Comp,
    setup() {
      provide(Key, ref(1))
    },
    render() {
      return h('div', [])
    },
  })

  return mount(Provider)
}
