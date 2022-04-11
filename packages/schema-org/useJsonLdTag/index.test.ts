import { expect } from 'vitest'
import { useSetup } from '../../.test'
import {useJsonLdTag} from '.'

describe('useJsonLdTag', () => {
  const tags = () => document.head.querySelectorAll('script[type="application/ld+json"]')

  it('should render script', async() => {
    useSetup(() => {
      useJsonLdTag({
        '@context': 'https://custom-schema.com',
      })
      return
    })

    expect(tags()).toMatchInlineSnapshot(`
      NodeList [
        <script
          type="application/ld+json"
        >
          {
        "@context": "https://custom-schema.com"
      }
        </script>,
      ]
    `)
  })

  it('should avoid rendering duplicates', async() => {
    useSetup(() => {
      useJsonLdTag({
        '@context': 'https://custom-schema.com',
      })
      useJsonLdTag({
        '@context': 'https://custom-schema.com',
      })
      return
    })

    expect(tags().length).toEqual(1)

    expect(tags()).toMatchInlineSnapshot(`
      NodeList [
        <script
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
      return
    })
    expect(tags().length).toEqual(1)
    vm.unmount()
    expect(tags().length).toEqual(0)
  })

})
