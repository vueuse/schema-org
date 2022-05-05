<template>
  <SchemaOrgWebPage name="FAQ" type="FAQPage" />
  <div>
    FAQ
    <SchemaOrgQuestion class="text-left">
      <template #name>
        What is quantum mechanics?
      </template>
      <template #acceptedAnswer>
        Quantum mechanics is the study of the nature of matter.
        It is the study of the nature of the interaction between particles and the nature of the universe.
        Particles are the smallest particles in the universe.
        The universe is made up of particles.
        Particles are made up of matter.
        Matter is made up of energy.
        Energy is made up of heat.
        Heat is made up of light.
        Light is made up of sound.
        Sound is made up of colour.
        Colour is made up of light.
        Light is made up of light.
      </template>
      <template #default="{ acceptedAnswer, name }">
        <h2 class="font-bold mb-3">
          {{ name }}
        </h2>
        <p>
          {{ acceptedAnswer.text }}
        </p>
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
