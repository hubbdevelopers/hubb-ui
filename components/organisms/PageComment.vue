<template>
  <div>
    <page-comment-create-area v-if="isLogin" @create-comment="createComment" />
    <hr />
    <div v-for="comment in comments" :key="comment.id">
      <page-comment-display
        :comment="comment"
        @deleteComment="deleteComment"
        class="page-comment-display"
      />
      <hr />
    </div>
  </div>
</template>
<script lang="ts">
import PageCommentDisplay from '~/components/molecules/PageCommentDisplay.vue'
import PageCommentCreateArea from '~/components/molecules/PageCommentCreateArea.vue'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Comment, getCommentsByPageId } from '~/common/comment'

@Component({
  components: {
    PageCommentDisplay,
    PageCommentCreateArea
  }
})
export default class extends Vue {
  @Prop({ default: false }) readonly isLogin!: boolean

  comments: Comment[] = []
  async created() {
    try {
      this.comments = await getCommentsByPageId(this.$route.params.pageId)
      // this.likes = (await this.$axios.$get(`likes?pageid=${this.$route.params.pageId}`)).data
    } catch (e) {
      console.log(e)
    }
  }
  async createComment({ pageId, text }) {
    try {
      await this.$store.dispatch('user/createComment', {
        pageId: pageId,
        text: text
      })
      this.comments = await getCommentsByPageId(this.$route.params.pageId)
    } catch (err) {
      console.log(err)
      window.alert('コメントに失敗しました')
    }
  }
  async deleteComment(commentId) {
    try {
      const param = {
        pageId: this.$route.params.pageId,
        commentId: commentId
      }
      await this.$store.dispatch('user/deleteComment', param)
      this.comments = await getCommentsByPageId(this.$route.params.pageId)
    } catch (err) {
      console.log(err)
      window.alert('コメント削除に失敗しました')
    }
  }
}
</script>
<style lang="scss" scoped>
.page-comment-display {
  margin-bottom: 10px;
}
</style>
