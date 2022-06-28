import type { DeepPartial } from 'utility-types'
import type { PropertyValue, ResolvableDate, SchemaNodeInput, StructuredValue } from '../../types'
import {
  IdentityId,
  defineSchemaResolver,
  prefixId, resolveId,
} from '../../utils'
import { defineSchemaOrgComponent } from '../../components/defineSchemaOrgComponent'
import type { PostalAddress, RelatedAddressInput } from '../PostalAddress'
import { resolveAddress } from '../PostalAddress'
import type { AggregateRating } from '../AggregateRating'
import type { OpeningHours } from '../OpeningHours'
import type { Event } from '../Event'
import type { CreativeWork } from '../CreativeWork'
import type { Image } from '../Image'
import type { Review } from '../Review'

export interface LocationFeature extends PropertyValue {
  '@type': 'LocationFeatureSpecification'
  /**
   * The hours during which this service or contact is available.
   */
  hoursAvailable?: OpeningHours
  /**
   * The date when the item becomes valid.
   */
  validFrom?: ResolvableDate
  /**
   * The date after when the item is not valid.
   * For example the end of an offer, salary period, or a period of opening hours.
   */
  validThrough?: ResolvableDate
}

export interface Map extends CreativeWork {
  '@type': 'Map'
  mapType?: 'ParkingMap' | 'SeatingMap' | 'TransitMap' | 'VenueMap'
}

export interface Photograph extends CreativeWork {
  '@type': 'Photograph'
}

export interface GeoCoordinates extends StructuredValue {
  '@type': 'GeoCoordinates'
  /**
   * Physical address of the item.
   */
  address?: RelatedAddressInput | string
  /**
   * The country. For example, USA. You can also provide the two-letter ISO 3166-1 alpha-2 country code.
   */
  addressCountry?: string
  /**
   * The elevation of a location (WGS 84). Values may be of the form 'NUMBER UNITOFMEASUREMENT'
   * (e.g., '1,000 m', '3,200 ft') while numbers alone should be assumed to be a value in meters.
   */
  elevation?: number | string
  /**
   * The latitude of a location.
   */
  latitude?: number | string
  /**
   * The longitude of a location.
   */
  longitude?: number | string
  /**
   * The postal code.
   */
  postalCode?: string
}

export interface GeoShape extends StructuredValue {
  '@type': 'GeoShape'
  /**
   * Physical address of the item.
   */
  address?: RelatedAddressInput | string
  /**
   * The country. For example, USA. You can also provide the two-letter ISO 3166-1 alpha-2 country code.
   */
  addressCountry?: string
  /**
   * A box is the area enclosed by the rectangle formed by two points.
   * The first point is the lower corner, the second point is the upper corner.
   * A box is expressed as two points separated by a space character.
   */
  box?: string
  /**
   * A circle is the circular region of a specified radius centered at a specified latitude and longitude.
   * A circle is expressed as a pair followed by a radius in meters.
   */
  circle?: string
  /**
   * The elevation of a location (WGS 84). Values may be of the form 'NUMBER UNITOFMEASUREMENT'
   * (e.g., '1,000 m', '3,200 ft') while numbers alone should be assumed to be a value in meters.
   */
  elevation?: number | string
  /**
   * A line is a point-to-point path consisting of two or more points.
   * A line is expressed as a series of two or more point objects separated by space.
   */
  line?: string
  /**
   * A polygon is the area enclosed by a point-to-point path
   * for which the starting and ending points are the same.
   * A polygon is expressed as a series of four or more space
   * delimited points where the first and final points are identical.
   */
  polygon?: string
  /**
   * The postal code.
   */
  postalCode?: string
}

export interface Place extends StructuredValue {
  '@type': 'Place'
  /**
   * A property-value pair representing an additional characteristics of the entitity,
   * e.g. a product feature or another characteristic for which there is no matching property in schema.org.
   */
  additionalProperty?: PropertyValue
  /**
   * Physical address of the item.
   */
  address?: RelatedAddressInput | string
  /**
   * The overall rating, based on a collection of reviews or ratings, of the item.
   */
  aggregateRating?: AggregateRating
  /**
   * An amenity feature (e.g. a characteristic or service) of the Accommodation.
   * This generic property does not make a statement about whether the feature
   * is included in an offer for the main accommodation or available at extra costs.
   */
  amenityFeature?: LocationFeature
  /**
   * A short textual code (also called "store code") that uniquely identifies a place of business.
   * The code is typically assigned by the parentOrganization and used in structured URLs.
   */
  branchCode?: string
  /**
   * The basic containment relation between a place and one that contains it.
   */
  containedInPlace?: Place
  /**
   * The basic containment relation between a place and another that it contains.
   */
  containsPlace?: Place
  /**
   * Upcoming or past event associated with this place, organization, or action.
   */
  event?: Event
  /**
   * The fax number.
   */
  faxNumber?: string
  /**
   * The geo coordinates of the place.
   */
  geo?: GeoCoordinates | GeoShape
  /**
   * Represents a relationship between two geometries (or the places they represent),
   * relating a containing geometry to a contained geometry.
   * "a contains b iff no points of b lie in the exterior of a,
   * and at least one point of the interior of b lies in the interior of a". As defined in DE-9IM.
   */
  geoContains?: Place
  /**
   * Represents a relationship between two geometries (or the places they represent),
   * relating a geometry to another that covers it. As defined in DE-9IM.
   */
  geoCoveredBy?: Place
  /**
   * Represents a relationship between two geometries (or the places they represent),
   * relating a covering geometry to a covered geometry.
   * "Every point of b is a point of (the interior or boundary of) a". As defined in DE-9IM.
   */
  geoCovers?: Place
  /**
   * Represents a relationship between two geometries (or the places they represent),
   * relating a geometry to another that crosses it:
   * "a crosses b: they have some but not all interior points in common,
   * and the dimension of the intersection is less than that of at least one of them". As defined in DE-9IM.
   */
  geoCrosses?: Place
  /**
   * Represents spatial relations in which two geometries
   * (or the places they represent) are topologically disjoint:
   * they have no point in common. They form a set of disconnected geometries."
   * (a symmetric relationship, as defined in DE-9IM)
   */
  geoDisjoint?: Place
  /**
   * Represents spatial relations in which two geometries
   * (or the places they represent) are topologically equal, as defined in DE-9IM.
   * "Two geometries are topologically equal if their interiors intersect and no part
   * of the interior or boundary of one geometry intersects the exterior of the other (a symmetric relationship)
   */
  geoEquals?: Place
  /**
   * Represents spatial relations in which two geometries (or the places they represent)
   * have at least one point in common. As defined in DE-9IM.
   */
  geoIntersects?: Place
  /**
   * Represents a relationship between two geometries (or the places they represent),
   * relating a geometry to another that geospatially overlaps it,
   * i.e. they have some but not all points in common. As defined in DE-9IM.
   */
  geoOverlaps?: Place
  /**
   * Represents spatial relations in which two geometries (or the places they represent) touch:
   * they have at least one boundary point in common, but no interior points."
   * (a symmetric relationship, as defined in DE-9IM )
   */
  geoTouches?: Place
  /**
   * Represents a relationship between two geometries (or the places they represent),
   * relating a geometry to one that contains it, i.e. it is inside (i.e. within) its interior.
   * As defined in DE-9IM.
   */
  geoWithin?: Place
  /**
   * The Global Location Number (GLN, sometimes also referred to as International Location Number or ILN)
   * of the respective organization, person, or place.
   * The GLN is a 13-digit number used to identify parties and physical locations.
   */
  globalLocationNumber?: string
  /**
   * A URL to a map of the place.
   */
  hasMap?: Map | string
  /**
   * A flag to signal that the item, event, or place is accessible for free.
   */
  isAccessibleForFree?: boolean
  /**
   * The International Standard of Industrial Classification of All Economic Activities (ISIC),
   * Revision 4 code for a particular organization, business person, or place.
   */
  isicV4?: string
  /**
   * Keywords or tags used to describe some item.
   * Multiple textual entries in a keywords list are typically delimited by commas,
   * or by repeating the property.
   */
  keywords?: string
  /**
   * The latitude of a location.
   */
  latitude?: number | string
  /**
   * An associated logo.
   */
  logo?: Image | string
  /**
   * The longitude of a location.
   */
  longitude?: string
  /**
   * The total number of individuals that may attend an event or venue.
   */
  maximumAttendeeCapacity?: number
  /**
   * The opening hours of a certain place.
   */
  openingHoursSpecification?: OpeningHours
  /**
   * A photograph of this place.
   */
  photo?: Image | Photograph
  /**
   * A flag to signal that the Place is open to public visitors.
   * If this property is omitted there is no assumed default boolean value
   */
  publicAccess?: boolean
  /**
   * A review of the item.
   */
  review?: Review
  /**
   * A slogan or motto associated with the item.
   */
  slogan?: string
  /**
   * Indicates whether it is allowed to smoke in the place, e.g. in the restaurant, hotel or hotel room.
   */
  smokingAllowed?: string
  /**
   * The special opening hours of a certain place.
   * Use this to explicitly override general opening hours
   * brought in scope by openingHoursSpecification or openingHours.
   */
  specialOpeningHoursSpecification?: OpeningHours
  /**
   * The telephone number.
   */
  telephone?: string
}

export const definePlacePartial = <K>(input?: DeepPartial<Place> & K) =>
  // hacky way for users to get around strict typing when using custom schema, route meta or augmentation
  definePlace(input as Place)

/**
 * Entities that have a somewhat fixed, physical extension.
 */
export function definePlace<T extends SchemaNodeInput<Place>>(input: T) {
  return defineSchemaResolver<T, Place>(input, {
    required: [
      'name',
    ],
    defaults({ canonicalHost }) {
      return {
        '@type': 'Place',
        '@id': prefixId(canonicalHost, IdentityId),
        'url': canonicalHost,
      }
    },
    resolve(node, client) {
      if (node.address && typeof node.address !== 'string')
        node.address = resolveAddress(client, node.address) as PostalAddress
      resolveId(node, client.canonicalHost)
      return node
    },
  })
}

export const SchemaOrgPlace = defineSchemaOrgComponent('SchemaOrgPlace', definePlace)
