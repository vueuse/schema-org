import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { setup } from '@nuxt/test-utils'
import { $fetchSchemaOrg, expectNoClientErrors } from './utils'

await setup({
  rootDir: fileURLToPath(new URL('../fixtures/nuxt', import.meta.url)),
  server: true,
  browser: true,
})

describe('pages', () => {
  it('render index', async () => {
    const schema = await $fetchSchemaOrg('/')

    // Snapshot
    expect(schema).toMatchInlineSnapshot(`
      {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@id": "https://example.com/#identity",
            "@type": "Person",
            "jobTitle": "Software Engineer",
            "name": "Harlan",
            "url": "https://example.com",
          },
          {
            "@id": "https://example.com/#website",
            "@type": "WebSite",
            "name": "My Website",
            "publisher": {
              "@id": "https://example.com/#identity",
            },
            "url": "https://example.com",
          },
          {
            "@id": "https://example.com/#webpage",
            "@type": "WebPage",
            "about": {
              "@id": "https://example.com/#identity",
            },
            "isPartOf": {
              "@id": "https://example.com/#website",
            },
            "potentialAction": [
              {
                "@type": "ReadAction",
                "target": [
                  "https://example.com",
                ],
              },
            ],
            "url": "https://example.com",
          },
        ],
      }
    `)

    await expectNoClientErrors('/')
  })

  it('render title override', async () => {
    const schema = await $fetchSchemaOrg('/title-override')

    // Snapshot
    expect(schema).toMatchInlineSnapshot(`
      {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@id": "https://example.com/#identity",
            "@type": "Person",
            "jobTitle": "Software Engineer",
            "name": "Harlan",
            "url": "https://example.com",
          },
          {
            "@id": "https://example.com/#website",
            "@type": "WebSite",
            "name": "My Website",
            "publisher": {
              "@id": "https://example.com/#identity",
            },
            "url": "https://example.com",
          },
          {
            "@id": "https://example.com/title-override/#webpage",
            "@type": "WebPage",
            "about": {
              "@id": "https://example.com/#identity",
            },
            "isPartOf": {
              "@id": "https://example.com/#website",
            },
            "name": "Title Override",
            "potentialAction": [
              {
                "@type": "ReadAction",
                "target": [
                  "https://example.com/title-override",
                ],
              },
            ],
            "url": "https://example.com/title-override",
          },
        ],
      }
    `)

    const webpageNode = schema['@graph'].filter(n => n['@type'] === 'WebPage')[0]
    expect(webpageNode.url).toEqual('https://example.com/title-override')
    expect(webpageNode.name).toEqual('Title Override')

    await expectNoClientErrors('/')
  })
})
