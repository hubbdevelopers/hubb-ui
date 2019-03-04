<template>
<div class="box">
	<!--figure class="image is-128x128" v-if="user && user.Image">
		<img class="is-rounded" :src="user.Image">
	</figure-->
	<figure class="image container is-128x128">
		<img class="is-rounded" :src="image">
	</figure>
	<div v-if="user">
		<div>
			<p class="title">{{user.Name}}</p>
			<p class="subtitle">@{{user.AccountId}}</p>
			<p>{{user.Description}}</p>
			<p><span class="icon has-text-dark" v-if="user.Birthday">
					<i class="fas fa-birthday-cake"></i>
				</span><span>{{birthday}}</span>
			</p>
			<p>フォロー:<nuxt-link :to="'/' + accountId + '/followings'">{{followingCount}}</nuxt-link></p>
			<p>フォロワー:<nuxt-link :to="'/' + accountId +'/followers'">{{followerCount}}</nuxt-link></p>
			<p>いいね:<nuxt-link :to="'/' + accountId +'/likes'">{{likeCount}}</nuxt-link></p>
		</div>
		<div>
			<span class="icon has-text-success" v-if="user.homepage">
				<a :href="user.homepage" target="_blank"><i class="fas fa-home"></i></a>
			</span>
			<span class="icon has-text-success" v-if="user.Twitter">
				<a :href="'https://twitter.com/' + user.Twitter" target="_blank"><i class="fab fa-twitter"></i></a>
			</span>
			<span class="icon has-text-success" v-if="user.Facebook">
				<a :href="'https://facebook.com/' + user.Facebook" target="_blank"><i class="fab fa-facebook"></i></a>
			</span>
			<span class="icon has-text-success" v-if="user.Instagram">
				<a :href="'https://instagram.com/' + user.Instagram" target="_blank"><i class="fab fa-instagram"></i></a>
			</span>
		</div>

		<div v-if="!isOwner">
			このページのゲストです
			<button v-if="isFollowingUser" class="button is-primary" @click="unFollow">フォロー中</button>
			<button v-else class="button is-primary is-outlined" @click="follow">フォローする</button>
		</div>
	</div>
</div>
</template>
<script>
import { db } from '~/plugins/firebase'
import moment from 'moment'

export default {
	props: {
		accountId: {
			required: true
		}
	},
	data() {
		return {
			followingCount: 0,
			followerCount: 0,
			likeCount: 0,
			user: {}
		}
	},
	async created() {
		this.user = (await this.$axios.$get(`/users?accountid=${this.accountId}`)).data

		this.$axios.$get(`/users/${this.user.ID}/followings`).then(res => {
			this.followingCount = res.data.length
		})

		this.$axios.$get(`/users/${this.user.ID}/followers`).then(res => {
			this.followerCount = res.data.length
		})

		this.$axios.$get(`/likes?userid=${this.user.ID}`).then(res => {
			this.likeCount = res.data.length
		})

	},
	methods: {
		follow() {
			this.$store.dispatch('user/followUser', this.accountId).catch(err => {
				console.log(err)
				window.alert("error")
			})
		},
		unFollow() {
			this.$store.dispatch('user/unFollowUser', this.accountId).catch(err => {
				console.log(err)
				window.alert("error")
			})
		}
	},
	computed: {
		isOwner: function () {
			return this.$store.getters['user/isMyAccountId'](this.accountId)
		},
		isFollowingUser: function () {
			return this.$store.getters['user/isFollowingUser'](this.accountId)
		},
		image: function () {
			return this.$store.getters['user/getImage']
		},
		birthday: function () {
			return this.user.Birthday ? moment(this.user.Birthday).format('YYYY/MM/DD') : ''
		}
	}
}
</script>