<template>
  <article v-if="comment" class="media">
    <image-icon-link
      :ownerId="user.ID"
      :image="user.Image"
      :isUser="true"
      :isCommunity="false"
      class="media-left"
    />

    <div class="media-content">
      <div class="content">
        <p>
          <strong>{{ user.Name }}</strong>
          <br />
          {{ comment.Text }}
          <br />
          <text-how-many-time-ago :date="comment.CreatedAt" />
        </p>
      </div>
    </div>
    <div v-if="isMyComment" class="media-right">
      <button @click="$emit('deleteComment', comment.ID)" class="delete" />
    </div>
  </article>
</template>
<script>
import ImageIconLink from '~/components/atoms/ImageIconLink.vue'
import TextHowManyTimeAgo from '~/components/atoms/TextHowManyTimeAgo.vue'

export default {
  components: {
    ImageIconLink,
    TextHowManyTimeAgo
  },
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      user: {}
    }
  },
  computed: {
    isMyComment: function() {
      return this.$store.getters['user/isMyAccountId'](this.user.AccountId)
    }
  },
  created() {
    this.$axios.$get(`users/${this.comment.UserId}`).then(res => {
      this.user = res.data
    })
  }
}
</script>
