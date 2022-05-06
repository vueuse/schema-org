<script>
export default {
  props: {
    value: {
      type: Array,
      required: true,
    },
  },
}
</script>

<template>
  <SchemaOrgBreadcrumb
    v-slot="{ itemListElement }"
    as="ul"
    :item-list-element="value"
    class="pl-0 list-none flex ml-0 mt-5 text-sm border-gray-200 border-1 bg-gray-50 rounded-lg"
  >
    <template v-for="(item, key) in itemListElement" :key="key">
      <li class="m-0 pb-0 flex items-center">
        <template v-if="item.item">
          <a :href="item.item" class="px-4 py-2 block">{{ item.name }}</a>
          <span class="block">/</span>
        </template>
        <span v-else class="text-gray-600 font-light px-4 py-2 block">{{ item.name }}</span>
      </li>
    </template>
  </SchemaOrgBreadcrumb>
</template>
