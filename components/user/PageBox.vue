<template>
<article class="is-clearfix page-box is-mobile has-shadow">
  <div class="is-pulled-left is-two-thirds">
    <n-link :to="link">
      <h1 class="is-size-4">{{page.Name}}</h1>
    </n-link>
    <page-owner-info :owner="user" :page="page" :isUser="true"/>
  </div>
  <div class="is-pulled-right">
      <figure class="image is-64x64">
        <n-link :to="link">
          <img v-if="page.Image" v-bind:src="page.Image" alt="ページ画像">
          <img v-else src="https://bulma.io/images/placeholders/128x128.png" alt="ページ画像">
        </n-link>
      </figure>
      <div>
        <span><i class="far fa-heart"></i> {{likes.length}} </span>
        <span><i class="far fa-comment"></i> {{comments.length}}</span>
      </div>
  </div>

</article>
</template>

<script>
import dateMixin from '~/mixins/dateMixin'
import PageOwnerInfo from '~/components/molecules/PageOwnerInfo.vue'
export default {
  mixins: [dateMixin],
  components: {
    PageOwnerInfo
  },
  data() {
    return {
      page: {},
      user: {},
      comments: [],
			likes: [],
    }
  },
  props: {
    pageId: String,
  },
  async created() {
    try {
      this.page = (await this.$axios.$get(`pages/${this.pageId}`)).data
      if (this.page.OwnerType === 'users') {
        this.user = (await this.$axios.$get(`users/${this.page.OwnerId}`)).data
      } else if(this.page.OwnerType === 'communities'){
        // TODO
      }
			this.comments = (await this.$axios.$get(`comments?pageid=${this.pageId}`)).data
			this.likes = (await this.$axios.$get(`likes?pageid=${this.pageId}`)).data
		} catch(e) {
			console.log(e)
		}
  },
  computed: {
    link: function() {
      if(this.page.OwnerType === 'users') {
        return '/' + this.user.AccountId + '/' + this.page.ID
      }else if(this.page.OwnerType === 'communities'){
        return '/i/community/' + this.page.OwnerId + '/' + this.page.ID
      }else {
        return '/'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
a { 
  text-decoration: none;
  color: gray
}

a:hover { 
  text-decoration: none;
  color: gray
}

.page-box {
  box-shadow: 1px 1px 2px gray;
  margin-top: 1px;
  padding: 5px 10px;
}

</style>