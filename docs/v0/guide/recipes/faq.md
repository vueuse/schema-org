# Setting up Schema.org for a FAQ in Vue

<SchemaOrgArticle image="/og.png" />

<BreadcrumbList :value="[ { item: '/', name: 'Home' }, { item: '/guide/recipes/', name: 'Recipes' }, { name: 'FAQ' }]" />

Creating a FAQ page on your site is a great way to help your users understand your website. 

Providing Schema.org for these Questions and Answers can help improve your organic reach by allowing Google to optimise
your faq pages search appearance.

## Useful Links

- [defineQuestion](/api/schema/question.md)
- [FAQ Page | Google Search Central](https://developers.google.com/search/docs/advanced/structured-data/faqpage)
- [Question Schema | Yoast](https://developer.yoast.com/features/schema/pieces/question)

## Marking up FAQs

The [defineQuestion](/api/schema/question) function and [SchemaOrgQuestion](/components/) component are provided
to create Question Schema whilst handling relations for you.

Note: When using a page with the path `/faq`, the page type will be automatically set for you. 

Tips:
- The answer may contain HTML content such as links and lists.

### a. Composition API

```vue
<script setup lang="ts">
useSchemaOrg([
  defineWebPage({
    '@type': 'FAQPage',
  }),
  defineQuestion({
    name: 'How long is a piece of string?',
    acceptedAnswer: 'The length of a piece of string is the number of characters in the string.',
  }),
  defineQuestion({
    name: 'How big is a giraffe?',
    acceptedAnswer: 'A giraffe is 12 feet tall',
  }),
])
</script>
```

### b. Component API

There are many ways to use the SchemaOrg components. You should choose which option works best for you, note that you
should be rendering markup in your page similar to the Schema.

The simplest way is to render the components headless using attributes.

#### Headless with attributes

```vue
<template>
  <SchemaOrgWebpage type="FAQPage" />
  <SchemaOrgQuestion 
    name="How long is a piece of string?"
    accepted-answer="The length of a piece of string is the number of characters in the string."
  />
  <SchemaOrgQuestion 
    name="How big is a giraffe?"
    accepted-answer="A giraffe is 12 feet tall"
  />
</template>
```

#### Headless with slots

Using slots can be useful for large answers. Note that this will not render anything

```vue
<template>
<SchemaOrgQuestion>
  <!-- Scoped slots won't render anything -->
  <template #name>
  What is quantum mechanics?
  </template>
  <template #acceptedAnswer>
  <p>Quantum mechanics is the study of the nature of matter.</p>
  <p>It is the study of the nature of the interaction between particles and the nature of the universe.</p>
  <p>Particles are the smallest particles in the universe.</p>
  <p>The universe is made up of particles.</p>
  <p>Particles are made up of matter.</p>
  <p>Matter is made up of energy.</p>
  <p>Energy is made up of heat.</p>
  <p>Heat is made up of light.</p>
  <p>Light is made up of sound.</p>
  <p>Sound is made up of colour.</p>
  <p>Colour is made up of light.</p>
  <p>Light is made up of light.</p>
  </template>
</SchemaOrgQuestion>
</template>
```

### Rendered Scoped Slots 

Providing the `render-scoped-slots` will allow the slots to be rendered. 

```vue
<template>
  <SchemaOrgWebpage type="FAQPage" />
  <div>
    <h1>FAQ</h1>
    <ul>
      <SchemaOrgQuestion as="li" render-scoped-slots>
        <!-- Scoped slots will render -->
        <template #name>
        <h2 class="font-bold mb-3">
          What is the question?
        </h2>
        </template>
        <template #acceptedAnswer>
        <p>
          {{ acceptedAnswer.text }}
        </p>
        </template>
      </SchemaOrgQuestion>
    </ul>
  </div>
</template>
```

### Default Slot

If you need more customisation, you can omit the `render-scoped-slots` attribute to provide your own full markup.

```vue
<template>
<SchemaOrgQuestion>
  <!-- Scoped slots won't render anything -->
  <template #name>
  What is quantum mechanics?
  </template>
  <template #acceptedAnswer>
  <p>Quantum mechanics is the study of the nature of matter.</p>
  <p>It is the study of the nature of the interaction between particles and the nature of the universe.</p>
  <p>Particles are the smallest particles in the universe.</p>
  <p>The universe is made up of particles.</p>
  <p>Particles are made up of matter.</p>
  <p>Matter is made up of energy.</p>
  <p>Energy is made up of heat.</p>
  <p>Heat is made up of light.</p>
  <p>Light is made up of sound.</p>
  <p>Sound is made up of colour.</p>
  <p>Colour is made up of light.</p>
  <p>Light is made up of light.</p>
  </template>
  <!-- Default slot will render -->
  <template #default="{ acceptedAnswer, name }">
  <h2>
    # {{ name }}
  </h2>
  <p v-html="acceptedAnswer.text" />
  <div>Wow!</div>
  </template>
</SchemaOrgQuestion>
</template>
```
