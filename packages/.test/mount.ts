import type { InjectionKey, Ref } from 'vue-demi'
import { createApp, defineComponent, h, provide, ref } from 'vue-demi'
import { createRouter, createWebHashHistory } from 'vue-router'

type InstanceType<V> = V extends { new (...arg: any[]): infer X } ? X : never
type VM<V> = InstanceType<V> & { unmount(): void }

export function mount<V>(Comp: V) {
  const component = defineComponent({
    render() {
      return h('div', [])
    },
  })

  const router = createRouter({
    history: createWebHashHistory(),
    routes: [{ path: '/', component }]
  })

  const el = document.createElement('div')
  const app = createApp(Comp)

  app.use(router)

  const unmount = () => app.unmount()
  const comp = app.mount(el) as any as VM<V>
  comp.unmount = unmount
  return comp
}

export function useSetup<V>(setup: () => V) {
  const Comp = defineComponent({
    setup,
    render() {
      return h('div', [])
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
