import { expect } from 'vitest'
import { ldJsonScriptTags, useSetup } from '../../.test'
import { useJsonLdTag } from './index'

describe('useJsonLdTag', () => {
  it('should render script', async() => {
    useSetup(() => {
      useJsonLdTag({
        '@context': 'https://custom-schema.com',
      })
    })

    expect(ldJsonScriptTags()).toMatchInlineSnapshot(`
      NodeList [
        <script
          data-hash="2856313566"
          type="application/ld+json"
        >
          {
        "@context": "https://custom-schema.com"
      }
        </script>,
      ]
    `)
  })

  it('should remove script tag on unmount', async() => {
    const vm = useSetup(() => {
      useJsonLdTag({
        '@context': 'https://custom-schema.com',
      })
    })
    expect(ldJsonScriptTags().length).toEqual(1)
    vm.unmount()
    expect(ldJsonScriptTags().length).toEqual(0)
  })
})
