<template>
  <div>
    <button v-if="isLiked && isLogin" @click="unlikePage" class="button">
      <span class="icon is-small">
        <i class="fas fa-heart has-text-danger" />
      </span>
    </button>
    <button v-else-if="isLogin" @click="likePage" class="button">
      <span class="icon is-small">
        <i class="fas fa-heart has-text-grey-lighter" />
      </span>
    </button>
    <button v-else class="button" disabled>
      <span class="icon is-small">
        <i class="fas fa-heart has-text-grey-lighter" />
      </span>
    </button>

    <span>{{ likeCount }}</span>
  </div>
</template>
<script>
export default {
  props: {
    isLiked: {
      type: Boolean,
      required: true
    },
    isLogin: {
      type: Boolean,
      required: true
    },
    likeCount: {
      type: Number,
      default: 0
    }
  },
  methods: {
    likePage() {
      this.$emit('like-page')
    },
    unlikePage() {
      this.$emit('unlike-page')
    }
  }
}
</script>
