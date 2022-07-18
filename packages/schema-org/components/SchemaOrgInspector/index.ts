import { defineComponent, h, ref, watch } from 'vue'
import { injectSchemaOrg } from '../../useSchemaOrg'
import type { SchemaOrgClient } from '../../types'

export const SchemaOrgInspector = defineComponent({
  name: 'SchemaOrgInspector',
  props: {
    console: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    let client: undefined | SchemaOrgClient
    try {
      client = injectSchemaOrg()
    }
    catch (e) {}
    if (!client) {
      // never resolves, never hydrates
      return () => {
        return new Promise(() => {})
      }
    }

    const schemaRaw = ref('')

    watch(client.schemaRef, (val) => {
      schemaRaw.value = val

      if (props.console) {
        // eslint-disable-next-line no-console
        console.debug('[SchemaOrgInspector]', client?.graphNodes)
      }
    }, {
      immediate: true,
    })

    return () => {
      return h('div', {
        style: {
          display: 'inline-block',
        },
      }, [h('div', {
        class: ['schema-org-inspector'],
        style: {
          backgroundColor: '#282839',
          color: '#c5c6c9',
          padding: '5px',
          borderRadius: '5px',
          width: '900px',
          height: '600px',
          overflowY: 'auto',
          boxShadow: '3px 4px 15px rgb(0 0 0 / 10%)',
        },
      }, [
        h('pre', { style: { textAlign: 'left' } }, schemaRaw.value),
      ])])
    }
  },
})
