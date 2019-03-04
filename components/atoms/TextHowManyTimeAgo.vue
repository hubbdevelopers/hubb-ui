<template>
  <div>{{$_howManyDaysAgo(date)}}</div>
</template>
<script>
import dateMixin from '~/mixins/dateMixin'
export default {
  mixins: [dateMixin],
  props: {
    date: {
      type: String,
      required: true
    }
  }
}
</script>
