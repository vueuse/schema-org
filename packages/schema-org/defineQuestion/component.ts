import { defineComponent, h, onBeforeUnmount, ref, watchEffect } from 'vue-demi'
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
        // schemaOrg.setupDOM()
      }
    })

    return () => {
      watchEffect(() => {
        if (question || !slots.question || !slots.answer)
          return
        const q = shallowVNodesToText(slots.question({ props }) as VNode[])
        const a = shallowVNodesToText(slots.answer({ props }) as VNode[])

        const questionResolver = defineQuestion({
          name: q,
          acceptedAnswer: a,
        })
        schemaOrg.addResolvedNodeInput(questionResolver)
        schemaOrg.generateSchema()
        schemaOrg.setupDOM()
        question = questionResolver.resolve(schemaOrg)
      })

      return h(props.as || 'div', { ref: target }, [
        slots.default ? slots.default({ props }) : null,
        h(props.as || 'div', [slots.question ? slots.question({ props }) : null]),
        h(props.as || 'div', [slots.answer ? slots.answer({ props }) : null]),
      ])
    }
  },
})
