import { expect } from 'vitest'
import { useSetup } from '../../.test'
import { useSchemaOrg } from '../useSchemaOrg'
import { defineVideo } from '.'

describe('defineVideo', () => {
  it('can be registered', () => {
    useSetup(() => {
      useSchemaOrg([
        defineVideo({
          name: 'My cool video',
          uploadDate: new Date(Date.UTC(2020, 10, 10)),
          url: '/image.png',
        }),
      ])

      const { nodes } = useSchemaOrg()

      expect(nodes).toMatchInlineSnapshot(`
        [
          {
            "@id": "https://example.com/#video/1656904464",
            "@type": "VideoObject",
            "name": "My cool video",
            "uploadDate": "2020-11-10T00:00:00.000Z",
            "url": "https://example.com/image.png",
          },
        ]
      `)
    })
  })
})
