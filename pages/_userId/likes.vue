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
import ProfileBox from '~/components/user/ProfileBox'
import PageBox from '~/components/user/PageBox'

export default {
	components: {
		ProfileBox,
		PageBox
	},
	data() {
		return {
			likes: [],
		}
	},
	created() {
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