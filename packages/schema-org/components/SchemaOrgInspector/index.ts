import { defineComponent, h, ref, watch } from 'vue-demi'
import { injectSchemaOrg } from '../../useSchemaOrg'

export const SchemaOrgInspector = defineComponent({
  name: 'SchemaOrgInspector',
  setup() {
    const client = injectSchemaOrg()

    const schema = ref(client.schemaRef.value)
    watch(client.schemaRef, (val) => {
      schema.value = val
    }, {
      deep: true,
    })
    return () => {
      return h('div', {
        style: {
          display: 'inlineBlock',
        },
      }, [
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
        }, [h('pre', { style: { textAlign: 'left' }, innerHTML: schema.value })]),
      ])
    }
  },
})
