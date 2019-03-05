<template>
<div>
  <div class="card">
    <div class="card-image">
      <nuxt-link :to="'/' + user.ID">
      <figure class="image is-4by3">
        <img v-if="user.Image" v-bind:src="user.Image" alt="ユーザー画像">
        <img v-else src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image">
      </figure>
      </nuxt-link>
    </div>
    <div class="card-content">
      <p class="title">{{user.Name}}</p>
      <p class="subtitle">@{{user.AccountId}}</p>
      <div class="content">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Phasellus nec iaculis mauris.
      </div>
      <div v-if="!isMyself">
        <button v-if="isFollowingUser" class="button is-primary" @click="unFollow">フォロー中</button>
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
    user: {
      type:Object,
      default: {}
    },
    userId: {
      type:String,
      default: "0"
    },
  },
  async created() {
    if(!Object.keys(this.user).length) {
      this.user = (await this.$axios.$get(`/users/${this.userId}`)).data
    }
  },
	methods: {
		follow() {
			this.$store.dispatch('user/followUser', this.user.ID).catch(err => {
				console.log(err)
				window.alert("error")
			})
		},
		unFollow() {
			this.$store.dispatch('user/unFollowUser', this.user.ID).catch(err => {
				console.log(err)
				window.alert("error")
			})
		}
	},
	computed: {
		isFollowingUser: function () {
			return this.$store.getters['user/isFollowingUser'](this.user.ID)
    },
    isMyself: function() {
      return this.$store.getters['user/isMyAccountId'](this.user.AccountId)
    }
	}
}
</script>