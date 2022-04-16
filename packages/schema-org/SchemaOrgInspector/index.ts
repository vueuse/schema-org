import {defineComponent, h, ref, watch} from 'vue-demi'
import { useSchemaOrg } from '@vueuse/schema-org'

interface Props {
  console: boolean
}

export const SchemaOrgInspector = defineComponent<Props>({
  name: 'SchemaOrgInspector',
  props: [
    'console',
  ] as unknown as any,
  setup(props) {
    const { graph } = useSchemaOrg()

    if (props.console) {
      watch(() => graph, (val) => {
        console && console.debug('[@vueuse/schema-org:SchemaOrgInspector]', val.value)
      })
    }

    const open = ref(false)

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
