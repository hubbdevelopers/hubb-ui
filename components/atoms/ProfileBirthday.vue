<template>
  <p v-if="birthday">
    <span class="icon has-text-dark">
      <i class="fas fa-birthday-cake" />
    </span>
    <span>{{ displayBirthday }}</span>
  </p>
</template>
<script>
import dayjs from 'dayjs'
export default {
  props: {
    birthday: {
      type: String,
      required: true
    }
  },
  computed: {
    displayBirthday() {
      return this.birthday ? dayjs(this.birthday).format('YYYY/MM/DD') : ''
    }
  }
}
</script>
