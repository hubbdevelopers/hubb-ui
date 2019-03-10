<template>
<div class="user-box">
  <div class="columns is-mobile">
    <div class="column is-one-quarter">
      <image-icon-link :ownerId="user.ID" :image="user.Image" :isUser="true" :isCommunity="false"/>
    </div>
    <div class="column is-one-quarter">
      <p class="is-size-6">{{user.Name}}</p>
      <p class="is-size-7 has-text-weight-light	">{{user.AccountId}}</p>
    </div>
    <div class="column" v-if="!isOwner">
      <button v-if="isFollowingUser" class="button is-primary" @click="unFollow">フォロー中</button>
      <button v-else class="button is-primary is-outlined" @click="follow">フォローする</button>
    </div>
  </div>
</div>
</template>
<script>
import ImageIconLink from '~/components/atoms/ImageIconLink'
export default {
  components: {
    ImageIconLink
  },
  props: {
    user: {
      type: Object,
      required: true
    },
  },
  async created() {
    if(!Object.keys(this.user).length) {
      this.user = (await this.$axios.$get(`/users/${this.user.ID}`)).data
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
    isOwner: function () {
			return this.$store.getters['user/isMyId'](this.user.ID)
		}
	}
}
</script>
<style lang="scss" scoped>
a { 
  text-decoration: none;
  color: gray
}

a:hover { 
  text-decoration: none;
  color: gray
}

.user-box {
  box-shadow: 1px 1px 2px gray;
  margin-top: 1px;
  padding: 5px 10px;
}

</style>