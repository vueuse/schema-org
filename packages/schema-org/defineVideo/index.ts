import { hash } from 'ohash'
import type { Arrayable, IdReference, WithAmbigiousFields } from '../types'
import { defineNodeResolver, ensureBase, prefixId, resolveDateToIso, setIfEmpty } from '../utils'
import type { ImageObject } from '../defineImage'

export interface VideoObject extends ImageObject {
  /**
   * The title of the video.
   */
  name?: string
  /**
   * A description of the video (falling back to the caption, then to 'No description').
   */
  description?: string
  /**
   * A reference-by-ID to an imageObject.
   */
  thumbnailUrl?: Arrayable<ImageObject|IdReference>
  /**
   * The date the video was published, in ISO 8601 format (e.g., 2020-01-20).
   */
  uploadDate: string|Date
  /**
   * Whether the video should be considered 'family friendly'
   */
  isFamilyFriendly?: boolean
}

/**
 * Describes an individual image (usually in the context of an embedded media object).
 */
export function defineVideo(video: WithAmbigiousFields<VideoObject>) {
  return defineNodeResolver<VideoObject>(video, {
    defaults({ currentRouteMeta }) {
      return {
        '@type': 'VideoObject',
        'name': currentRouteMeta.title as string,
        'description': currentRouteMeta.description as string,
        'image': currentRouteMeta.image as string,
      }
    },
    resolve(video, { canonicalHost }) {
      resolveDateToIso(video, 'uploadDate')

      video.url = ensureBase(canonicalHost, video.url)
      setIfEmpty(video, '@id', prefixId(canonicalHost, `#/schema/video/${hash(video.url)}`))

      return video
    },
  })
}
