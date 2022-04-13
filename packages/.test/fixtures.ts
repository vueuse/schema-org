import {defineImage} from "../schema-org/definitions/defineImage";
import {defineOrganization, defineWebPage, defineWebSite, useSchemaOrg} from "../schema-org/index";

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
        '@id': logo['@id'],
      },
      'name': 'Harlan\'s Hamburgers',
    }),
  ])
}
