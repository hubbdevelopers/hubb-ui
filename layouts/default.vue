<template>
  <div>
    <myheader/>
    <nuxt/>
  </div>
</template>

<script>
import Header from '~/components/Header.vue'

export default {
  components: {
    myheader: Header,
  },
}
</script>


