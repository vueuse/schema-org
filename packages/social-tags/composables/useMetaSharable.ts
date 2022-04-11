import type { Ref } from 'vue'
import {
  ref,
} from 'vue'
import { useMetaTitle } from './useMetaTitle'
import { useMetaDescription } from './useMetaDescription'
import { useMetaImage } from './useMetaImage'
import { useMeta } from '#meta'

type MaybeRef<T> = T | Ref<T>

interface ShareEntity {
  title?: string
  description?: string
  image?: string
}

interface MetaSharableOptions extends ShareEntity {
  twitter?: false|ShareEntity
  og?: false|ShareEntity
  labels?: { label: string; data: string }[]
}

export const useMetaSharable = (options: MaybeRef<MetaSharableOptions | null | undefined> = null) => {
  if (!options)
    return

  const value = unref(options)
  if (value.title)
    useMetaTitle(value.title)

  if (value.description)
    useMetaDescription(value.description)

  if (value.image)
    useMetaImage(value.image)
}
