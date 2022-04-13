import { expect } from 'vitest'
import { nextTick } from 'vue-demi'
import { firstLdJsonScriptAsJson, ldJsonScriptTags, useSetup } from '../../.test'
import { useSchemaOrgWebPage } from '../useSchemaOrgWebPage'
import { useSchemaOrgBreadcrumb } from './index'

describe('useSchemaOrgBreadcrumb', () => {
  it('should become root schema if none available', async() => {
    useSetup(() => {
      useSchemaOrgBreadcrumb([
        {
          name: 'test',
          link: '/my-link',
        },
      ])
    })
    expect(ldJsonScriptTags().length).toEqual(1)
    expect(firstLdJsonScriptAsJson()).toMatchInlineSnapshot(`
      {
        "@context": "https://schema.org",
        "@graph": {
          "@id": null,
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "item": {
                "@id": "/my-link",
                "@type": "Thing",
              },
              "name": "test",
              "position": 1,
            },
          ],
        },
      }
    `)
  })

  it('should merge into existing root schema', async() => {
    useSetup(() => {
      useSchemaOrgWebPage()
      useSchemaOrgBreadcrumb([
        {
          name: 'test',
          link: '/my-link',
        },
      ])
    })
    await new Promise<void>(resolve => nextTick(() => resolve()))
    expect(ldJsonScriptTags().length).toEqual(1)
    expect(firstLdJsonScriptAsJson()).toMatchInlineSnapshot(`
      {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@id": null,
            "@type": "WebPage",
            "isPartOf": {
              "@id": null,
            },
          },
        ],
        "breadcrumb": {
          "@id": null,
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "item": {
                "@id": "/my-link",
                "@type": "Thing",
              },
              "name": "test",
              "position": 1,
            },
          ],
        },
      }
    `)
  })
})
