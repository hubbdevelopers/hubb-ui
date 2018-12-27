<template>
<div>
  <div class="card" style="background-color: #ffffee">
    <div class="card-image">
      <nuxt-link :to="'/i/community/' + community.ID">
      <figure class="image is-4by3">
        <img v-if="community.Image" v-bind:src="community.Image" alt="ユーザー画像">
        <img v-else src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image">
      </figure>
      </nuxt-link>
    </div>
    <div class="card-content">
      <p class="title">{{community.Name}}</p>
      <div class="content">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Phasellus nec iaculis mauris.
      </div>
      <div>
        <button v-if="isFollowingCommunity" class="button is-primary" @click="unFollow">フォロー中</button>
        <button v-else class="button is-primary is-outlined" @click="follow">フォローする</button>
      </div>
    </div>
  </div>
  <!--nuxt-link :to="'/' + user.data.account_id">{{user}} {{isFollowingUser}} </nuxt-link-->

</div>
</template>
<script>
import { db } from '~/plugins/firebase'

export default {
  props: {
    community: {
      type:Object,
      default: {}
    },
    communityId: {
      type:String,
      default: "0"
    },
  },
  async created() {
    if(!Object.keys(this.community).length) {
      this.community = (await this.$axios.$get(`/communities/${this.communityId}`)).data
    }
  },
	methods: {
		follow() {
			this.$store.dispatch('user/followCommunity', this.community.ID).catch(err => {
				console.log(err)
				window.alert("error")
			})
		},
		unFollow() {
			this.$store.dispatch('user/unFollowCommunity', this.community.ID).catch(err => {
				console.log(err)
				window.alert("error")
			})
		}
	},
	computed: {
		isFollowingCommunity: function () {
			return this.$store.getters['user/isFollowingCommunity'](this.community.ID)
		}
	}
}
</script>