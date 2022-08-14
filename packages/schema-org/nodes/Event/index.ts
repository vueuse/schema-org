import type { DeepPartial } from 'utility-types'
import type { Id, ResolvableDate, SchemaNodeInput, Thing } from '../../types'
import {
  IdentityId,
  defineSchemaResolver,
  prefixId,
  resolveId,
} from '../../utils'
import type { Organization } from '../Organization'
import type { PostalAddress } from '../PostalAddress'
import { defineSchemaOrgComponent } from '../../components/defineSchemaOrgComponent'
import type { Person } from '../Person'
import type { Offer } from '../Offer'
import type { ImageInput } from '../Image'

export interface Place extends Thing {
  '@type': 'Place'
  name: string
  address: PostalAddress
}

export interface VirtualLocation extends Thing {
  '@type': 'VirtualLocation'
  /**
   * URL of the item.
   */
  url: string
}

export interface Event extends Thing {
  /**
   * Description of the event.
   * Describe all details of the event to make it easier for users to understand and attend the event.
   */
  description?: string
  /**
   * The end date and time of the item (in ISO 8601 date format).
   */
  endDate?: ResolvableDate
  /**
   * The eventAttendanceMode of an event indicates whether it occurs online, offline, or a mix.
   */
  eventAttendanceMode?: Id
  /**
   * An eventStatus of an event represents its status; particularly useful when an event is cancelled or rescheduled.
   */
  eventStatus?: 'EventCancelled' | 'EventMovedOnline' | 'EventPostponed' | 'EventRescheduled' | 'EventScheduled'
  /**
   * Repeated ImageObject or URL
   *
   * URL of an image or logo for the event or tour.
   * Including an image helps users understand and engage with your event.
   * We recommend that images are 1920px wide (the minimum width is 720px).
   */
  image?: ImageInput
  /**
   * The location of the event.
   * There are different requirements depending on if the event is happening online or at a physical location
   */
  location?: Place | VirtualLocation
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
  /**
   * The start date and time of the item (in ISO 8601 date format).
   */
  startDate?: ResolvableDate
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
      'location',
      'startDate',
    ],
    defaults({ canonicalHost }) {
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
