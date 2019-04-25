<template>
  <div class="field">
    <div class="columns is-mobile">
      <div class="column is-2">
        <image-icon-link
          :ownerId="$store.state.user.id"
          :image="$store.state.user.data.image"
          :isUser="true"
          :isCommunity="false"
        />
      </div>
      <div class="column">
        <comment-text-area v-model="commentText" />
      </div>
    </div>

    <button
      v-bind:disabled="!commentText"
      @click="createComment"
      class="button is-primary"
    >
      コメント
    </button>
  </div>
</template>
<script lang="ts">
import CommentTextArea from '~/components/atoms/CommentTextArea.vue'
import ImageIconLink from '~/components/atoms/ImageIconLink.vue'
import { Vue, Component } from 'vue-property-decorator'

@Component({
  components: {
    CommentTextArea,
    ImageIconLink
  }
})
export default class extends Vue {
  commentText: string = ''
  createComment() {
    const param = {
      pageId: this.$route.params.pageId,
      text: this.commentText
    }
    this.$emit('create-comment', param)
    this.commentText = ''
  }
}
</script>
