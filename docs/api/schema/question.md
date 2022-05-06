# Vue Schema.org Question

- **Type**: `defineQuestion(question: Question)`

  Describes an individual question. Most commonly used for creating an FAQ type page.

- **Type**: `defineQuestionPartial(question: DeepPartial<Question>)`

  Alias: defineQuestion, less strict types. Useful for augmentation.


## Useful Links

- [Schema.org Question](https://schema.org/Question)
- [Recipe: FAQ](/guide/recipes/faq)

## Required properties

- **name** `string`

  The text content of the question.

- **acceptedAnswer** `string|Answer`

  The text content of the answer.


## Examples

### Minimal

```ts
defineQuestion({
  name: 'What is the meaning of life?',
  acceptedAnswer: '42',
})
```

## Defaults

- **@type**: `Question`
- **@id**: `${canonicalUrl}#/schema/question/${questionId}`
- **inLanguage**: `options.defaultLanguage` _(see: [global config](/guide/global-config.html))_

## Resolves

See [Global Resolves](/guide/how-it-works.html#global-resolves) for full context.

- will convert a string answer to an [Answer](https://schema.org/Answer) object.
- `@id` is resolved using a hash of the question name if not provided

## Relation Transforms

[WebPage](/api/schema/webpage)

- Each question will append an entry on to `mainEntity`

## Type Definition

```ts
/**
 * A specific question - e.g. from a user seeking answers online, or collected in a Frequently Asked Questions (FAQ) document.
 */
export interface Question extends Thing {
  /**
   * The text content of the question.
   */
  name: string
  /**
   * An answer object, with a text property which contains the answer to the question.
   */
  acceptedAnswer: Answer|string
  /**
   * The language code for the question; e.g., en-GB.
   */
  inLanguage?: string
}

/**
 * An answer offered to a question; perhaps correct, perhaps opinionated or wrong.
 */
export interface Answer extends Optional<Thing, '@id'> {
  text: string
}
```
