import {
  ref,
  Ref,
} from 'vue'
import { useMeta } from '#meta'

type MaybeRef<T> = T | Ref<T>

interface UseMetaImageOptions {
  ogImage?: string
}

export const useMetaImage = (newImage: MaybeRef<string | null | undefined> = null, options: UseMetaImageOptions = {}) => {
  const document = process.client ? window.document : undefined
  const image = ref(newImage ?? document?.querySelector('meta[name="image"]')?.content ?? null)
  useMeta({
    meta: [
      {
        name: 'image',
        content: image,
      },
      {
        property: 'og:image',
        content: options.ogImage ?? image,
      }
    ],
  })
  return image
}
