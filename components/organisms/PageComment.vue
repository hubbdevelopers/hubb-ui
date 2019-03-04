<template>
  <div>
		<page-comment-create-area v-if="isLogin" @create-comment="createComment"/>
		<hr>
		<div v-for="comment in comments" :key="comment.id">
			<page-comment-display class="page-comment-display" :comment="comment" @deleteComment="deleteComment" />
			<hr>
		</div>
  </div>
</template>
<script>
import PageCommentDisplay from '~/components/molecules/PageCommentDisplay'
import PageCommentCreateArea from '~/components/molecules/PageCommentCreateArea'

export default {
  components: {
		PageCommentDisplay,
		PageCommentCreateArea
  },
  props: {
    isLogin: {
      type: Boolean,
      default: false
    },
    comments: {
			require: true
    }
  },
  methods: {
		async createComment(param) {

			try {
				const comment = await this.$store.dispatch('user/createComment', param)
				this.comments.unshift(comment.data)
				this.commentText = ''
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
				const comment = (await this.$store.dispatch('user/deleteComment', param)).data
				this.comments.some((val, i) => {
					if (val.ID===comment.ID) this.comments.splice(i, 1); 
				})

			} catch(err) {
				console.log(err)
				window.alert("コメント削除に失敗しました")
			}
		}
	},
}
</script>
<style lang="scss" scoped>
.page-comment-display {
	margin-bottom: 10px
}
</style>

