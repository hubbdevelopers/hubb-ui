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
		<h1 class="title">いいね</h1>
			<div class="columns is-multiline">
				<div v-for="like in likes" :key="like.ID" class="column is-one-third">
					<page-box :pageId="like.PageId"></page-box>
				</div>
			</div>
		</div>
	</div>

</div>
</section>
</template>
<script>
import PageBox from '~/components/molecules/PageBox'
import UserProfile from '~/components/organisms/UserProfile'

export default {
	components: {
		UserProfile,
		PageBox
	},
	data() {
		return {
			user: null,
			likes: [],
		}
	},
	async created() {
		this.user = (await this.$axios.$get(`/users/${this.$route.params.userId}`)).data
		// TODO
		// this.$axios.$get(`/likes?${this.$route.params.accountId}`).then(res => {
		// 	this.likes = res.data
		// })
	},
	computed: {
		isOwner: function () {
			return this.$store.getters['user/isMyId'](this.$route.params.userId)
		}
	}
}
</script>