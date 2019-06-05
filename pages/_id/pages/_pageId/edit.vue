<template>
  <page-edit :page="page" :canEdit="isOwner" />
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import PageEdit from '~/components/templates/PageEdit.vue'
import { Page, blankPage, getPage } from '~/common/page'

@Component({
  components: {
    PageEdit
  }
})
export default class extends Vue {
  page: Page = blankPage

  get isOwner() {
    return (
      this.$store.getters['user/isMyId'](this.page.data.userId) &&
      this.page.data.pageType === 'user'
    )
  }
  async created() {
    this.page = await getPage(this.$route.params.pageId)
  }
}
</script>
