<template>
<section class="section">
<div class="container">
	<div v-if="isOwner">
		<p>このページの所有者です</p>
		<new-page-modal :showModal="showNewPageModal" @closeModal="closeModal"></new-page-modal>
		<new-community-modal :showModal="showNewCommunityModal" @closeModal="closeModal"></new-community-modal>
	</div>

	<div class="columns">

	<div class="column is-one-third">
		<user-profile v-if="user" :user="user" />
	</div>

	<div class="column">
		<h2 class="is-size-3">ページ一覧</h2>
		<div class="columns is-multiline">
      <div v-for="page in pages" :key="page.ID" class="column is-three-fifths is-offset-one-fifth">
        <page-box :pageId="page.ID.toString()" />
      </div>
		</div>

		<h2 class="is-size-3">コミュニティ一覧</h2>
		<div class="columns is-multiline">
			<div v-for="community in communities" :key="community.id" class="column is-one-third">
				<div class="card">
					<div class="card-image">
						<nuxt-link :to="'/i/community/' + community.ID">
						<figure class="image is-4by3">
							<img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image">
						</figure>
						</nuxt-link>
					</div>
					<div class="card-content">

						<div class="content">
							<p class="title">
								{{community.Name}}
							</p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit.
							Phasellus nec iaculis mauris.
						</div>
					</div>
				</div>
			</div>
		</div>

		<div v-if="isOwner">
			<button class="button is-primary" @click="showNewPageModal = true">ページ追加</button>
			<button class="button is-primary" @click="showNewCommunityModal = true">コミュニティ追加</button>
			<button class="button is-primary" @click="goConfigPage">設定</button>
			<button class="button is-danger" @click="withdraw">退会</button>
		</div>
	</div>
	</div>
</div>
</section>
</template>
<script>
import NewPageModal from '~/components/modal/NewPageModal'
import NewCommunityModal from '~/components/modal/NewCommunityModal'
import UserProfile from '~/components/organisms/UserProfile'
import PageBox from '~/components/organisms/PageBox'

export default {
  props: {
    user: {
      type: Object,
      required: true
    },
    pages: {
      type: Array,
      required: true
    },
    communities: {
      type: Array,
      required: true
    }
  },
	components: {
		NewPageModal,
		NewCommunityModal,
    UserProfile,
    PageBox
	},
	data() {
		return {
			showNewPageModal: false,
			showNewCommunityModal: false,
		}
	},
	methods: {
		goConfigPage() {
			this.$router.push({ path: 'config', append: true })
		},
		closeModal() {
			this.showNewPageModal = false
			this.showNewCommunityModal = false
		},
		withdraw() {
			this.$router.push({ path: 'withdraw', append: true })
			// this.$store.dispatch('user/withdraw').catch(err => {
			// 	console.log(err)
			// 	window.alert("error")
			// }) 
		}
	},
	computed: {
		isOwner: function () {
			return this.$store.getters['user/isMyId'](this.$route.params.userId)
		}
	}
}
</script>