<template>
<article class="media" v-if="comment">
  <figure class="media-left">
    <p class="image is-64x64">
			<img v-if="user.image" :src="user.image">
      <img v-else src="https://bulma.io/images/placeholders/128x128.png">
    </p>
  </figure>
  <div class="media-content">
    <div class="content">
      <p>
        <strong>{{user.Name}}</strong> <small>@{{user.AccountId}}</small> <small>{{dateago}}</small>
        <br>
        {{comment.Text}}
      </p>
    </div>
    <!--nav class="level is-mobile">
      <div class="level-left">
        <a class="level-item">
          <span class="icon is-small"><i class="fas fa-reply"></i></span>
        </a>
        <a class="level-item">
          <span class="icon is-small"><i class="fas fa-retweet"></i></span>
        </a>
        <a class="level-item">
          <span class="icon is-small"><i class="fas fa-heart"></i></span>
        </a>
      </div>
    </nav-->
  </div>
  <div class="media-right" v-if="isMyComment">
    <button class="delete" @click="$emit('deleteComment', comment.ID)"></button>
  </div>
</article>
</template>
<script>
import moment from 'moment'

export default {
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
		dateago: function() {
			return moment(this.comment.CreatedAt).fromNow()
		},
		isMyComment: function() {
			return this.$store.getters['user/isMyAccountId'](this.user.AccountId)
		}
	}
}
</script>
