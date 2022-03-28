<script setup lang="ts">
</script>
<template>
<form @submit.prevent="submit">
  <input v-model="email" type="email" name="email" placeholder="Email" />
  <textarea v-model="message" placeholder="Message" name="message"></textarea>
  <button type="submit">Send</button>
</form>
</template>
