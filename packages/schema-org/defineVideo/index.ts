import { hash } from 'ohash'
import type { ResolvableDate, SchemaNodeInput } from '../types'
import type { NodeResolver } from '../utils'
import {
  defineNodeResolver,
  ensureBase,
  prefixId,
  resolveDateToIso,
  resolveRouteMeta,
  setIfEmpty,
} from '../utils'
import type { ImageObject } from '../defineImage'

export interface VideoObject extends ImageObject {
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
}

export type VideoOptionalKeys = '@id'|'@type'
export type VideoUsingRouteMeta = VideoOptionalKeys|'name'|'thumbnailUrl'|'description'|'uploadDate'
export type VideoNodeResolver<T extends keyof VideoObject = VideoOptionalKeys> = NodeResolver<VideoObject, T>

/**
 * Describes an individual video (usually in the context of an embedded media object).
 */
export function defineVideo(videoInput: SchemaNodeInput<VideoObject, VideoOptionalKeys>): VideoNodeResolver
export function defineVideo<OptionalKeys extends keyof VideoObject>(videoInput?: SchemaNodeInput<VideoObject, OptionalKeys | VideoOptionalKeys>): VideoNodeResolver<OptionalKeys>
export function defineVideo(videoInput: any) {
  return defineNodeResolver<VideoObject>(videoInput, {
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
      resolveDateToIso(video, 'uploadDate')
      video.url = ensureBase(canonicalHost, video.url)
      setIfEmpty(video, '@id', prefixId(canonicalHost, `#/schema/video/${hash(video.url)}`))
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
