<template>
  <section class="section" v-if="owner">
    <div class="container">
		<div v-if="canEdit">
			<p>編集可能です。</p>
			<div><nuxt-link to="edit" append>編集ページへ</nuxt-link></div>
			<button class="button is-primary" @click="deletePage" v-bind:disabled="isDeleting">削除</button>
		</div>

		<page-main :page="page" :owner="owner" :is-user="true"/>

		<page-comment :is-login="isLogin" :comments="comments" />
	</div>
  </section>
</template>
<script>
import PageMain from '~/components/organisms/PageMain'
import PageComment from '~/components/organisms/PageComment'

export default {
	components: {
		PageMain,
		PageComment
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
			addComment: '',
			owner: null
		}
	},
	async created() {
		try {
			
			// this.likes = (await this.$axios.$get(`likes?pageid=${this.$route.params.pageId}`)).data
			if (this.page.OwnerType === 'users') {
				this.owner = (await this.$axios.$get(`users/${this.page.OwnerId}`)).data
				console.log(this.owner)
			} else if (this.page.OwnerType === 'communities') {
				// TODO
			}
			
			this.comments = (await this.$axios.$get(`comments?pageid=${this.$route.params.pageId}`)).data
		} catch(e) {
			console.log(e)
		}
	},

	methods: {
		deletePage() {
			this.$emit('deletePage')
		},
		async createComment() {

			try {
				const param = {
					pageId: this.$route.params.pageId,
					text: this.addComment
				}
				const comment = await this.$store.dispatch('user/createComment', param)
				this.comments.unshift(comment.data)
				this.addComment = ''
			} catch(e) {
				console.log(err)
				window.alert("コメントに失敗しました")
			}

		},
		async deleteComment(commentId) {

			try {
				const param = {
					pageId: this.$route.params.pageId,
					commentId: commentId
				}
				const comment  = await this.$store.dispatch('user/deleteComment', param)
				this.comments.some((val, i) => {
					if (val.id==comment.ID) this.comments.splice(i,1); 
				});

			} catch(e) {
				console.log(err)
				window.alert("コメント削除に失敗しました")
			}
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
