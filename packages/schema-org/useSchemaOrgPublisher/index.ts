import type {Organization, Person} from 'schema-dts'
import { defu } from 'defu'
import {OmitType, Publisher} from '../types'
import {useSchemaOrgMeta} from "../useSchemaOrgMeta";

export function defineOrganization(organization?: OmitType<Organization>) {
  return defu(organization, {
    '@type': 'Organization',
  })
}

export function definePerson(person?: OmitType<Person>) {
  return defu(person, {
    '@type': 'Person',
  })
}

/**
 * Schema.org Publisher
 */
export function useSchemaOrgPublisher(
  publisher?: Publisher,
) {
  // setting the publisher
  if (publisher) {
    return useSchemaOrgMeta({
      publisher
    })
  }
  // return the publisher
  const meta = useSchemaOrgMeta()
  if (meta.value?.publisher) {
    return meta.value?.publisher
  }
  return null
}
