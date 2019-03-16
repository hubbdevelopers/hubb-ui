<template>
<section class="section">
<div class="container">
	<div v-if="isOwner">
		<new-page-modal :showModal="showNewPageModal" @closeModal="closeModal"></new-page-modal>
		<new-community-modal :showModal="showNewCommunityModal" @closeModal="closeModal"></new-community-modal>
	</div>

	<div class="columns">

	<div class="column is-one-third">
		<user-profile v-if="user" :user="user" />
	</div>

	<div class="column">
		<mypage-tab-area  :user="user" :pages="pages" :communities="communities"/>

		<div class="config" v-if="isOwner">
			<button class="button is-primary" @click="showNewPageModal = true">ページ追加</button>
			<button class="button is-primary" @click="showNewCommunityModal = true">コミュニティ追加</button>
			<button class="button is-primary" @click="goConfigPage">設定</button>
			<button class="button is-danger" @click="withdraw">退会</button>
		</div>
	</div>
	</div>
</div>
</section>
</template>
<script>
import NewPageModal from '~/components/modal/NewPageModal'
import NewCommunityModal from '~/components/modal/NewCommunityModal'
import UserProfile from '~/components/organisms/UserProfile'
import MypageTabArea from '~/components/organisms/MypageTabArea'

export default {
  props: {
    user: {
      type: Object,
      required: true
    },
    pages: {
      type: Array,
      required: true
    },
    communities: {
      type: Array,
      required: true
    }
  },
	components: {
		NewPageModal,
		NewCommunityModal,
    UserProfile,
    MypageTabArea
	},
	data() {
		return {
			showNewPageModal: false,
			showNewCommunityModal: false,
		}
	},
	methods: {
		goConfigPage() {
			this.$router.push({ path: 'profile', append: true })
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
<style lang="scss" scoped>
.config {
  margin-top: 50px;
}
</style>
