import {useSchemaOrg} from "../schema-org/index";
import { defineImage, defineWebSite, defineWebPage, defineOrganization } from 'schema-org-graph-js'

export const useHarlansHamburgers = () => {
  const logo = defineImage({
    ['@id']: '#logo',
    url: 'https://harlanshamburgers.com/logo.png',
  })
  useSchemaOrg([
    logo,
    defineWebSite({
      name: 'Harlan\'s Hamburgers',
      description: 'Home to Australia\'s best burger',
    }),
    defineWebPage({
      name: 'The best hamburger in Australia | Harlan\'s Hamburger',
    }),
    defineOrganization({
      '@type': [
        'Organization',
        'Place',
        'Restaurant',
      ],
      'logo': {
        '@id': '#logo',
      },
      'name': 'Harlan\'s Hamburgers',
    }),
  ])
}
