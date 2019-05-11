<template>
  <div class="vld-parent">
    <loading :active.sync="isLoading" :is-full-page="fullPage" />
  </div>
</template>

<script>
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'

export default {
  components: {
    Loading
  },
  props: { isLoading: { type: Boolean, required: true } },
  data() {
    return {
      fullPage: true
    }
  }
}
</script>
