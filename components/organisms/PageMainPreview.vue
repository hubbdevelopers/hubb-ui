<template>
  <div>
    <div v-if="image" class="columns is-centered">
      <div class="column is-half">
        <page-main-image :image="image" />
      </div>
    </div>
    <page-title>{{ name }}</page-title>
    <div class="content">
      <page-content :content="content" />
    </div>
  </div>
</template>
<script lang="ts">
import PageMainImage from '~/components/atoms/PageMainImage.vue'
import PageContent from '~/components/atoms/PageContent.vue'
import PageTitle from '~/components/atoms/PageTitle.vue'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  components: {
    PageMainImage,
    PageContent,
    PageTitle
  }
})
export default class extends Vue {
  @Prop({ required: true }) readonly image!: string
  @Prop({ required: true }) readonly name!: string
  @Prop({ required: true }) readonly content!: string
}
</script>
<style lang="scss" scoped>
.content {
  margin: 20px 0 50px;
}
.draft {
  background-color: yellow;
  margin-bottom: 15px;
}
.twitter {
  margin: 20px 0;
}
</style>
