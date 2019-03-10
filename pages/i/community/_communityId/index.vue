<template>
<section class="section">
<div class="container">
	<div>
		<div v-if="isMember">このコミュニティのメンバーです</div>
		<div v-if="isOwner">このコミュニティの所有者です</div>
	  <div>{{community}}</div>

		<button v-if="isFollowingCommunity" class="button is-primary" @click="unFollow">フォロー中</button>
		<button v-else class="button is-primary is-outlined" @click="follow">フォローする</button>
	</div>

	<h2 class="is-size-3">ページ一覧</h2>
	<div class="columns is-multiline">
		<div v-for="page in pages" :key="page.id" class="column is-one-quarter">
			<div class="card">
				<div class="card-image">
					<nuxt-link :to="page.ID.toString()" append>
					<figure class="image is-4by3">
						<img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image">
					</figure>
					</nuxt-link>
				</div>
				<div class="card-content">

					<div class="content">
						<p class="title">
							{{page.Name}}
						</p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      			Phasellus nec iaculis mauris.
					</div>
				</div>
			</div>
		</div>
	</div>

	<h1 class="title">メンバー一覧</h1>
	<div class="columns is-multiline">
		<div v-for="member in members" :key="member.id" class="column is-one-quarter">
			<list-user-box :user="member"></list-user-box>
		</div>
	</div>

	<h1 class="title" v-if="isOwner">招待中一覧</h1>
	<div class="columns is-multiline">
		<div v-for="invitation in invitations" :key="invitation.id" class="column is-one-quarter">
			<user-invitation-box :user="invitation" :community="community"></user-invitation-box>
		</div>
	</div>
	<div v-if="isOwner">
		<button class="button is-danger" @click="deleteCommunity" v-bind:disabled="isDeleting">削除</button>
	</div>

	<div v-if="isMember" class="columns">
		<new-community-page-modal :showModal="showNewPageModal" :communityId="$route.params.communityId" @closeModal="closeModal"></new-community-page-modal>
		<div class="column is-two-thirds">
			<button class="button is-primary" @click="showNewPageModal = true">ページ追加</button>
			<suggest-form v-on:enter="enter"/>
			<button class="button is-primary" v-bind:disabled="!formvalue" @click='addMember'>追加</button>
		</div>
	</div>

</div>
</section>

</template>
<script>
import NewCommunityPageModal from '~/components/modal/NewCommunityPageModal'
// import firebase from 'firebase/app'
import { db } from '~/plugins/firebase'
import SuggestForm from '~/components/SuggestForm.vue'
import ListUserBox from '~/components/molecules/ListUserBox'
import UserInvitationBox from '~/components/user/UserInvitationBox'

export default {
	components: {
		SuggestForm,
		NewCommunityPageModal,
		ListUserBox,
		UserInvitationBox
	},
	data() {
		return {
			community: {},
			members: [],
			pages:[],
			invitations: [],
			formvalue: '', //userID
			showNewPageModal: false,
			isDeleting: false
		}
	},
	async created() {
		this.community = (await this.$axios.$get(`communities/${this.$route.params.communityId}`)).data
		this.pages = (await this.$axios.$get(`pages?communityid=${this.community.ID}`)).data
	},
	methods: {
		enter: function (value) {
			this.formvalue = value.item.id
		},
		addMember: function () {
			const usersRef = db.collection("/users")
			const communitiesRef = db.collection("/communities")

			const batch = db.batch();
			
			const notificationRef = usersRef.doc(this.formvalue).collection('notifications').doc()
			batch.set(notificationRef, {
				type: 'community_invitation',
				community: this.$route.params.communityId,
				created_at: new Date(),
				read: false
			});

			const invitationRef = communitiesRef.doc(this.$route.params.communityId).collection('invitations').doc(this.formvalue)
			batch.set(invitationRef, {created_at: new Date(), user: this.formvalue});

			batch.commit().then(() => {
				window.alert('コミュニティへの招待を送信しました。')
			})
			.catch(error => {
				window.alert('エラーが発生しました')
			});
			// const communityDocRef = db.collection("/communities").doc(this.$route.params.communityId)

			// communityDocRef.update({
			// 	members: firebase.firestore.FieldValue.arrayUnion(this.formvalue)
			// });
		},
		closeModal: function() {
			this.showNewPageModal = false
		},
		follow() {
			this.$store.dispatch('user/followCommunity', this.$route.params.communityId).catch(err => {
				console.log(err)
				window.alert("error")
			})
		},
		unFollow() {
			this.$store.dispatch('user/unFollowCommunity', this.$route.params.communityId).catch(err => {
				console.log(err)
				window.alert("error")
			})
		},
		deleteCommunity() {
			if(!window.confirm('コミュニティを削除します。よろしいですか？')){
				return
			}
			this.isDeleting = true
			this.$store.dispatch('user/deleteCommunity', this.$route.params.communityId).then(res => {
				window.alert('コミュニティを削除しました。')
				this.$router.push('/')
			}).catch(err => {
				window.alert("削除に失敗しました")
			}).finally(() => {
				this.isDeleting = false
			})
		},
		fetchInvitations() {
			communitiesRef.doc(this.$route.params.communityId).collection('invitations').get().then(invitations => {
				invitations.forEach(async invitation => {
					//this.invitations.push({id: invitation.id, data: invitation.data()})
					this.invitations.push(await this.$store.dispatch('otherUsers/fetchUser', invitation.id))
				})
			})
		}
	},
	computed: {
		isMember: function () {
			return this.$store.getters['user/isCommunityMember'](this.community.ID)
		},
		isOwner: function () {
			return true
			// if(this.community.data && this.community.data.owner) {
			// 	return this.$store.getters['user/isCommunityOwner'](this.community.data.owner)
			// }
			// return false
		},
		isFollowingCommunity: function () {
			return this.$store.getters['user/isFollowingCommunity'](this.$route.params.communityId)
		}
	},
	watch: {
    community: async function () {
			let members = []
			if(this.community.data && this.community.data.members) {

				const usersRef = db.collection("/users")
				for(let member of this.community.data.members) {
					usersRef.doc(member).get().then(doc => {
						members.push({id: doc.id, data: doc.data()})
					})
					// snapshot.forEach(doc => {
					// 	members.push({id: doc.id, data: doc.data()})
					// })
				}
				this.members = members
			}
    },
  }
}
</script>
