<template>
<div class="box">
	<div class="columns is-mobile is-vcentered">
		<div class="column is-two-fifths"><profile-image :image="user.Image" /></div>
		<div v-if="isOwner" class="column"><n-link class="button is-primary is-outlined is-rounded" :to="`/${user.ID}/profile`">プロフィール編集</n-link></div>
	</div>

	<div v-if="user">
		<div>
			<div>
				<profile-name>{{user.Name}}</profile-name>
				<profile-account-id>{{user.AccountId}}</profile-account-id>
			</div>

			<profile-s-n-s :homepage-url="user.Homepage" :twitter-id="user.Twitter" :instagram-id="user.Instagram" :facebook-id="user.Facebook"/>
			<profile-description>aaaaaaaa:aaaaaa</profile-description>

			<profile-birthday :birthday="user.Birthday"></profile-birthday>

			<profile-followings-followers-likes
				:user-id="user.ID"
				:following-count="followingCount"
				:follower-count="followerCount"
				:like-count="likeCount" />
		</div>

		<profile-follow-button v-if="!isOwner" :is-following-user="isFollowingUser" />
	</div>
</div>
</template>
<script>
import ProfileName from '~/components/atoms/ProfileName'
import ProfileAccountId from '~/components/atoms/ProfileAccountId'
import ProfileDescription from '~/components/atoms/ProfileDescription'
import ProfileBirthday from '~/components/atoms/ProfileBirthday'
import ProfileFollowingsFollowersLikes from '~/components/atoms/ProfileFollowingsFollowersLikes'
import ProfileImage from '~/components/atoms/ProfileImage'
import ProfileSNS from '~/components/molecules/ProfileSNS'
import ProfileFollowButton from '~/components/atoms/ProfileFollowButton'

export default {
	components: {
		ProfileName,
		ProfileAccountId,
		ProfileDescription,
		ProfileBirthday,
		ProfileFollowingsFollowersLikes,
		ProfileImage,
		ProfileSNS,
		ProfileFollowButton
	},
	props: {
		user: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			followingCount: 0,
			followerCount: 0,
			likeCount: 0,
		}
	},
	async created() {
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
			this.$store.dispatch('user/followUser', this.user.ID).catch(err => {
				console.log(err)
				window.alert("error")
			})
		},
		unfollow() {
			this.$store.dispatch('user/unfollowUser', this.user.ID).catch(err => {
				console.log(err)
				window.alert("error")
			})
		}
	},
	computed: {
		isOwner: function () {
			return this.$store.getters['user/isMyId'](this.user.ID)
		},
		isFollowingUser: function () {
			return this.$store.getters['user/isFollowingUser'](this.user.ID)
		}
	}
}
</script>