<template>
  <div>{{ howManyDaysAgo }}</div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import PageOwnerInfo from '~/components/molecules/PageOwnerInfo.vue'
import moment from 'moment'

@Component({
  components: {
    PageOwnerInfo
  }
})
export default class extends Vue {
  @Prop({ required: true }) readonly date!: any

  get howManyDaysAgo() {
    return this.date ? moment(this.date.toDate()).fromNow() : ''
  }
}
</script>
