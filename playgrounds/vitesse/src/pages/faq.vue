<template>
  <SchemaOrgWebPage name="FAQ" type="FAQPage" />
  <div>
    FAQ
    <SchemaOrgQuestion class="text-left" render-scoped-slots>
      <template #name>
      <h2>What is quantum mechanics?</h2>
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
    <SchemaOrgQuestion>
      <template #name>
        <div class="font-bold mb-3 text-xl">
          What about another question?
        </div>
      </template>
      <template #acceptedAnswer>
        <p>Heck ye</p>
      </template>
    </SchemaOrgQuestion>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
  title: FAQ
</route>
