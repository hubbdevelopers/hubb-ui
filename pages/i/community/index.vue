<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Communities</h1>
      <div
        v-for="community in communities"
        v-bind:key="community.ID"
        class="columns"
      >
        <nuxt-link :to="community.ID" append>{{
          community.data.name
        }}</nuxt-link>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  data() {
    return {
      communities: []
    }
  },
  created() {
    this.$axios.$get('communities').then(res => {
      this.communities = res.data
    })
  }
}
</script>
