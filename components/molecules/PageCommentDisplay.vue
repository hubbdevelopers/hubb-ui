<template>
  <article v-if="comment" class="media">
    <image-icon-link
      :userId="user.id"
      :image="user.data.image"
      :isUser="true"
      :isCommunity="false"
      class="media-left"
    />

    <div class="media-content">
      <div class="content">
        <div>
          <strong>{{ user.data.name }}</strong>
          <br />
          {{ comment.data.text }}
          <br />
          <text-how-many-time-ago :date="comment.data.createdAt" />
        </div>
      </div>
    </div>
    <div v-if="isMyComment" class="media-right">
      <button @click="$emit('deleteComment', comment.id)" class="delete" />
    </div>
  </article>
</template>
<script lang="ts">
import ImageIconLink from '~/components/atoms/ImageIconLink.vue'
import TextHowManyTimeAgo from '~/components/atoms/TextHowManyTimeAgo.vue'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Comment } from '~/common/comment'
import { User, blankUser, getUser } from '~/common/user'

@Component({
  components: {
    ImageIconLink,
    TextHowManyTimeAgo
  }
})
export default class extends Vue {
  @Prop({ required: true }) readonly comment!: Comment

  user: User = blankUser

  async created() {
    this.user = await getUser(this.comment.data.userId)
  }

  get isMyComment() {
    return this.$store.getters['user/isMyId'](this.user.id)
  }
}
</script>
