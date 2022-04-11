import { expect } from 'vitest'
import {useSetup, firstLdJsonScriptAsJson} from '../../.test'
import {useSchemaOrgWebPage} from './index'
import {definePerson, useSchemaOrgPublisher} from "../useSchemaOrgPublisher";

describe('useJsonLdTag', () => {

  it('should render basic schema with no extra data', async() => {
    useSetup(() => {
      useSchemaOrgWebPage()
      return
    })

    expect(firstLdJsonScriptAsJson()).toMatchInlineSnapshot(`
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "isPartOf": {
          "@type": "WebSite",
        },
      }
    `)
  })

  it('should allow changing the type', async() => {
    useSetup(() => {
      useSchemaOrgWebPage({
        '@type': 'FAQPage'
      })
      return
    })

    const script = firstLdJsonScriptAsJson()
    expect(script['@type']).toEqual('FAQPage')
    expect(script).toMatchInlineSnapshot(`
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "isPartOf": {
          "@type": "WebSite",
        },
      }
    `)
  })

  it('should embed publisher schema', async() => {
    useSetup(() => {
      useSchemaOrgPublisher(
        definePerson({
          name: 'Harlan',
        })
      )
      useSchemaOrgWebPage({
        '@type': 'AboutPage',
        '@id': 'https://harlanzw.com/about#webpage',
        'url': 'https://harlanzw.com/about'
      })
      return
    })

    const script = firstLdJsonScriptAsJson()
    expect(script.isPartOf.publisher.name).toEqual('Harlan')
    expect(script).toMatchInlineSnapshot(`
      {
        "@context": "https://schema.org",
        "@id": "https://harlanzw.com/about#webpage",
        "@type": "AboutPage",
        "isPartOf": {
          "@type": "WebSite",
          "publisher": {
            "@type": "Person",
            "name": "Harlan",
          },
        },
        "url": "https://harlanzw.com/about",
      }
    `)
  })

})
