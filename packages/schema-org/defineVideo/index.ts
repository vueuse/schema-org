import { hash } from 'ohash'
import type { DeepPartial } from 'utility-types'
import type { ResolvableDate, SchemaNodeInput, Thing } from '../types'
import {
  callAsPartial, defineNodeResolver,
  prefixId,
  resolveDateToIso,
  resolveId, resolveRouteMeta,
  resolveWithBaseUrl,
  setIfEmpty,
} from '../utils'
import type { ImageObject } from '../defineImage'

export interface VideoObject extends Thing {
  '@type': 'VideoObject'
  /**
   * The title of the video.
   */
  name: string
  /**
   * A description of the video (falling back to the caption, then to 'No description').
   */
  description: string
  /**
   * A reference-by-ID to an imageObject.
   */
  thumbnailUrl: string
  /**
   * The date the video was published, in ISO 8601 format (e.g., 2020-01-20).
   */
  uploadDate: ResolvableDate
  /**
   * Whether the video should be considered 'family friendly'
   */
  isFamilyFriendly?: boolean
  /**
   * The URL of the image file (e.g., /images/cat.jpg).
   */
  url: string
  /**
   * The fully-qualified, absolute URL of the image file (e.g., https://www.example.com/images/cat.jpg).
   * Note: The contentUrl and url properties are intentionally duplicated.
   */
  contentUrl?: string
  /**
   * A text string describing the image.
   * - Fall back to the image alt attribute if no specific caption field exists or is defined.
   */
  caption?: string
  /**
   * The height of the image in pixels.
   * - Must be used with width.
   */
  height?: number
  /**
   * The width of the image in pixels.
   * - Must be used with height.
   */
  width?: number
  /**
   * The language code for the textual content; e.g., en-GB.
   * - Only needed when providing a caption.
   */
  inLanguage?: string
  /**
   * The duration of the video in ISO 8601 format.
   */
  duration?: string
  /**
   * A URL pointing to a player for the video.
   */
  embedUrl?: string
}

export const defineVideoPartial = <K>(input?: DeepPartial<VideoObject> & K) =>
  // hacky way for users to get around strict typing when using custom schema, route meta or augmentation
  callAsPartial(defineVideo, input)

/**
 * Describes an individual video (usually in the context of an embedded media object).
 */
export function defineVideo<T extends SchemaNodeInput<VideoObject>>(input: T) {
  return defineNodeResolver<T, VideoObject>(input, {
    required: [
      'name',
      'description',
      'thumbnailUrl',
      'uploadDate',
    ],
    defaults({ currentRouteMeta }) {
      const defaults: Partial<VideoObject> = {
        '@type': 'VideoObject',
      }
      resolveRouteMeta(defaults, currentRouteMeta, [
        'name',
        'description',
        'image',
        'uploadDate',
      ])
      return defaults
    },
    resolve(video, { canonicalHost }) {
      if (video.uploadDate)
        video.uploadDate = resolveDateToIso(video.uploadDate)
      video.url = resolveWithBaseUrl(canonicalHost, video.url)
      setIfEmpty(video, '@id', prefixId(canonicalHost, `#/schema/video/${hash(video.url)}`))
      resolveId(video, canonicalHost)
      return video
    },
    mergeRelations(video, { findNode }) {
      if (video.image && !video.thumbnailUrl) {
        const firstImage = (Array.isArray(video.image) ? video.image[0] : video.image) as ImageObject
        setIfEmpty(video, 'thumbnailUrl', findNode<ImageObject>(firstImage['@id'])?.url)
      }
    },
  })
}
