import { defineComponent, h, nextTick, ref } from 'vue'

export const SchemaOrgInspector = defineComponent({
  name: 'SchemaOrgInspector',
  props: {
    console: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const schemaRaw = ref('')

    // get schema.org json
    nextTick(() => {
      schemaRaw.value = document.querySelector('script[data-id="schema-org-graph"]')?.innerText
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
