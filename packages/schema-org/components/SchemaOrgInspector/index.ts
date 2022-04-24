import { defineComponent, h, ref, watch } from 'vue-demi'
import { useSchemaOrg } from '../../useSchemaOrg'

interface Props {
  console: boolean
}

export const SchemaOrgInspector = defineComponent<Props>({
  name: 'SchemaOrgInspector',
  setup() {
    const schemaOrg = useSchemaOrg()
    // eslint-disable-next-line no-console
    const consoleDebug = (s: string) => schemaOrg.options.debug && typeof window !== 'undefined' && console.debug(`[SchemaOrgInspector] ${s}`)
    consoleDebug('Setup')

    const schema = ref(schemaOrg.schemaOrg)

    watch(schemaOrg.idGraph, () => {
      consoleDebug(schemaOrg.schemaOrg)
      schema.value = schemaOrg.schemaOrg
    }, { deep: true })

    return () => {
      return h('div', {
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
            boxShadow: '3px 4px 15px rgb(0 0 0 / 10%)',
          },
        }, h('pre', { style: { textAlign: 'left' }, innerHTML: schema.value })),
      ])
    }
  },
})
