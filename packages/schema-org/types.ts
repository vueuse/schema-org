import {Organization, Person} from "schema-dts";

export type OmitType<T> = Omit<T, '@type'>

export type Publisher = Organization | Person | IdReference
