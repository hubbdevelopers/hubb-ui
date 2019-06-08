<template>
  <div>{{ howManyDaysAgo }}</div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import PageOwnerInfo from '~/components/molecules/PageOwnerInfo.vue'
import dayjs from 'dayjs'

@Component({
  components: {
    PageOwnerInfo
  }
})
export default class extends Vue {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Prop({ required: true }) readonly date!: Record<string, any>

  get howManyDaysAgo(): string {
    if (!this.date) {
      return ''
    }

    if (this.date instanceof Date) {
      return dayjs(this.date).fromNow()
    }

    if (typeof this.date['toDate'] === 'function') {
      // TimeStamp
      return dayjs(this.date.toDate()).fromNow()
    }
    return ''
  }
}
</script>
