import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { setup } from '@nuxt/test-utils'
import { $fetchSchemaOrg, expectNoClientErrors } from './utils'

/**
 * Note: These tests are the same as basic.test.ts, but they run on the browser and check for console errors.
 * This is seperated as the CI will occasionally hang forever due to the browser.
 */

await setup({
  rootDir: fileURLToPath(new URL('../fixtures/nuxt', import.meta.url)),
  server: true,
  browser: true,
  browserOptions: {
    type: 'chromium',
    launch: {
      timeout: 30000,
    },
  },
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
    const schema = await $fetchSchemaOrg('/meta-overrides')

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
            "@id": "https://example.com/meta-overrides/#webpage",
            "@type": "WebPage",
            "about": {
              "@id": "https://example.com/#identity",
            },
            "description": "Description override",
            "isPartOf": {
              "@id": "https://example.com/#website",
            },
            "name": "Title Override",
            "potentialAction": [
              {
                "@type": "ReadAction",
                "target": [
                  "https://example.com/meta-overrides",
                ],
              },
            ],
            "url": "https://example.com/meta-overrides",
          },
        ],
      }
    `)

    const webpageNode = schema['@graph'].filter(n => n['@type'] === 'WebPage')[0]
    expect(webpageNode.url).toEqual('https://example.com/meta-overrides')
    expect(webpageNode.name).toEqual('Title Override')
    expect(webpageNode.description).toEqual('Description override')

    await expectNoClientErrors('/meta-overrides')
  })

  it('render plugin override', async () => {
    const schema = await $fetchSchemaOrg('/plugin-override')

    // Snapshot
    expect(schema).toMatchInlineSnapshot(`
      {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@id": "https://override-example.com/#identity",
            "@type": "Person",
            "jobTitle": "Software Engineer",
            "name": "Harlan",
            "url": "https://override-example.com",
          },
          {
            "@id": "https://override-example.com/#website",
            "@type": "WebSite",
            "name": "My Website",
            "publisher": {
              "@id": "https://override-example.com/#identity",
            },
            "url": "https://override-example.com",
          },
          {
            "@id": "https://override-example.com/plugin-override/#webpage",
            "@type": "WebPage",
            "about": {
              "@id": "https://override-example.com/#identity",
            },
            "isPartOf": {
              "@id": "https://override-example.com/#website",
            },
            "potentialAction": [
              {
                "@type": "ReadAction",
                "target": [
                  "https://override-example.com/plugin-override",
                ],
              },
            ],
            "url": "https://override-example.com/plugin-override",
          },
        ],
      }
    `)

    const webpageNode = schema['@graph'].filter(n => n['@type'] === 'WebPage')[0]
    expect(webpageNode.url).toEqual('https://override-example.com/plugin-override')

    await expectNoClientErrors('/plugin-override')
  })

  it('render computed post', async () => {
    const schema = await $fetchSchemaOrg('/reactivity-computed')

    const articleNode = schema['@graph'].filter(n => n['@type'] === 'Article')[0]
    // Snapshot
    expect(articleNode).toMatchInlineSnapshot(`
      {
        "@id": "https://example.com/reactivity-computed/#article",
        "@type": "Article",
        "author": {
          "@id": "https://example.com/#identity",
        },
        "description": "Harlan Wilton - Last Name",
        "headline": "Harlan Wilton - Last Name",
        "image": {
          "@id": "https://example.com/#/schema/image/y6z4WuVtXf",
        },
        "isPartOf": {
          "@id": "https://example.com/reactivity-computed/#webpage",
        },
        "mainEntityOfPage": {
          "@id": "https://example.com/reactivity-computed/#webpage",
        },
        "publisher": {
          "@id": "https://example.com/#identity",
        },
        "thumbnailUrl": "https://emojiguide.org/images/emoji/n/3ep4zx1jztp0n.png",
      }
    `)

    await expectNoClientErrors('/reactivity-computed')
  })
})
