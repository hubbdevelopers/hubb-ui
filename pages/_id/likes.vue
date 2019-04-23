<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-one-third">
          <user-profile v-if="user" :user="user" />
        </div>
        <div class="column">
          <h1 class="title">いいね</h1>
          <div class="columns is-multiline">
            <div
              v-for="page in pages"
              :key="page.ID"
              class="column is-three-fifths is-offset-one-fifth"
            >
              <page-box :pageId="page.ID" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import PageBox from '~/components/molecules/PageBox'
import UserProfile from '~/components/organisms/UserProfile'

export default {
  components: {
    UserProfile,
    PageBox
  },
  data() {
    return {
      user: null,
      likes: [],
      pages: []
    }
  },
  computed: {
    // isOwner: function() {
    //   return this.$store.getters['user/isMyId'](this.$route.params.userId)
    // }
  },
  async created() {
    // this.user = (await this.$axios.$get(
    //   `/users/${this.$route.params.userId}`
    // )).data
    // this.likes = (await this.$axios.$get(
    //   `/likes?userid=${this.$route.params.userId}`
    // )).data

    this.likes.forEach(async like => {
      const page = (await this.$axios.$get(`/pages/${like.PageId}`)).data
      this.pages.push(page)
    })
  }
}
</script>
