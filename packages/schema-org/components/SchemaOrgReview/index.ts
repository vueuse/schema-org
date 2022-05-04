import { defineComponent, getCurrentInstance, h, onBeforeUnmount, ref } from 'vue-demi'
import type { VNode } from 'vue'
import { injectSchemaOrg } from '../../useSchemaOrg'
import { dedupeMerge, idReference, shallowVNodesToText } from '../../utils'
import type { Review } from '../../shared/resolveReviews'
import { resolveReviews } from '../../shared/resolveReviews'
import type { Product } from '../../defineProduct'
import { ProductId } from '../../defineProduct'

export interface UseReviewProps {
  as?: string
  rating?: string
  author?: string
}

export const SchemaOrgReview = defineComponent<UseReviewProps>({
  name: 'SchemaOrgReview',
  props: [
    'as',
  ] as unknown as undefined,
  setup(props, { slots }) {
    const schemaOrg = injectSchemaOrg()

    let review: Review | undefined

    const target = ref()

    const vm = getCurrentInstance()!
    const ctx = schemaOrg.setupRouteContext(vm)

    onBeforeUnmount(() => {
      if (review) {
        schemaOrg.removeContext(ctx)
        schemaOrg.generateSchema()
      }
    })

    return () => {
      if (!review && slots.rating && slots.author) {
        const body = slots.default ? shallowVNodesToText(slots.default({ props }) as VNode[]) : ''
        const rating = shallowVNodesToText(slots.rating({ props }) as VNode[])
        const author = shallowVNodesToText(slots.author({ props }) as VNode[])

        const resolved = resolveReviews({ ...schemaOrg, ...ctx }, {
          reviewBody: body,
          reviewRating: {
            ratingValue: rating,
          },
          author: {
            name: author,
          },
        }) as Review
        review = resolved
        schemaOrg.addNode(resolved as Review, ctx)

        // find the product node and add the review to it
        const product = schemaOrg.findNode<Product>(ProductId)
        if (product)
          dedupeMerge(product, 'review', idReference(resolved))
        schemaOrg.generateSchema()
      }

      return h(props.as || 'div', { ref: target }, [
        slots.default ? slots.default({ props }) : null,
        h(props.as || 'div', [slots.rating ? slots.rating({ props }) : null]),
        h(props.as || 'div', [slots.author ? slots.author({ props }) : null]),
      ])
    }
  },
})
