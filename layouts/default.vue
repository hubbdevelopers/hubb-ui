<template>
  <div>
    <app-header />
    <nuxt />
  </div>
</template>

<script>
import AppHeader from '~/components/organisms/AppHeader.vue'

export default {
  components: {
    AppHeader
  }
}
</script>
