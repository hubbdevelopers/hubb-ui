<template>
  <section class="section">
    <div class="container">
      <div v-if="isOwner">
        <new-page-modal
          :showModal="showNewPageModal"
          @closeModal="closeModal"
        />
        <!-- <new-community-modal
          :showModal="showNewCommunityModal"
          @closeModal="closeModal"
        /> -->
      </div>

      <div class="columns">
        <div class="column is-one-third">
          <user-profile v-if="user" :user="user" />
        </div>

        <div class="column">
          <mypage-tab-area
            :user="user"
            :pages="pages"
            :communities="communities"
          />
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import NewPageModal from '~/components/organisms/NewPageModal.vue'
import NewCommunityModal from '~/components/modal/NewCommunityModal.vue'
import UserProfile from '~/components/organisms/UserProfile.vue'
import MypageTabArea from '~/components/organisms/MypageTabArea.vue'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { User } from '~/common/user'
import { Page } from '~/common/page'

@Component({
  components: {
    NewPageModal,
    NewCommunityModal,
    UserProfile,
    MypageTabArea
  }
})
export default class extends Vue {
  @Prop({ required: true }) readonly user!: User
  @Prop({ required: true }) readonly pages!: Page[]
  @Prop({ required: true }) readonly communities!: any

  showNewPageModal: boolean = false
  showNewCommunityModal: boolean = false

  get isOwner() {
    return this.$store.getters['user/isMyId'](this.$route.params.id)
  }
  closeModal() {
    this.showNewPageModal = false
    this.showNewCommunityModal = false
  }
}
</script>
