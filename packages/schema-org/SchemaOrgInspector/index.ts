import { defineComponent, h, ref } from 'vue-demi'
import { useSchemaOrg } from 'vueuse-schema-org'

interface Props {
  console: boolean
}

export const SchemaOrgInspector = defineComponent<Props>({
  name: 'SchemaOrgInspector',
  setup() {
    const { graph } = useSchemaOrg()

    const open = ref(true)

    return () => {
      return h('div', {
        style: {
          // backgroundColor: 'black',
          // color: 'white',
          // padding: '5px',
          // position: 'fixed',
          // zIndex: 100,
          // right: '75px',
          // bottom: '30px',
          pointerEvents: 'cursor',
        },
        on: { click: () => open.value = !open.value },
      }, [
        h('div', 'Schema.org'),
        open.value
          ? h('div', {
            // style: {
            //   maxWidth: '900px',
            //   maxHeight: '600px',
            //   overflowY: 'auto',
            // },
          }, h('pre', graph))
          : null,
      ])
    }
  },
})
