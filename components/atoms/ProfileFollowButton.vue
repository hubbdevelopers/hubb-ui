<template>
  <div v-if="!isOwner">
    <button v-if="isFollowingUser" @click="unfollow" class="button is-primary">
      フォロー中
    </button>
    <button v-else @click="follow" class="button is-primary is-outlined">
      フォローする
    </button>
  </div>
</template>
<script>
export default {
  props: {
    isFollowingUser: {
      type: Boolean,
      default: false
    },
    isOwner: {
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
