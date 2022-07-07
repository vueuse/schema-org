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
import type { Product } from '../Product'
import type { Offer } from '../Offer'
import type { Event, PublicationEvent } from '../Event'
import type { Review } from '../Review'
import type { Video } from '../Video'

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
  /**
   * The subject matter of the content.
   */
  about?: Thing
  /**
   * The human sensory perceptual system or cognitive faculty
   * through which a person may process or perceive information.
   * Values should be drawn from the approved vocabulary.
   */
  accessMode?: string
  /**
   * A list of single or combined accessModes that are sufficient
   * to understand all the intellectual content of a resource.
   * Values should be drawn from the approved vocabulary.
   */
  accessModeSufficient?: ListItemInput[]
  /**
   * Indicates that the resource is compatible with the referenced accessibility API.
   * Values should be drawn from the approved vocabulary.
   */
  accessibilityAPI?: string
  /**
   * Identifies input methods that are sufficient to fully control the described resource.
   * Values should be drawn from the approved vocabulary.
   */
  accessibilityControl?: string
  /**
   * Content features of the resource, such as accessible media,
   * alternatives and supported enhancements for accessibility.
   * Values should be drawn from the approved vocabulary.
   */
  accessibilityFeature?: string
  /**
   * A characteristic of the described resource that is physiologically dangerous to some users.
   * Related to WCAG 2.0 guideline 2.3. Values should be drawn from the approved vocabulary.
   */
  accessibilityHazard?: string
  /**
   * A human-readable summary of specific accessibility features or deficiencies,
   * consistent with the other accessibility metadata but expressing subtleties
   * such as "short descriptions are present but long descriptions will be needed
   * for non-visual users" or "short descriptions are present and no long descriptions are needed."
   */
  accessibilitySummary?: string
  /**
   * Specifies the Person that is legally accountable for the CreativeWork.
   */
  accountablePerson?: Person
  /**
   * The overall rating, based on a collection of reviews or ratings, of the item.
   */
  aggregateRating?: AggregateRating
  /**
   * A secondary title of the CreativeWork.
   */
  alternativeHeadline?: string
  /**
   * A media object that encodes this CreativeWork. This property is a synonym for encoding.
   */
  associatedMedia?: MediaObject
  /**
   * An intended audience, i.e. a group for whom something was created. Supersedes serviceAudience.
   */
  audience?: Audience
  /**
   * An embedded audio object.
   */
  audio?: AudioObject | Clip | MusicRecording
  /**
   * The author of this content or rating. Please note that author is special in that
   * HTML 5 provides a special mechanism for indicating authorship via the rel tag.
   * That is equivalent to this and may be used interchangeably.
   */
  author?: Organization | Person
  /**
   * An award won by or for this item. Supersedes awards.
   */
  award?: string
  /**
   * Fictional person connected with a creative work.
   */
  character?: Person
  /**
   * A citation or reference to another creative work, such as another publication, web page, scholarly article, etc.
   */
  citation?: CreativeWork | string
  /**
   * Comments, typically from users.
   */
  comment?: Comment
  /**
   * The number of comments this CreativeWork (e.g. Article, Question or Answer) has received.
   * This is most applicable to works published in Web sites with commenting system;
   * additional comments may exist elsewhere.
   */
  commentCount?: number
  /**
   * The location depicted or described in the content. For example, the location in a photograph or painting.
   */
  contentLocation?: Place
  /**
   * Official rating of a piece of content—for example,'MPAA PG-13'.
   */
  contentRating?: Rating | string
  /**
   * A secondary contributor to the CreativeWork or Event.
   */
  contributor?: Organization | Person
  /**
   * The party holding the legal copyright to the CreativeWork.
   */
  copyrightHolder?: Organization | Person
  /**
   * The year during which the claimed copyright for the CreativeWork was first asserted.
   */
  copyrightYear?: number
  /**
   * The country of origin of something, including products as well as creative works such as movie and TV content.
   *
   * In the case of TV and movie, this would be the country of the principle offices
   * of the production company or individual responsible for the movie.
   * For other kinds of CreativeWork it is difficult to provide fully general guidance,
   * and properties such as contentLocation and locationCreated may be more applicable.
   *
   * In the case of products, the country of origin of the product.
   * The exact interpretation of this may vary by context and product type, and cannot be fully enumerated here.
   */
  countryOfOrigin?: string
  /**
   * The creator/author of this CreativeWork. This is the same as the Author property for CreativeWork.
   */
  creator?: Organization | Person
  /**
   * The date on which the CreativeWork was created or the item was added to a DataFeed.
   */
  dateCreated?: ResolvableDate
  /**
   * The date on which the CreativeWork was most recently modified or when the item's entry was modified within a DataFeed.
   */
  dateModified?: ResolvableDate
  /**
   * Date of first broadcast/publication.
   */
  datePublished?: ResolvableDate
  /**
   * A link to the page containing the comments of the CreativeWork.
   */
  discussionUrl?: string
  /**
   * Specifies the Person who edited the CreativeWork.
   */
  editor?: Person
  /**
   * An alignment to an established educational framework.
   *
   * This property should not be used where the nature of the alignment can be described using a simple property,
   * for example to express that a resource teaches or assesses a competency.
   */
  educationalAlignment?: AlignmentObject
  /**
   * The purpose of a work in the context of education; for example, 'assignment', 'group work'.
   */
  educationalUse?: string
  /**
   * A media object that encodes this CreativeWork. This property is a synonym for associatedMedia.
   */
  encoding?: MediaObject
  /**
   * Media type typically expressed using a MIME format (see IANA site and MDN reference)
   * e.g. application/zip for a SoftwareApplication binary, audio/mpeg for .mp3 etc.).
   *
   * In cases where a CreativeWork has several media type representations,
   * encoding can be used to indicate each MediaObject alongside particular encodingFormat information.
   *
   * Unregistered or niche encoding and file formats can be indicated instead via the most appropriate URL,
   * e.g. defining Web page or a Wikipedia/Wikidata entry.
   */
  encodingFormat?: string
  /**
   * A creative work that this work is an example/instance/realization/derivation of.
   * Inverse property: workExample
   */
  exampleOfWork?: CreativeWork
  /**
   * Date the content expires and is no longer useful or available.
   * For example a VideoObject or NewsArticle whose availability or relevance is time-limited,
   * or a ClaimReview fact check whose publisher wants to indicate that it may no longer be relevant
   * (or helpful to highlight) after some date.
   */
  expires?: ResolvableDate
  /**
   * A person or organization that supports (sponsors) something through some kind of financial contribution.
   */
  funder?: Organization | Person
  /**
   * Genre of the creative work, broadcast channel or group.
   */
  genre?: string
  /**
   * Indicates an item or CreativeWork that is part of this item, or CreativeWork (in some sense).
   */
  hasPart?: CreativeWork
  /**
   * Headline of the article.
   */
  headline?: string
  /**
   * The language of the content or performance or used in an action.
   * Please use one of the language codes from the IETF BCP 47 standard.
   */
  inLanguage?: string
  /**
   * The number of interactions for the CreativeWork using the WebSite or SoftwareApplication.
   * The most specific child type of InteractionCounter should be used.
   */
  interactionStatistic?: SoftwareApplication | WebSite
  /**
   * The predominant mode of learning supported by the learning resource.
   * Acceptable values are 'active', 'expositive', or 'mixed'.
   */
  interactivityType?: string
  /**
   * A flag to signal that the item, event, or place is accessible for free.
   */
  isAccessibleForFree?: boolean
  /**
   * A resource from which this work is derived or from which it is a modification or adaption.
   */
  isBasedOn?: CreativeWork | Product | string
  /**
   * Indicates whether this content is family friendly.
   */
  isFamilyFriendly?: boolean
  /**
   * Indicates an item or CreativeWork that this item, or CreativeWork (in some sense), is part of.
   */
  isPartOf?: CreativeWork | string
  /**
   * Keywords or tags used to describe some item.
   * Multiple textual entries in a keywords list are typically delimited by commas, or by repeating the property.
   */
  keywords?: string
  /**
   * The predominant type or kind characterizing the learning resource. For example, 'presentation', 'handout'.
   */
  learningResourceType?: string
  /**
   * A license document that applies to this content, typically indicated by URL.
   */
  license?: CreativeWork | string
  /**
   * The location where the CreativeWork was created,
   * which may not be the same as the location depicted in the CreativeWork.
   */
  locationCreated?: Place
  /**
   * Indicates the primary entity described in some page or other CreativeWork.
   */
  mainEntity?: Thing
  /**
   * A material that something is made from, e.g. leather, wool, cotton, paper.
   */
  material?: Product | string
  /**
   * Indicates that the CreativeWork contains a reference to, but is not necessarily about a concept.
   */
  mentions?: Thing
  /**
   * An offer to provide this item—for example, an offer to sell a product,
   * rent the DVD of a movie, perform a service, or give away tickets to an event.
   * Use businessFunction to indicate the kind of transaction offered, i.e. sell, lease, etc.
   * This property can also be used to describe a Demand.
   * While this property is listed as expected on a number of common types, it can be used in others.
   * In that case, using a second type, such as Product or a subtype of Product, can clarify the nature of the offer.
   */
  offers: Offer
  /**
   * The position of an item in a series or sequence of items.
   */
  position?: number | string
  /**
   * The person or organization who produced the work (e.g. music album, movie, tv/radio series etc.).
   */
  producer?: Organization | Person
  /**
   * A publication event associated with the item.
   */
  publication?: PublicationEvent
  /**
   * The publisher of the creative work.
   */
  publisher?: Organization | Person
  /**
   * The publishing division which published the comic.
   */
  publisherImprint?: Organization
  /**
   * The publishingPrinciples property indicates (typically via URL)
   * a document describing the editorial principles of an Organization (or individual
   * e.g. a Person writing a blog) that relate to their activities as a publisher,
   * e.g. ethics or diversity policies. When applied to a CreativeWork (e.g. NewsArticle)
   * the principles are those of the party primarily responsible for the creation of the CreativeWork.
   *
   * While such policies are most typically expressed in natural language,
   * sometimes related information (e.g. indicating a funder) can be expressed using schema.org terminology.
   */
  publishingPrinciples?: CreativeWork | string
  /**
   * The Event where the CreativeWork was recorded. The CreativeWork may capture all or part of the event.
   */
  recordedAt?: Event
  /**
   * The place and time the release was issued, expressed as a PublicationEvent.
   */
  releasedEvent?: PublicationEvent
  /**
   * A review of the item.
   */
  review?: Review
  /**
   * Indicates (by URL or string) a particular version of a schema used in some CreativeWork.
   * This property was created primarily to indicate the use of a specific schema.org release,
   * e.g. 10.0 as a simple string, or more explicitly via URL, https://schema.org/docs/releases.html#v10.0.
   * There may be situations in which other schemas might usefully be referenced this way,
   * e.g. http://dublincore.org/specifications/dublin-core/dces/1999-07-02/
   * but this has not been carefully explored in the community.
   */
  schemaVersion: string
  /**
   * The Organization on whose behalf the creator was working.
   */
  sourceOrganization?: Organization
  /**
   * The "spatial" property can be used in cases when more specific properties
   * (e.g. locationCreated, spatialCoverage, contentLocation) are not known to be appropriate.
   */
  spatial?: Place
  /**
   * The spatialCoverage of a CreativeWork indicates the place(s) which are the focus of the content.
   * It is a subproperty of contentLocation intended primarily for more technical and detailed materials.
   * For example with a Dataset, it indicates areas that the dataset describes:
   * a dataset of New York weather would have spatialCoverage which was the place: the state of New York.
   */
  spatialCoverage?: Place
  /**
   * A person or organization that supports a thing through a pledge, promise, or financial contribution.
   * e.g. a sponsor of a Medical Study or a corporate sponsor of an event.
   */
  sponsor?: Organization | Person
  /**
   * The "temporal" property can be used in cases where more specific properties
   * (e.g. temporalCoverage, dateCreated, dateModified, datePublished) are not known to be appropriate.
   */
  temporal?: ResolvableDate | string
  /**
   * The temporalCoverage of a CreativeWork indicates the period that the content applies to, i.e. that it describes,
   * either as a DateTime or as a textual string indicating a time period in ISO 8601 time interval format.
   * In the case of a Dataset it will typically indicate the relevant time period in a precise notation
   * (e.g. for a 2011 census dataset, the year 2011 would be written "2011/2012").
   * Other forms of content e.g. ScholarlyArticle, Book, TVSeries or TVEpisode
   * may indicate their temporalCoverage in broader terms - textually or via well-known URL.
   * Written works such as books may sometimes have precise temporal coverage too,
   * e.g. a work set in 1939 - 1945 can be indicated in ISO 8601 interval format format via "1939/1945".
   *
   * Open-ended date ranges can be written with ".." in place of the end date.
   * For example, "2015-11/.." indicates a range beginning in November 2015 and with no specified final date.
   * This is tentative and might be updated in future when ISO 8601 is officially updated.
   */
  temporalCoverage?: ResolvableDate | string
  /**
   * The textual content of this CreativeWork.
   */
  text?: string
  /**
   * A thumbnail image relevant to the Thing.
   */
  thumbnailUrl?: string
  /**
   * Approximate or typical time it takes to work with or through this
   * learning resource for the typical intended target audience, e.g. 'PT30M', 'PT1H25M'.
   */
  timeRequired?: string
  /**
   * The work that this work has been translated from. e.g. 物种起源 is a translationOf “On the Origin of Species”
   */
  translationOfWork?: CreativeWork
  /**
   * Organization or person who adapts a creative work to different languages,
   * regional differences and technical requirements of a target market, or that translates during some event.
   */
  translator?: Organization | Person
  /**
   * The typical expected age range, e.g. '7-9', '11-'.
   */
  typicalAgeRange?: string
  /**
   * The version of the CreativeWork embodied by a specified resource.
   */
  version?: number | string
  /**
   * An embedded video object.
   */
  video?: Clip | Video
  /**
   * Example/instance/realization/derivation of the concept of this creative work.
   * eg. The paperback edition, first edition, or eBook.
   */
  workExample?: CreativeWork
  /**
   * A work that is a translation of the content of this work.
   * e.g. 西遊記 has an English workTranslation “Journey to the West”,
   * a German workTranslation “Monkeys Pilgerfahrt” and a Vietnamese translation Tây du ký bình khảo.
   */
  workTranslation?: CreativeWork
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
