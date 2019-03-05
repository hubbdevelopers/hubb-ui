<template>
  <section class="section" v-if="owner">
    <div class="container">
			<page-main :page="page" :owner="owner" :is-user="true" :can-edit="canEdit" @click-ellipsis="showConfigModal"/>

			<page-comment :is-login="isLogin" :comments="comments" />
		</div>
		<page-config-modal :is-active="isActiveConfigModal" @close="closeConfigModal" @delete-page="deletePage" v-if="canEdit"/>
  </section>
</template>
<script>
import PageMain from '~/components/organisms/PageMain'
import PageComment from '~/components/organisms/PageComment'
import PageConfigModal from '~/components/organisms/PageConfigModal'

export default {
	components: {
		PageMain,
		PageComment,
		PageConfigModal
	},
  props: {
    canEdit: {
      type: Boolean,
      default: false
		},
		isDeleting: {
			type: Boolean,
			required: true
		},
		page: {
			required: true
		}
	},
	data() {
		return {
			comments: {},
			likes: {},
			owner: null,
			isActiveConfigModal: false
		}
	},
	async created() {
		try {
			this.comments = (await this.$axios.$get(`comments?pageid=${this.$route.params.pageId}`)).data
			// this.likes = (await this.$axios.$get(`likes?pageid=${this.$route.params.pageId}`)).data
			if (this.page.OwnerType === 'users') {
				this.owner = (await this.$axios.$get(`users/${this.page.OwnerId}`)).data
			} else if (this.page.OwnerType === 'communities') {
				// TODO
			}
		} catch(e) {
			console.log(e)
		}
	},

	methods: {
		deletePage() {
			this.$emit('deletePage')
		},
		showConfigModal() {
      this.isActiveConfigModal = true
    },
    closeConfigModal() {
      this.isActiveConfigModal = false
    }
	},
	  computed: {
		isLiked: function () {
			return this.$store.getters['user/isLikedPage'](this.$route.params.pageId)
		},
		isLogin: function() {
			return this.$store.getters['user/isLogin']
		}
	},
}
</script>
