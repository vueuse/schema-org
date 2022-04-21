import { computed, defineComponent, h, watchEffect } from 'vue-demi'
import { useSchemaOrg } from 'vueuse-schema-org'

interface Props {
  console: boolean
}

export const SchemaOrgInspector = defineComponent<Props>({
  name: 'SchemaOrgInspector',
  setup() {
    return () => {
      const { graph, schemaOrg } = useSchemaOrg()

      watchEffect(() => graph)
      const schema = computed(() => schemaOrg)

      return h('div', {
        style: {
          backgroundColor: 'black',
          color: 'white',
          padding: '5px',
          // position: 'fixed',
          // zIndex: 100,
          // right: '75px',
          // bottom: '30px',
          display: 'inlineBlock',
          pointerEvents: 'cursor',
        },
      }, [
        h('div', 'Schema.org'),
        h('div', {
          style: {
            maxWidth: '900px',
            maxHeight: '600px',
            overflowY: 'auto',
          },
        }, h('pre', { style: { textAlign: 'left' }, innerHTML: schema.value })),
      ])
    }
  },
})
