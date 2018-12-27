<template>
<section class="section">
<div class="container">
	<div v-if="isOwner">
		<p>このページの所有者です</p>
	</div>

	<div class="columns">

	<div class=" column is-one-quarter">
		<profile-box :accountId="$route.params.accountId"/>
	</div>
	<div class="column">
		<h1 class="title">フォロー中</h1>
			<div class="columns is-multiline">
				<div v-for="following in followings" :key="following.ID" class="column is-one-third">
					<user-box v-if="following.FollowingType === 'user'" :userId="following.FollowingId"></user-box>
					<community-box v-else :communityId="following.FollowingId"></community-box>
				</div>
			</div>
		</div>
	</div>

</div>
</section>
</template>
<script>
import UserBox from '~/components/user/UserBox'
import CommunityBox from '~/components/user/CommunityBox'
import ProfileBox from '~/components/user/ProfileBox'

export default {
	components: {
		UserBox,
		CommunityBox,
		ProfileBox
	},
	data() {
		return {
			user: null,
			followings: [],
		}
	},
	async created() {
		this.user = (await this.$axios.$get(`/users?accountid=${this.$route.params.accountId}`)).data

		this.$axios.$get(`/users/${this.user.ID}/followings`).then(res => {
			this.followings = res.data
		})
	},
	computed: {
		isOwner: function () {
			return this.$store.getters['user/isMyAccountId'](this.$route.params.accountId)
		}
	}
}
</script>