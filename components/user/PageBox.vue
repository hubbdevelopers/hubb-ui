<template>
<div>
  <div class="card">
    <div class="card-image">
      <nuxt-link :to="link">
      <figure class="image is-4by3">
        <img v-if="page.Image" v-bind:src="page.Image" alt="ユーザー画像">
        <img v-else src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image">
      </figure>
      </nuxt-link>
    </div>
    <div class="card-content">
      <p class="title">{{page.Name}}</p>
      <div class="content">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Phasellus nec iaculis mauris.
      </div>
    </div>
  </div>
  <!--nuxt-link :to="'/' + user.data.account_id">{{user}} {{isFollowingUser}} </nuxt-link-->

</div>
</template>
<script>
import { db } from '~/plugins/firebase'

export default {
  data() {
    return {
      page: {},
      user: {}
    }
  },
  props: {
    pageId: String,
  },
  async created() {
    this.page = (await this.$axios.$get(`pages/${this.pageId}`)).data

    if(this.page.OwnerType === 'users') {
      this.user = (await this.$axios.$get(`users/${this.page.OwnerId}`)).data
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