<template>
  <edit :page="page" :canEdit="isOwner" />
</template>
<script>
import Edit from '~/components/Edit.vue'

export default {
  components: {
    Edit
  },
  data() {
    return {
      page: {}
    }
  },
  computed: {
    // isOwner: function() {
    //   return (
    //     this.$store.getters['user/isMyId'](this.page.OwnerId) &&
    //     this.page.OwnerType === 'users'
    //   )
    // }
  },
  async created() {
    // this.page = (await this.$axios.$get(
    //   `/pages/${this.$route.params.pageId}`
    // )).data
  }
}
</script>
