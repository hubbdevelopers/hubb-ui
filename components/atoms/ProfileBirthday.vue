<template>
  <p>
    <span class="icon has-text-dark" v-if="birthday">
    <i class="fas fa-birthday-cake"></i>
    </span><span>{{displayBirthday}}</span>
  </p>
</template>
<script>
import moment from 'moment'
export default {
  props: {
    birthday: {
      type: String,
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

