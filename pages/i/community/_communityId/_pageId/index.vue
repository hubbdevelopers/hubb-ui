<template>
	<page :canEdit="isMember" :page="page" :isDeleting="isDeleting" @deletePage="deletePage"/>
</template>
<script>
import { db } from '~/plugins/firebase'
import Page from '~/components/Page.vue'

export default {
	components: {
    Page
	},
	data() {
		return {
			page: '',
			isDeleting: false
		}
	},
	async created() {
		try {
			this.page = (await this.$axios.$get(`pages/${this.$route.params.pageId}`)).data
		} catch(e) {
			console.log(e)
		}
	},
	methods: {
		deletePage() {
			if(!window.confirm('ページを削除します。よろしいですか？')){
				return
			}
			this.isDeleting = true
			this.$store.dispatch('user/deletePage', this.$route.params.pageId).then(res => {
				this.$router.push('/i/community/' + this.$route.params.communityId )
			}).catch(err => {
				window.alert("削除に失敗しました")
			}).finally(() => {
				this.isDeleting = false
			})
		}
	},
	computed: {
		isMember: function () {
			return this.$store.getters['user/isCommunityMember'](this.$route.params.communityId)
		}
	}
}
</script>
