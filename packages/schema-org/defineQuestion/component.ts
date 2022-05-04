import { defineComponent, getCurrentInstance, h, onBeforeUnmount, ref } from 'vue-demi'
import type { VNode } from 'vue'
import { injectSchemaOrg } from '../useSchemaOrg'
import { shallowVNodesToText } from '../utils'
import type { Question } from './index'
import { defineQuestion } from './index'

export interface UseQuestionProps {
  as?: string
  question?: string
  answer?: string
}

export const SchemaOrgQuestion = defineComponent<UseQuestionProps>({
  name: 'SchemaOrgQuestion',
  props: [
    'as',
  ] as unknown as undefined,
  setup(props, { slots }) {
    const schemaOrg = injectSchemaOrg()

    let question: Question | undefined

    const target = ref()

    const vm = getCurrentInstance()!
    const ctx = schemaOrg.setupRouteContext(vm)

    onBeforeUnmount(() => {
      if (question) {
        schemaOrg.removeContext(ctx)
        schemaOrg.generateSchema()
      }
    })

    return () => {
      if (!question && slots.question && slots.answer) {
        const q = shallowVNodesToText(slots.question({ props }) as VNode[])
        const a = shallowVNodesToText(slots.answer({ props }) as VNode[])

        const questionResolver = defineQuestion({
          name: q,
          acceptedAnswer: a,
        })
        const node = questionResolver.resolve({ ...schemaOrg, ...ctx })
        question = node
        schemaOrg.addNode(node, ctx)
        if (questionResolver.definition.mergeRelations)
          questionResolver.definition.mergeRelations(node, { ...schemaOrg, ...ctx })
        schemaOrg.generateSchema()
      }

      return h(props.as || 'div', { ref: target }, [
        slots.default ? slots.default({ props }) : null,
      ])
    }
  },
})
