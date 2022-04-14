import type { ImageObject } from '../defineImage'
import type { OptionalMeta } from '../types'
import { idReference } from '../utils'
import { defineImage } from '../defineImage'
import { defineOrganization } from '../defineIdentity'
import { defineWebPage } from '../defineWebPage'
import { defineWebSite } from '../defineWebSite'

export interface BasicPresetConfig {
  name: string
  logo: OptionalMeta<ImageObject>|string
  sameAs?: string[]
}

export function defineBasicPreset(config: BasicPresetConfig) {
  const logo = defineImage({
    '@id': '#logo',
    ...(typeof config.logo === 'string' ? { url: config.logo } : config.logo),
  })
  return [
    defineOrganization({
      name: config.name,
      logo,
      image: idReference('#logo'),
      sameAs: config.sameAs,
    }),
    defineWebPage(),
    defineWebSite({
      name: config.name,
    }),
  ]
}
