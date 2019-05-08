<template>
  <section v-if="owner" class="section">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-half">
          <page-main
            :page="page"
            :owner="owner"
            :is-user="true"
            :is-community="false"
            :can-edit="canEdit"
            :is-login="isLogin"
            :is-liked="isLiked"
            @click-ellipsis="showConfigModal"
          />
          <hr />
          <page-comment :page="page" :is-login="isLogin" />
        </div>
      </div>
    </div>
    <page-config-modal
      :is-active="isActiveConfigModal"
      @close="closeConfigModal"
      @delete-page="deletePage"
      v-if="canEdit"
    />
  </section>
</template>
<script lang="ts">
import PageMain from '~/components/organisms/PageMain.vue'
import PageComment from '~/components/organisms/PageComment.vue'
import PageConfigModal from '~/components/organisms/PageConfigModal.vue'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Page } from '~/common/page'
import { User } from '~/common/user'

@Component({
  components: {
    PageMain,
    PageComment,
    PageConfigModal
  }
})
export default class extends Vue {
  @Prop({ required: true }) readonly page!: Page
  @Prop({ required: true }) readonly owner!: User
  @Prop({ default: false }) readonly isDeleting!: boolean
  @Prop({ default: false }) readonly canEdit!: boolean
  isActiveConfigModal = false

  get isLiked() {
    return this.page.likedBy.includes(this.$store.state.user.id)
  }

  get isLogin() {
    return this.$store.getters['user/isLogin']
  }

  deletePage() {
    this.$emit('deletePage')
  }
  showConfigModal() {
    this.isActiveConfigModal = true
  }
  closeConfigModal() {
    this.isActiveConfigModal = false
  }
}
</script>
<style lang="scss">
.page {
  max-width: 677px;
}
</style>
