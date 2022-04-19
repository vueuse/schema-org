# Vue Article Schema.org

**Type**: `defineArticle(partialArtical: Partial<Article>)`

Describes an `Article` on a `WebPage`.

## Required

- 


## Features

- Able to provide `dateModified` or `datePublished` as Date objects

## Defaults

- **@type**: Article,
- **@id**: `${canonicalUrl}#article`,
- **headline**: `currentRouteMeta.title as string`,
- **description**: `currentRouteMeta.description as string`,
- **inLanguage**: `options.defaultLanguage`

### Examples
