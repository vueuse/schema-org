# Setting up Schema.org for a FAQ in Vue

Creating a FAQ page on your site is a great way to help your users understand your website. 

Providing Schema.org for these Questions and Answers can help improve your organic reach by allowing Google to optimise
your faq pages search appearance.

By using the `vueuse-search-org` package, you have access to the `defineQuestion` function which will inject [Question Schema.org](/schema/question) whilst handling 
relations for you.

## Useful Links

- [defineQuestion](/schema/question.md)
- [FAQ Page | Google Search Central](https://developers.google.com/search/docs/advanced/structured-data/faqpage)
- [Question Schema | Yoast](https://developer.yoast.com/features/schema/pieces/question)

## Define Questions

Providing the Schema.org for an FAQ Page is straight-forward with minimal required fields.

Note: When using a page with the path `/faq`, the page type will be automatically set for you. 

### Composition API

```vue
<script setup lang="ts">
useSchemaOrg([
  defineWebPage({
    '@type': 'FAQPage',
  }),
  // defining questions here can be done here or using the component 
  defineQuestion({
    name: 'How long is a piece of string?',
    acceptedAnswer: 'Long',
  }),
  defineQuestion({
    name: 'Why do we ask questions?',
    acceptedAnswer: 'To get an accepted answer',
  }),
])
</script>
```

### Components

If you prefer to define your Question Schema.org in your template, you can make use of the `SchemaOrgQuestion` component.

Any text content within each slot will be appended to the Schema.org.

```vue
<script setup lang="ts">
useSchemaOrg([
  // automatically set when path matches /faq
  defineWebPage({
    '@type': 'FAQPage',
  }),
])
</script>
<template>
  <div>
    <h1>FAQ</h1>
    <ul>
      <SchemaOrgQuestion as="li">
        <template #question>
        <div class="font-bold mb-3 text-xl">What is the question?</div>
        </template>
        <template #answer>
        Not sure
        </template>
      </SchemaOrgQuestion>
    </ul>
  </div>
</template>
```
