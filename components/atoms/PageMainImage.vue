<template>
  <figure class="image container is-128x128">
    <img :src="image" alt="ページメイン画像" />
  </figure>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class extends Vue {
  @Prop({ required: true }) readonly image!: string
}
</script>
