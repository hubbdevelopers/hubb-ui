<template>
  <edit :page="page" :canEdit="isMember" />
</template>
<script>
import Edit from '~/components/templates/PageEdit.vue'

export default {
  components: {
    Edit
  },
  data() {
    return {
      page: ''
    }
  },
  computed: {
    isMember: function() {
      return (
        this.$store.getters['user/isCommunityMember'](this.page.OwnerId) &&
        this.page.OwnerType === 'communities'
      )
    }
  },
  async created() {
    this.page = (await this.$axios.$get(
      `/pages/${this.$route.params.pageId}`
    )).data
  }
}
</script>
