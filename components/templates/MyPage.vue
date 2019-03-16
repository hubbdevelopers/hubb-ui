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
	</div>
	</div>
</div>
</section>
</template>
<script>
import NewPageModal from '~/components/organisms/NewPageModal'
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
		closeModal() {
			this.showNewPageModal = false
			this.showNewCommunityModal = false
		},
	},
	computed: {
		isOwner: function () {
			return this.$store.getters['user/isMyId'](this.$route.params.userId)
		}
	}
}
</script>
