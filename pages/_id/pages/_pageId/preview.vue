<template>
  <div>
    <loading :is-loading="isLoading" />
    <page>
      <template v-slot:main>
        <page-main-preview
          :name="$store.state.page.name"
          :image="$store.state.page.image"
          :content="$store.state.page.content"
        />
      </template>
      <template v-slot:bottom>
        <div class="back-button">
          <app-button
            @click="
              $router.push(
                `/${$route.params.id}/pages/${$route.params.pageId}/edit`
              )
            "
            :width="200"
            type="primary"
            >戻る</app-button
          >
        </div>
      </template>
    </page>
  </div>
</template>
<script lang="ts">
import Page from '~/components/templates/Page.vue'
import PageMainPreview from '~/components/organisms/PageMainPreview.vue'
import AppButton from '~/components/atoms/AppButton.vue'
import { Vue, Component } from 'vue-property-decorator'

@Component({
  components: {
    Page,
    PageMainPreview,
    AppButton
  },
  /* eslint-disable @typescript-eslint/no-explicit-any */
  head() {
    return {
      title:
        this.$store.state.page.name !== ''
          ? `${this.$store.state.page.name} | Hubb`
          : 'Hubb'
    }
  }
})
export default class extends Vue {}
</script>
<style lang="scss" scoped>
.back-button {
  text-align: center;
}
</style>
