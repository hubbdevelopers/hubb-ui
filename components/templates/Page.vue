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

          <page-comment :is-login="isLogin" :comments="comments" />
        </div>
      </div>
    </div>
    <!-- <page-config-modal
      :is-active="isActiveConfigModal"
      @close="closeConfigModal"
      @delete-page="deletePage"
      v-if="canEdit"
    /> -->
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
  comments = []
  likes = []
  isActiveConfigModal = false

  get isLiked() {
    return this.$store.getters['user/isLikedPage'](this.$route.params.pageId)
  }

  get isLogin() {
    return this.$store.getters['user/isLogin']
  }

  async created() {
    try {
      // this.comments = (await this.$axios.$get(
      //   `comments?pageid=${this.$route.params.pageId}`
      // )).data
      // this.likes = (await this.$axios.$get(`likes?pageid=${this.$route.params.pageId}`)).data
    } catch (e) {
      console.log(e)
    }
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
