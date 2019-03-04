<template>
  <div class="field">
    <div class="columns is-mobile">
      <div class="column is-2">
        <image-icon-link :ownerId="$store.state.user.id" :image="$store.state.user.user.Image" :isUser="true" :isCommunity="false"/>
      </div>
      <div class="column">
        <comment-text-area v-model="commentText"/>
      </div>
    </div>
    
    <button class="button is-primary" v-bind:disabled="!commentText" @click="createComment">コメント</button> 
  </div>
</template>
<script>
import CommentTextArea from '~/components/atoms/CommentTextArea'
import ImageIconLink from '~/components/atoms/ImageIconLink.vue'
export default {
  components: {
    CommentTextArea,
    ImageIconLink
  },
  data() {
		return {
			commentText: ''
		}
  },
  methods: {
		createComment() {
      const param = {
        pageId: this.$route.params.pageId,
        text: this.commentText
      }
      this.$emit('create-comment', param)
      this.commentText = ''
		}
	}
}
</script>

