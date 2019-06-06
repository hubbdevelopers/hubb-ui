<template>
  <div>
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
import meta from '~/mixins/pageMeta'

@Component({
  mixins: [meta],
  components: {
    Page,
    PageMainPreview,
    AppButton
  }
})
export default class extends Vue {}
</script>
<style lang="scss" scoped>
.back-button {
  text-align: center;
}
</style>
