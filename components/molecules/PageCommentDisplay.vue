<template>
<article class="media" v-if="comment">
  <image-icon-link class="media-left" :ownerId="user.ID" :image="user.Image" :isUser="true" :isCommunity="false"/>

  <div class="media-content">
    <div class="content">
      <p>
        <strong>{{user.Name}}</strong>
        <br>
        {{comment.Text}}
        <br>
        <text-how-many-time-ago :date="comment.CreatedAt"/>
      </p>
    </div>
  </div>
  <div class="media-right" v-if="isMyComment">
    <button class="delete" @click="$emit('deleteComment', comment.ID)"></button>
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
      required: true
		},
	},
	data() {
		return {
			user: {}
		}
	},
	created() {
    this.$axios.$get(`users/${this.comment.UserId}`).then(res => {
      this.user = res.data
    })
	},
	computed: {
		isMyComment: function() {
			return this.$store.getters['user/isMyAccountId'](this.user.AccountId)
		}
	}
}
</script>
