import type { IdReference, OptionalMeta } from '../types'
import { defineNodeResolverSchema } from '../utils'
import type { ImageObject } from '../defineImage'

export interface VideoObject extends ImageObject {
  /**
   * The title of the video.
   */
  name: string
  /**
   * @todo A description of the video (falling back to the caption, then to 'No description').
   */
  description: string
  /**
   * A reference-by-ID to an imageObject.
   */
  thumbnailUrl: IdReference
  /**
   * The date the video was published, in ISO 8601 format (e.g., 2020-01-20).
   */
  uploadDate: string
  /**
   * @todo Whether the video should be considered 'family friendly', default to true, may be set to false.
   */
  isFamilyFriendly?: boolean
}

/**
 * Describes an individual image (usually in the context of an embedded media object).
 */
export function defineVideo(video: OptionalMeta<ImageObject, '@type'>) {
  return defineNodeResolverSchema(video, {
    defaults: {
      '@type': 'VideoObject',
    },
  })
}
