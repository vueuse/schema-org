import { expect } from 'vitest'
import { useSetup } from '../../.test'
import { useSchemaOrg } from '../useSchemaOrg'
import { defineLocalBusiness } from '.'

describe('defineLocalBusiness', () => {
  it('can be registered', () => {
    useSetup(() => {
      useSchemaOrg([
        defineLocalBusiness({
          name: 'test',
          logo: '/logo.png',
        })
          .withAddress({
            addressCountry: 'Australia',
            postalCode: '2000',
            streetAddress: '123 st',
          })
          .withOpeningHours([
            {
              dayOfWeek: 'Saturday',
              opens: '09:30',
              closes: '13:30',
            },
            {
              dayOfWeek: ['Monday', 'Tuesday'],
              opens: '10:30',
              closes: '15:30',
            },
          ]),
      ])

      const client = useSchemaOrg()

      expect(client.nodes).toMatchInlineSnapshot(`
        [
          {
            "@id": "https://example.com/#identity",
            "@type": "LocalBusiness",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "Australia",
              "postalCode": "2000",
              "streetAddress": "123 st",
            },
            "logo": "/logo.png",
            "name": "test",
            "openingHoursSpecification": [
              {
                "@type": "OpeningHoursSpecification",
                "closes": "13:30",
                "dayOfWeek": "Saturday",
                "opens": "09:30",
              },
              {
                "@type": "OpeningHoursSpecification",
                "closes": "15:30",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                ],
                "opens": "10:30",
              },
            ],
            "url": "https://example.com/",
          },
        ]
      `)
    })
  })
})
