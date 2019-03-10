<template>
<section class="section">
<div class="container">
	<div v-if="isOwner">
		<p>このページの所有者です</p>
	</div>

	<div class="columns">

	<div class="column is-one-third">
		<user-profile v-if="user" :user="user" />
	</div>
	<div class="column">
		<h1 class="title">フォロワー</h1>
			<div class="columns is-multiline">
				<!--div v-for="member in members" :key="member.id" class="column is-one-quarter"-->
				<div v-for="follower in followers" :key="follower.ID" class="column is-one-third">
					<user-box :userId="follower.UserId"></user-box>
				</div>
			</div>
	</div>

	</div>
</div>
</section>
</template>
<script>
import UserBox from '~/components/user/UserBox'
import UserProfile from '~/components/organisms/UserProfile'

export default {
	components: {
		UserProfile,
		UserBox
	},
	data() {
		return {
			user: null,
			followers: [],
		}
	},
	async created() {
		this.user = (await this.$axios.$get(`/users/${this.$route.params.userId}`)).data

		this.$axios.$get(`/users/${this.user.ID}/followers`).then(res => {
			this.followers = res.data
		})
	},
	computed: {
		isOwner: function () {
			return this.$store.getters['user/isMyId'](this.$route.params.userId)
		}
	}
}
</script>