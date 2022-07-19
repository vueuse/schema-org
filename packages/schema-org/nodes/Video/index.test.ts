import { expect } from 'vitest'
import { useSetup } from '../../../.test'
import { injectSchemaOrg, useSchemaOrg } from '../../useSchemaOrg'
import { defineVideo } from './index'

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

      const { graphNodes } = injectSchemaOrg()

      expect(graphNodes).toMatchInlineSnapshot(`
        [
          {
            "@id": "https://example.com/#/schema/video/maGcIV09t0",
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
