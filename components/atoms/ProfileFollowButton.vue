<template>
  <div>
    <button v-if="isFollowingUser" class="button is-primary" @click="unfollow">フォロー中</button>
    <button v-else class="button is-primary is-outlined" @click="follow">フォローする</button>
  </div>
</template>
<script>
export default {
  props: {
    isFollowingUser: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    follow() {
      this.$emit('follow')
    },
    unfollow() {
      this.$emit('unfollow')
    }
  }
}
</script>
