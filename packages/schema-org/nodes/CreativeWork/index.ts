import type { DeepPartial } from 'utility-types'
import type { Arrayable, IdReference, Intangible, ResolvableDate, SchemaNodeInput, StructuredValue, Thing } from '../../types'
import {
  IdentityId,
  defineSchemaResolver,
  prefixId, resolveId,
} from '../../utils'
import { defineSchemaOrgComponent } from '../../components/defineSchemaOrgComponent'
import type { ListItemInput } from '../ListItem'
import type { Person } from '../Person'
import type { AggregateRating } from '../AggregateRating'
import type { Organization } from '../Organization'
import type { Comment } from '../Comment'
import type { Place } from '../Place'
import type { Rating } from '../Rating'
import type { WebSite } from '../WebSite'

export interface Audience extends Intangible {
  '@type': 'Audience'
  /**
   * The target group associated with a given audience (e.g. veterans, car owners, musicians, etc.).
   */
  audienceType?: string

  geographicArea?: Arrayable<IdReference>
}

export interface AlignmentObject extends Intangible {
  '@type': 'AlignmentObject'
  alignmentType?: string
  educationalFramework?: string
  targetDescription?: string
  targetName?: string
  targetUrl?: string
}

export interface InteractionCounter extends StructuredValue {
  '@type': 'InteractionCounter'
  endTime?: ResolvableDate
}

export interface CreativeWork extends Thing {
  '@type': 'CreativeWork' | string
  about?: Thing
  accessMode?: string
  accessModeSufficient?: ListItemInput[]
  accessibilityAPI?: string
  accessibilityControl?: string
  accessibilityFeature?: string
  accessibilityHazard?: string
  accessibilitySummary?: string
  accountablePerson?: Person
  aggregateRating?: AggregateRating
  alternativeHeadline?: string
  associatedMedia?: MediaObject
  audience?: Audience
  audio?: AudioObject | Clip | MusicRecording
  author?: Organization | Person
  award?: string
  character?: Person
  citation?: CreativeWork | string
  comment?: Comment
  commentCount?: number
  contentLocation?: Place
  contentRating?: Rating | string
  contributor?: Organization | Person
  copyrightHolder?: Organization | Person
  copyrightYear?: number
  countryOfOrigin?: string
  creator?: Organization | Person
  dateCreated?: ResolvableDate
  dateModified?: ResolvableDate
  datePublished?: ResolvableDate
  discussionUrl?: string
  editor?: Person
  educationalAlignment?: AlignmentObject
  educationalUse?: string
  encoding?: MediaObject
  encodingFormat?: string
  exampleOfWork?: CreativeWork
  expires?: ResolvableDate
  funder?: Organization | Person
  genre?: string
  hasPart?: CreativeWork
  headline?: string
  inLanguage?: string
  interactionStatistic?: SoftwareApplication | WebSite
}

export interface Clip extends CreativeWork {
  '@type': 'Clip'
}

export interface MusicRecording extends CreativeWork {
  '@type': 'MusicRecording'
}

export interface MediaObject extends CreativeWork {
  '@type': 'MediaObject' | string
}

export interface AudioObject extends MediaObject {
  '@type': 'AudioObject'
}

export interface SoftwareApplication extends CreativeWork {
  '@type': 'SoftwareApplication'
}

export const defineCreativeWorkPartial = <K>(input?: DeepPartial<CreativeWork> & K) =>
  // hacky way for users to get around strict typing when using custom schema, route meta or augmentation
  defineCreativeWork(input as CreativeWork)

/**
 * Entities that have a somewhat fixed, physical extension.
 */
export function defineCreativeWork<T extends SchemaNodeInput<CreativeWork>>(input: T) {
  return defineSchemaResolver<T, CreativeWork>(input, {
    required: [
      'name',
    ],
    defaults({ canonicalHost }) {
      return {
        '@type': 'CreativeWork',
        '@id': prefixId(canonicalHost, IdentityId),
        'url': canonicalHost,
      }
    },
    resolve(node, client) {
      resolveId(node, client.canonicalHost)
      return node
    },
  })
}

export const SchemaOrgCreativeWork = defineSchemaOrgComponent('SchemaOrgCreativeWork', defineCreativeWork)
