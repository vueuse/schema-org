import { expect } from 'vitest'
import { useSetup } from '../../.test'
import { useSchemaOrg } from '../useSchemaOrg'
import { definePerson } from '.'

describe('definePerson', () => {
  it('can be registered', () => {
    useSetup(() => {
      useSchemaOrg([
        definePerson({
          name: 'test',
          image: '/logo.png',
        }),
      ])

      const client = useSchemaOrg()

      expect(client.nodes).toMatchInlineSnapshot(`
        [
          {
            "@id": "https://example.com/#identity",
            "@type": "Person",
            "image": "https://example.com/logo.png",
            "name": "test",
            "url": "https://example.com/",
          },
        ]
      `)
    })
  })
})
