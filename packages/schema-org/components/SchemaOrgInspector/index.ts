import { computed, defineComponent, h, watch, watchEffect } from 'vue-demi'
import { useSchemaOrg } from '../../useSchemaOrg'

interface Props {
  console: boolean
}

export const SchemaOrgInspector = defineComponent<Props>({
  name: 'SchemaOrgInspector',
  setup() {
    // eslint-disable-next-line no-console
    const consoleDebug = (s: string) => typeof window !== 'undefined' && console.debug(`[SchemaOrgInspector] ${s}`)
    consoleDebug('Setup')
    const { graph, schemaOrg } = useSchemaOrg()

    watchEffect(() => graph)
    const schema = computed(() => schemaOrg)

    if (console) {
      watch(() => graph, () => {
        consoleDebug(schemaOrg)
      }, { immediate: true })
    }

    return () => h('div', {
      style: {
        display: 'inlineBlock',
      },
    }, [
      h('div', { style: { paddingBottom: '6px', fontWeight: 'bold' } }, 'SchemaOrgInspector'),
      h('div', {
        style: {
          backgroundColor: '#282c34',
          color: '#b1b1b3',
          padding: '5px',
          borderRadius: '5px',
          maxWidth: '900px',
          maxHeight: '600px',
          overflowY: 'auto',
          fontSize: '0.8em',
          boxShadow: '3px 4px 15px rgb(0 0 0 / 10%)',
        },
      }, h('pre', { style: { textAlign: 'left' }, innerHTML: schema.value })),
    ])
  },
})
