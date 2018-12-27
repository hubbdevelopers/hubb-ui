<template>
  <section class="section">
    <div class="container">
		<div v-if="canEdit">
			<p>編集可能です。</p>
			<div><nuxt-link to="edit" append>編集ページへ</nuxt-link></div>
			<button class="button is-primary" @click="deletePage" v-bind:disabled="isDeleting">削除</button>
		</div>
		<section class="section">
			<img v-if="page.Image" :src="page.Image" alt="ページメイン画像">
			<h1 class="title is-1">{{page.Name}}</h1>
			<div v-if="page.Content" class="test" v-html="page.Content"></div>

			<div>
				<div>
					<button v-if="isLiked && isLogin" class="button" @click="unlikePage">
							<span class="icon is-small">
									<i class="fas fa-heart has-text-danger"></i>
							</span>
					</button>
					<button v-else-if="isLogin" class="button" @click="likePage" >
							<span class="icon is-small">
									<i class="fas fa-heart has-text-grey-lighter"></i>
							</span>
					</button>
					<button v-else class="button" disabled>
							<span class="icon is-small">
									<i class="fas fa-heart has-text-grey-lighter"></i>
							</span>
					</button>
				</div>
			</div>
			<div class="field" v-if="isLogin">
				<label class="label">コメント</label>
				<div class="control">
					<input class="input" type="text" placeholder="Text input" v-model="addComment">
				</div>
				<button class="button is-primary" v-bind:disabled="!addComment" @click="createComment">コメント公開</button> 
			</div>
			<div v-for="comment in comments" :key="comment.id">
				<comment :comment="comment" @deleteComment="deleteComment" />
			</div>
		</section>
	</div>
  </section>
</template>
<script>
import { db, storage } from '~/plugins/firebase'
import Comment from '~/components/Comment.vue'

export default {
	components: {
    Comment
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
	async created() {
		try {
			this.comments = (await this.$axios.$get(`comments?pageid=${this.$route.params.pageId}`)).data
			this.likes = (await this.$axios.$get(`likes?pageid=${this.$route.params.pageId}`)).data
		} catch(e) {
			console.log(e)
		}

	},
	data() {
		return {
			comments: {},
			likes: {},
			addComment: ''
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
	methods: {
		deletePage() {
			this.$emit('deletePage')
		},
		likePage() {
			this.$store.dispatch('user/likePage', this.$route.params.pageId).catch(err => {
				window.alert("いいねに失敗しました")
			})
		},
		unlikePage() {
			this.$store.dispatch('user/unlikePage', this.$route.params.pageId).then(res => {
				//this.$router.push('/' + this.$store.state.user.accountId )
			}).catch(err => {
				window.alert("いいね取り消しに失敗しました")
			})
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
	}
}
</script>