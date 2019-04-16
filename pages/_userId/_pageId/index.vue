<template>
  <page
    v-if="page"
    :canEdit="isOwner"
    :page="page"
    :isDeleting="isDeleting"
    @deletePage="deletePage"
  />
</template>
<script>
import Page from '~/components/templates/Page.vue'

export default {
  components: {
    Page
  },
  data() {
    return {
      page: null,
      isDeleting: false
    }
  },
  computed: {
    isOwner: function() {
      return (
        this.$store.getters['user/isMyId'](this.page.OwnerId) &&
        this.page.OwnerType === 'users'
      )
    }
  },
  async created() {
    try {
      this.page = (await this.$axios.$get(
        `pages/${this.$route.params.pageId}`
      )).data
    } catch (e) {
      console.log(e)
    }
  },
  methods: {
    deletePage() {
      if (!window.confirm('ページを削除します。よろしいですか？')) {
        return
      }
      this.isDeleting = true
      this.$store
        .dispatch('user/deletePage', this.$route.params.pageId)
        .then(() => {
          this.$router.push(`/${this.$store.state.user.id}`)
        })
        .catch(err => {
          console.log(err)
          window.alert('削除に失敗しました')
        })
        .finally(() => {
          this.isDeleting = false
        })
    }
  }
}
</script>
