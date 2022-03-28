import {
  ref,
  Ref,
} from 'vue'
import { useMeta } from '#meta'
import {useMetaRobots} from "./useRobots";

type MaybeRef<T> = T | Ref<T>

interface UseTitleOptions {
  ogTitle?: string
}

export const useMetaNoIndex = (indexable: MaybeRef<boolean | null | undefined> = null) => {
  if (typeof indexable === 'boolean') {
    return useMetaRobots(indexable ? 'index, follow' : 'noindex, nofollow')
  }
  return ref(useMetaRobots().value.contains('noindex'))
}
