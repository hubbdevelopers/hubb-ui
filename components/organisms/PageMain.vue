<template>
  <div>
    <div class="columns is-centered" v-if="page.Image">
			<div class="column is-half">
				<page-main-image :image="page.Image" />
			</div>
		</div>
		<page-title>{{page.Name}}</page-title>

    <div class="columns is-mobile is-vcentered">
      <div class="column is-three-quarters">
        <page-owner-info :owner="owner" :page="page" :is-user="isUser" :is-community="isCommunity"/>
      </div>
      <div class="column" v-if="canEdit">
        <app-ellipsis @click="clickEllipsis()"/>
      </div>
    </div>
		<page-content class="content" :content="page.Content"/>
		
    <div class="columns is-mobile is-vcentered">
      <div class="column is-three-quarters">
        <page-owner-info :owner="owner" :page="page" :is-user="isUser" :is-community="isCommunity"/>
      </div>
      <div class="column">
		    <page-like :is-liked="isLiked" :is-login="isLogin" :like-count="likeCount" @like-page="likePage" @unlike-page="unlikePage"/>
      </div>
    </div>
  </div>
</template>
<script>
import PageOwnerInfo from '~/components/molecules/PageOwnerInfo'
import PageMainImage from '~/components/atoms/PageMainImage'
import PageContent from '~/components/atoms/PageContent'
import PageLike from '~/components/atoms/PageLike'
import PageTitle from '~/components/atoms/PageTitle'
import AppEllipsis from '~/components/atoms/AppEllipsis'

export default {
  components: {
    PageOwnerInfo,
		PageMainImage,
		PageContent,
		PageLike,
    PageTitle,
    AppEllipsis
  },
  data() {
    return {
      likeCount: 0
    }
  },
  props: {
    page: {
      required: true,
      type: Object
    },
    owner: {
      required: true,
      type: Object
    },
    isUser: {
      type: Boolean,
      default: false
    },
    isCommunity: {
      type: Boolean,
      default: false
    },
    canEdit: {
      type: Boolean,
      required: true
    }
  },
	async created() {
    this.likeCount = (await this.$axios.$get(`likes?pageid=${this.$route.params.pageId}`)).data.length
	},
  methods: {
    likePage() {
			this.$store.dispatch('user/likePage', this.$route.params.pageId).then(res => {
        this.likeCount++
      }).catch(err => {
				window.alert("いいねに失敗しました")
			})
		},
		unlikePage() {
			this.$store.dispatch('user/unlikePage', this.$route.params.pageId).then(res => {
        this.likeCount--
      }).catch(err => {
				window.alert("いいね取り消しに失敗しました")
			})
    },
    clickEllipsis() {
      this.$emit('click-ellipsis')
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
}
</script>
<style lang="scss" scoped>
.content {
  margin-bottom: 40px
}
</style>
