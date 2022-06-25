import type { DeepPartial } from 'utility-types'
import type {SchemaNodeInput, Thing, Intangible, ResolvableDate} from '../../types'
import {
  IdentityId,
  defineSchemaResolver,
  prefixId,
  resolveId, resolveType,
} from '../../utils'
import type { Organization } from '../Organization'
import type {PostalAddress, RelatedAddressInput} from '../PostalAddress'
import { resolveAddress } from '../PostalAddress'
import type { OpeningHoursInput } from '../OpeningHours'
import { resolveOpeningHours } from '../OpeningHours'
import type { SingleImageInput } from '../Image'
import { resolveImages } from '../Image'
import { defineSchemaOrgComponent } from '../../components/defineSchemaOrgComponent'
import {Person} from "../Person";
import {AggregateRating} from "../AggregateRating";
import {Arrayable, IdReference} from "../../types";
import {Place} from "../Place";
import {Offer} from "../Offer";

interface Audience extends Intangible {
  /**
   * The target group associated with a given audience (e.g. veterans, car owners, musicians, etc.).
   */
  audienceType?: string

  geographicArea?: Arrayable<IdReference>
}

export interface Event extends Thing {
  '@type': 'Event'
  /**
   * The subject matter of the content.
   */
  about?: Thing
  /**
   * An actor, e.g. in tv, radio, movie, video games etc., or in an event.
   * Actors can be associated with individual items or with a series, episode, clip.
   */
  actor?: Person
  /**
   * The overall rating, based on a collection of reviews or ratings, of the item.
   */
  aggregateRating?: AggregateRating
  /**
   * A person or organization attending the event.
   */
  attendee?: Organization | Person
  /**
   * An intended audience, i.e. a group for whom something was created.
   */
  audience?: Audience
  /**
   * The person or organization who wrote a composition, or who is the composer of a work performed at some event.
   */
  composer?: Organization | Person
  /**
   * A secondary contributor to the CreativeWork or Event.
   */
  contributor?: Organization | Person
  /**
   * A director of e.g. tv, radio, movie, video gaming etc. content, or of an event.
   * Directors can be associated with individual items or with a series, episode, clip.
   */
  director?: Person
  /**
   * The time admission will commence.
   */
  doorTime?: ResolvableDate
  /**
   * The duration of the item (movie, audio recording, event, etc.) in ISO 8601 date format.
   */
  duration?: string
  /**
   * The end date and time of the item (in ISO 8601 date format).
   */
  endDate?: ResolvableDate
  /**
   * An eventStatus of an event represents its status; particularly useful when an event is cancelled or rescheduled.
   */
  eventStatus?: 'EventCancelled' | 'EventMovedOnline' | 'EventPostponed' | 'EventRescheduled' | 'EventScheduled'
  /**
   * A person or organization that supports (sponsors) something through some kind of financial contribution.
   */
  funder?: Organization | Person
  /**
   * The language of the content or performance or used in an action.
   * Please use one of the language codes from the IETF BCP 47 standard.
   */
  inLanguage?: string
  /**
   * A flag to signal that the item, event, or place is accessible for free.
   */
  isAccessibleForFree?: boolean
  /**
   * Keywords or tags used to describe some item.
   * Multiple textual entries in a keywords list are typically delimited by commas, or by repeating the property.
   */
  keywords?: string
  /**
   * The location of, for example, where an event is happening,
   * where an organization is located, or where an action takes place.
   */
  location?: Place | PostalAddress | string
  /**
   * The total number of individuals that may attend an event or venue.
   */
  maximumAttendeeCapacity?: number
  /**
   * An offer to provide this item—for example, an offer to sell a product,
   * rent the DVD of a movie, perform a service, or give away tickets to an event.
   * Use businessFunction to indicate the kind of transaction offered, i.e. sell, lease, etc.
   * This property can also be used to describe a Demand.
   * While this property is listed as expected on a number of common types, it can be used in others.
   * In that case, using a second type, such as Product or a subtype of Product, can clarify the nature of the offer.
   */
  offers?: Offer
  /**
   * An organizer of an Event.
   */
  organizer?: Organization | Person
  /**
   * A performer at the event—for example, a presenter, musician, musical group or actor.
   */
  performer?: Organization | Person
  /**
   * Used in conjunction with eventStatus for rescheduled or cancelled events.
   * This property contains the previously scheduled start date.
   * For rescheduled events, the startDate property should be used for the newly scheduled start date.
   * In the (rare) case of an event that has been postponed and rescheduled multiple times, this field may be repeated.
   */
  previousStartDate?: ResolvableDate
}

export const defineEventPartial = <K>(input?: DeepPartial<Event> & K) =>
    // hacky way for users to get around strict typing when using custom schema, route meta or augmentation
    defineEvent(input as Event)

/**
 * An event happening at a certain time and location, such as a concert, lecture, or festival.
 *
 * Ticketing information may be added via the "offers" property.
 * Repeated events may be structured as separate Event objects.
 */
export function defineEvent<T extends SchemaNodeInput<Event>>(input: T) {
  return defineSchemaResolver<T, Event>(input, {
    required: [
      'name',
    ],
    defaults({ canonicalHost, options }) {
      return {
        '@type': 'Event',
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

export const SchemaOrgEvent = defineSchemaOrgComponent('SchemaOrgEvent', defineEvent)
