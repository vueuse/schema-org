import { defineComponent, h, onBeforeUnmount, ref } from 'vue-demi'
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

    onBeforeUnmount(() => {
      if (question) {
        schemaOrg.removeNode(question)
        schemaOrg.generateSchema()
      }
    })

    const ctx = schemaOrg.setupRouteContext()

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
        schemaOrg.addNode(node)
        if (questionResolver.definition.mergeRelations)
          questionResolver.definition.mergeRelations(node, { ...schemaOrg, ...ctx })
        schemaOrg.generateSchema()
      }

      return h(props.as || 'div', { ref: target }, [
        slots.default ? slots.default({ props }) : null,
        h(props.as || 'div', [slots.question ? slots.question({ props }) : null]),
        h(props.as || 'div', [slots.answer ? slots.answer({ props }) : null]),
      ])
    }
  },
})
