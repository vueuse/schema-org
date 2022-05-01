import { defu } from 'defu'
import type { Arrayable, IdReference, SchemaNodeInput, Thing } from '../types'
import { resolver } from '../utils'

type DayOfWeek = 'Friday' |
'Monday' |
'PublicHolidays' |
'Saturday' |
'Sunday' |
'Thursday' |
'Tuesday' |
'Wednesday'

type Time = `${number}${number}:${number}${number}`

export interface OpeningHoursSpecification extends Thing {
  '@type': 'OpeningHoursSpecification'
  /**
   * The day of the week for which these opening hours are valid.
   */
  dayOfWeek: Arrayable<DayOfWeek>
  /**
   * The opening hour of the place or service on the given day(s) of the week.
   */
  opens?: Time
  /**
   * The closing hour of the place or service on the given day(s) of the week.
   */
  closes?: Time
  /**
   * The date when the item becomes valid.
   */
  validFrom?: string | Date
  /**
   * The date after when the item is not valid. For example, the end of an offer, salary period, or a period of opening hours.
   */
  validThrough?: string | Date
}

export type OpeningHoursInput = SchemaNodeInput<OpeningHoursSpecification> | IdReference

/**
 * Describes an offer for a Product (typically prices, stock availability, etc).
 */
export function resolveOpeningHours(input: Arrayable<OpeningHoursInput>) {
  return resolver<OpeningHoursInput, OpeningHoursSpecification>(input, (input) => {
    return defu(input, {
      '@type': 'OpeningHoursSpecification',
      'opens': '00:00',
      'closes': '23:59',
    }) as OpeningHoursSpecification
  })
}
