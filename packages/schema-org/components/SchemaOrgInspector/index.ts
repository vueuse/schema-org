import type { Ref } from 'vue'
import { computed, defineComponent, h, ref, watch } from 'vue'
import { hash } from 'ohash'
import { injectSchemaOrg } from '../../useSchemaOrg'
import type { SchemaOrgClient } from '../../types'

function simpleJSONSyntaxHighlighter(json: string) {
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  json = json.replace(/"@type": "(.*?)"/gm, '"@type": "<a target=\'_blank\' href=\'https://schema.org/$1\'>$1</a>"')
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
    let cls = 'number'
    if (/^"/.test(match)) {
      if (/:$/.test(match))
        cls = 'key'
      else
        cls = 'string'
    }
    else if (/true|false/.test(match)) {
      cls = 'boolean'
    }
    else if (/null/.test(match)) {
      cls = 'null'
    }
    return `<span class="${cls}">${match}</span>`
  })
}

export const SchemaOrgInspector = defineComponent({
  name: 'SchemaOrgInspector',
  props: {
    console: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    let client: undefined | SchemaOrgClient
    try {
      client = injectSchemaOrg()
    }
    catch (e) {}
    const schema: Ref<string> = ref('')
    const schemaFormatted = computed(() => simpleJSONSyntaxHighlighter(schema.value))

    if (props.console) {
      watch(schema, () => {
        // eslint-disable-next-line no-console
        console.debug('[SchemaOrgInspector]', schema.value)
      }, { deep: true })
    }

    return () => {
      if (client) {
        schema.value = client.schemaRef.value
        watch(client.schemaRef, (val) => {
          schema.value = val
        }, {
          deep: true,
        })
      }
      else if (typeof document !== 'undefined') {
        const node = document.querySelector('head script[data-id="schema-org-graph"]')
        if (node)
          schema.value = node.innerHTML
      }

      return h('div', {
        key: hash(schemaFormatted.value),
        class: [
          hash(schemaFormatted.value),
        ],
        style: {
          display: 'inline-block',
        },
      }, [
        h('style', [
          '.schema-org-inspector .string { color: #7ec9a5; }',
          '.schema-org-inspector .number { color: #3ca0c8; }',
          '.schema-org-inspector a { color: #7ec9a5; text-decoration: underline; }',
          '.schema-org-inspector .boolean { color: #3ca0c8; }',
          '.schema-org-inspector .null { color: #3ca0c8; }',
          '.schema-org-inspector .key { color: #9fb5f5; }',
        ].join(' '),
        ),
        h('div', {
          class: ['schema-org-inspector'],
          style: {
            backgroundColor: '#282839',
            color: '#c5c6c9',
            padding: '5px',
            borderRadius: '5px',
            maxWidth: '900px',
            maxHeight: '600px',
            overflowY: 'auto',
            boxShadow: '3px 4px 15px rgb(0 0 0 / 10%)',
          },
        }, [h('pre', { style: { textAlign: 'left' }, innerHTML: schemaFormatted.value })]),
      ])
    }
  },
})
