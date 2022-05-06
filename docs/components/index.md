# Components

## How Schema Components Work

Each Schema has an associated headless component that can be used to configure your sites
Schema in your vue files `<template>`.

Each component implements the same logic and there are multiple ways to define your components.

### Headless - Attributes

Any attribute passed on the component will be forwarded to the
Schema.

For fields which are prefixed with `@`, such as `@type` and `@id`, you can simply omit the `@`.

For example, to set a page name and type:

```vue
<template>
<!-- About us page inline -->
<SchemaOrgWebPage type="AboutPage" name="About Us" />
</template>
```

### Headless - Slots

Alternatively to providing attributes on the prop, you are also able to provide the data through slots which
use the same name as the attribute.

For example, we can generate a FAQ Question with the following:

```vue
<template>
<SchemaOrgQuestion>
  <template #name>
    What is the capital of Australia?
  </template>
  <template #acceptedAnswer>
    Canberra
  </template>
</SchemaOrgQuestion>
</template>
```


### Rendered Default slot

If you want to render the markup and want full customisation, you can provide a default slot. The slot props
will be the resolved node.

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


### Rendered Scoped Slots

Providing the `render-scoped-slots` will allow the slots to be rendered. This can bew useful in avoiding setting up
markup multiple times through the default slot.

```vue
<template>
<SchemaOrgQuestion v-slot="{ acceptedAnswer, name}" render-scoped-slots>
  <!-- Scoped slots will render -->
  <template #name>
    <h3>What is quantum mechanics?</h3>
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

## Available Components

## Schema Components

- [SchemaOrgBreadcrumb](/components/breadcrumb)
- [SchemaOrgQuestion](/components/question)

## Utility Components

- [SchemaOrgInspector](/components/inspector)
