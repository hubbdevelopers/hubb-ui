<template>
  <p v-if="birthday">
    <span class="icon has-text-dark">
    <i class="fas fa-birthday-cake"></i>
    </span><span>{{displayBirthday}}</span>
  </p>
</template>
<script>
import moment from 'moment'
export default {
  props: {
    birthday: {
      required: true
    }
  },
  computed: {
    displayBirthday() {
			return this.birthday ? moment(this.birthday).format('YYYY/MM/DD') : ''
    }
  }
}
</script>

