<template>
<div>
  <button v-if="isLiked && isLogin" class="button" @click="unlikePage">
      <span class="icon is-small">
          <i class="fas fa-heart has-text-danger"></i>
      </span>
  </button>
  <button v-else-if="isLogin" class="button" @click="likePage" >
      <span class="icon is-small">
          <i class="fas fa-heart has-text-grey-lighter"></i>
      </span>
  </button>
  <button v-else class="button" disabled>
      <span class="icon is-small">
          <i class="fas fa-heart has-text-grey-lighter"></i>
      </span>
  </button>
  
  <span>{{likeCount}}</span>
</div>
</template>
<script>
export default {
  props: {
    isLiked: {
      type: Boolean,
      required: true,
    },
    isLogin: {
      type: Boolean,
      required: true,
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
