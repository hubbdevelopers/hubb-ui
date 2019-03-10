<template>
	<mypage v-if="!loading" :user="user" :pages="pages" :communities="communities" />
</template>
<script>
import NewPageModal from '~/components/modal/NewPageModal'
import NewCommunityModal from '~/components/modal/NewCommunityModal'
import UserProfile from '~/components/organisms/UserProfile'
import Mypage from '~/components/templates/MyPage'

export default {
	components: {
		NewPageModal,
		NewCommunityModal,
		UserProfile,
		Mypage
	},
	data() {
		return {
			user: null,
			pages: [],
			communities: [],
			showNewPageModal: false,
			showNewCommunityModal: false,
			loading: true
		}
	},
	async created() {

		this.user = (await this.$axios.$get(`users/${this.$route.params.userId}`)).data
		this.pages = (await this.$axios.$get(`pages?userid=${this.user.ID}`)).data
		this.communities = (await this.$axios.$get(`communities?userid=${this.user.ID}`)).data

		this.loading = false

	},
	methods: {
		goConfigPage() {
			this.$router.push({ path: 'config', append: true })
		},
		closeModal() {
			this.showNewPageModal = false
			this.showNewCommunityModal = false
		},
		withdraw() {
			this.$router.push({ path: 'withdraw', append: true })
			// this.$store.dispatch('user/withdraw').catch(err => {
			// 	console.log(err)
			// 	window.alert("error")
			// }) 
		}
	},
	computed: {
		isOwner: function () {
			return this.$store.getters['user/isMyId'](this.$route.params.userId)
		}
	}
}
</script>