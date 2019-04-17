<template>
  <div>{{ $$howManyDaysAgo(date) }}</div>
</template>
<script>
import dateMixin from '~/mixins/dateMixin'
export default {
  mixins: [dateMixin],
  props: {
    date: {
      type: Object | String,
      required: true
    }
  }
}
</script>
