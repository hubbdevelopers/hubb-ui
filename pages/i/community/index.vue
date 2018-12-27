<template>
  <section class="section">
    <div class="container">
      <h1 class="title">
        Communities
      </h1>
      <div v-for="community in communities" v-bind:key="community.ID" class="columns">
        <nuxt-link :to="community.ID.toString()" append>{{community.Name}}</nuxt-link>
      </div>
    </div>
  </section>
</template>
<script>
import { db } from '~/plugins/firebase'
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
